import { Injectable } from '@nestjs/common';
import * as cron from 'node-cron';
import axios from 'axios';
import { SupabaseService } from '../supabase/supabase.service';
import { PubSubService } from '../pub-sub/pub_sub.service';
import { EmailService } from '../email-service/email.service';
import { ScheduleTask, ScheduleTaskResponse, UpdateScheduleTask, updateKeywordResult } from '../models/scheduleTaskModels';
import { ScrapeResult } from '../models/scraperModels';
import logger from '../logging/webscraperlogger';
const serviceName = "[SchedulerService]";

@Injectable()
export class SchedulerService {
  topicName: string;
  isRunning = false; // Lock variable to track if a job is running

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly pubsubService: PubSubService,
    private readonly emailService: EmailService 
  ) {
    logger.info(serviceName,'Scheduler service initialized');
    this.topicName = process.env.GOOGLE_CLOUD_TOPIC;

    // Schedule the cron job to run every minute
    cron.schedule('* * * * *', () => this.checkSchedules());
  }

  

  async checkSchedules() {
    if (this.isRunning) {
      logger.info(serviceName,'Job already running, skipping...');
      return; // Prevent new job if one is already running
    }
  
    this.isRunning = true; // Set lock
  
    try {
      logger.info(serviceName,'Checking schedules...');
      const dueSchedules = await this.supabaseService.getDueSchedules() as ScheduleTaskResponse[];
      if (!dueSchedules || dueSchedules.length === 0) {
        logger.info(serviceName,'No due schedules found');
        return;
      }
      console.info(serviceName,'Number of due schedules:', dueSchedules.length);
      logger.info(serviceName,'Number of due schedules:', dueSchedules.length);
  
      const apiUrl = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:3002/api';
      const pollScrapeEndpoint = `${apiUrl}/scraper/status?type=scrape`;
      const pollKeywordEndpoint = `${apiUrl}/scraper/keyword-status?`;
  
      // Array to hold all concurrent polling promises
      const pollingPromises: Promise<void>[] = [];
  
      for (const schedule of dueSchedules) {
        // Publish scrape tasks
        const message = {
          type: 'scrape',
          data: { url: schedule.url }
        };
        await this.pubsubService.publishMessage(this.topicName, message);
  
        // Schedule a polling task for the scrape endpoint
        const scrapeEndpoint = `${pollScrapeEndpoint}&url=${encodeURIComponent(schedule.url)}`;
        pollingPromises.push(this.pollForResults(scrapeEndpoint, schedule));
  
        // Publish and schedule keyword analysis tasks
        const keywords = schedule.keywords;
        for (const keyword of keywords) {
          const keywordMessage = {
            type: 'keyword-analysis',
            data: { url: schedule.url, keyword }
          };
          await this.pubsubService.publishMessage(this.topicName, keywordMessage);
  
          // Schedule a polling task for each keyword analysis endpoint
          const keywordEndpoint = `${pollKeywordEndpoint}url=${encodeURIComponent(schedule.url)}&keyword=${encodeURIComponent(keyword)}`;
          pollingPromises.push(this.pollForResults(keywordEndpoint, schedule));
        }
      }
  
      // Execute all polling operations concurrently
      await Promise.all(pollingPromises);
    } catch (error) {
      logger.error(serviceName,'Error during job execution:', error);
    } finally {
      this.isRunning = false; // Release lock
    }
  }
 
  async pollForResults(endpoint: string, schedule: ScheduleTaskResponse) {
    const maxRetries = 20;
    const retryDelay = 10000; // 10 seconds
  
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        logger.info(`Polling API endpoint: ${endpoint}, for task: ${schedule.url}, attempt ${attempt + 1}`);
        
        // Validate if the endpoint is correct for the schedule's URL
        // if (!endpoint.includes(encodeURIComponent(schedule.url))) {
        //   logger.info(serviceName,'Invalid endpoint for schedule, skipping...');
        //   return;
        // }
  
        const response = await axios.get(endpoint);
  
        if (response.data && response.data.status === 'completed') {
          await this.handleApiResults(response.data.result, schedule);
          break; // Exit the loop on success
        } else {
          logger.info(`Attempt ${attempt + 1} failed. Retrying after ${retryDelay / 1000} seconds...`);
          await this.delay(retryDelay); // Delay before retrying
        }
      } catch (error) {
        logger.error(serviceName,'Error while polling API:', error);
        await this.delay(retryDelay); // Delay before retrying on error
      }
    }
  }
  

  async handleApiResults(results: any, schedule: ScheduleTaskResponse) {
    // Check if its scrape or keyword analysis
    if (results.keyword) {
      await this.handleKeywordResults(results, schedule);
    } else {
      await this.handleScrapeResults(results, schedule);
    }
  }

  async handleScrapeResults(results: ScrapeResult, schedule: ScheduleTaskResponse) {
    // Process results and update Supabase or take further actions
    logger.info(serviceName,'Received scrape results for URL:', schedule.url );
    
    // Example of updating Supabase with the results
    const updateMessage = {
      id: schedule.id,
      result_history: schedule.result_history,
      newReactionCount: results.shareCountdata?.Facebook?.reaction_count || 0,
      newCommentCount: results.shareCountdata?.Facebook?.comment_count || 0,
      newShareCount: results.shareCountdata?.Facebook?.share_count || 0,
      newTotalEngagement: results.shareCountdata?.Facebook?.total_count || 0,
      newPinCount: results.shareCountdata?.Pinterest || 0,
      newNewsSentiment: results.scrapeNews,
      newRating: results.reviews?.rating || 0,
      newNumReviews: results.reviews?.numberOfReviews || 0,
      newTrustIndex: results.reviews?.trustIndex || 0,
      newNPS: results.reviews?.NPS || 0,
      newRecommendationStatus: results.reviews?.recommendationStatus || '',
      newStarRatings: results.reviews?.starRatings || {},
      newSiteSpeed: results.seoAnalysis?.siteSpeedAnalysis?.loadTime || 0,
      newPerformanceScore: results.seoAnalysis?.lighthouseAnalysis?.scores?.performance || 0,
      newAccessibilityScore: results.seoAnalysis?.lighthouseAnalysis?.scores?.accessibility || 0,
      newBestPracticesScore: results.seoAnalysis?.lighthouseAnalysis?.scores?.bestPractices || 0,
    } as UpdateScheduleTask;

    logger.info(serviceName,'Updating scrape results');
    await this.supabaseService.updateSchedule(updateMessage);
    // Update the next scrape time for the schedule
    logger.info(serviceName,'Updating next scrape time for:', schedule.url);
    await this.supabaseService.updateNextScrapeTime(schedule);

    const email = await this.supabaseService.getEmailByScheduleId(schedule.id);
    const scheduleUpdateDate = new Date(schedule.updated_at).toLocaleString();
    const nextScrapeDate = new Date(schedule.next_scrape).toLocaleString();
  
    if (email) {
      const emailText = 
`Your scheduled scraping task for ${schedule.url} has been successfully scraped as of ${scheduleUpdateDate}.\nHere some key metrics:
      - Average Star Rating: ${results.reviews?.rating|| 'N/A'} / 5
      - Performance Score: ${results.seoAnalysis?.lighthouseAnalysis?.scores?.performance.toFixed(2) || 'N/A'} / 100
      - Accessibility Score: ${results.seoAnalysis?.lighthouseAnalysis?.scores?.accessibility.toFixed(2) || 'N/A'} / 100
      - Best Practices Score: ${results.seoAnalysis?.lighthouseAnalysis?.scores?.bestPractices.toFixed(2) || 'N/A'} / 100
      - Facebook Total Engagement: ${results.shareCountdata?.Facebook?.total_count || 0}
      - Facebook Reactions: ${results.shareCountdata?.Facebook?.reaction_count || 0}
      - Facebook Comments: ${results.shareCountdata?.Facebook?.comment_count || 0}
      - Facebook Shares: ${results.shareCountdata?.Facebook?.share_count || 0}
      - Pinterest Pin Count: ${results.shareCountdata?.Pinterest || 0}
      - Number of Reviews: ${results.reviews?.numberOfReviews || 0}
      - Trust Index: ${results.reviews?.trustIndex || 'N/A'}
      - NPS (Net Promoter Score): ${results.reviews?.NPS || 'N/A'}
      
Visit http://capstone-wee.dns.net.za/ to view the full results and how your metrics have changed over time.
Your next scrape will take place on ${nextScrapeDate}.

      
Thank you for using our service!

Kind regards,
The Web Exploration Team`;
    
      try {
        await this.emailService.sendMail(email, `New results available! ${schedule.url}`, emailText);
        console.log(`Email sent successfully to ${email}`);
      } catch (emailError) {
        console.error('Error sending email:', emailError);
      }
    } else {
      console.error('No email found for schedule ID:', schedule.id);
    }
  }

  async handleKeywordResults(results: any, schedule: ScheduleTaskResponse) {
    // Process results and update Supabase or take further actions
    logger.info(serviceName,'Received keyword results for url and keyword:', results.url, results.keyword);

    const updateKeywordResult = {
      id: schedule.id,
      keyword: results.keyword,
      results: schedule.keyword_results,
      newRank: results.ranking,
      newTopTen: results.topTen,
    } as updateKeywordResult;

    logger.info(serviceName,'Updating keyword results');
    await this.supabaseService.updateKeywordResult(updateKeywordResult);
  }
  
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
