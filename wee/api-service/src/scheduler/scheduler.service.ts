import { Injectable } from '@nestjs/common';
import * as cron from 'node-cron';
import axios from 'axios';
import { SupabaseService } from '../supabase/supabase.service';
import { PubSubService } from '../pub-sub/pub_sub.service';
import { ScheduleTask, ScheduleTaskResponse, UpdateScheduleTask, updateKeywordResult } from '../models/scheduleTaskModels';
import { ScrapeResult } from '../models/scraperModels';

@Injectable()
export class SchedulerService {
  topicName: string;
  isRunning = false; // Lock variable to track if a job is running

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly pubsubService: PubSubService
  ) {
    console.log('Scheduler service initialized');
    this.topicName = process.env.GOOGLE_CLOUD_TOPIC;

    // Schedule the cron job to run every minute
    cron.schedule('* * * * *', () => this.checkSchedules());
  }

  

  async checkSchedules() {
    if (this.isRunning) {
      console.log('Job already running, skipping...');
      return; // Prevent new job if one is already running
    }
  
    this.isRunning = true; // Set lock
  
    try {
      console.log('Checking schedules...');
      const dueSchedules = await this.supabaseService.getDueSchedules() as ScheduleTaskResponse[];
      if (!dueSchedules || dueSchedules.length === 0) {
        console.log('No due schedules found');
        return;
      }
      console.log('Number of due schedules:', dueSchedules.length);
  
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
      console.error('Error during job execution:', error);
    } finally {
      this.isRunning = false; // Release lock
    }
  }
  

  // async pollForResults(endpoints: string[], schedule: ScheduleTaskResponse) {
  //   const maxRetries = 20;
  //   const retryDelay = 10000; // 10 seconds
  //   const completedEndpoints: string[] = [];
  
  //   // Helper function to poll a single endpoint
  //   const pollSingleEndpoint = async (endpoint: string) => {
  //     if (completedEndpoints.includes(endpoint)) {
  //       return; // Skip if already completed
  //     }
  //     for (let attempt = 0; attempt < maxRetries; attempt++) {

  //       if (completedEndpoints.includes(endpoint)) {
  //         return; // Skip if already completed
  //       }

  //       try {
  //         console.log(`Polling API endpoint: ${endpoint}, for task: ${schedule.url}, attempt ${attempt + 1}`);
  //         if (!endpoint.includes(encodeURIComponent(schedule.url))) {
  //           attempt--;
  //           return;

  //         }
  //         const response = await axios.get(endpoint);
  
  //         if (response.data && response.data.status === 'completed') {
  //           completedEndpoints.push(endpoint);
  //           console.log('Updating next scrape time for:', schedule.url);
  //           await this.supabaseService.updateNextScrapeTime(schedule);
  //           await this.handleApiResults(response.data.result, schedule);
  //           break;
  //         } else {
  //           await this.delay(retryDelay); // Delay before retrying
  //         }
  //       } catch (error) {
  //         // Log the error and delay before retrying
  //         await this.delay(retryDelay);
  //       }
  //     }
  //   };
  
  //   // Create an array of promises for each endpoint to poll concurrently
  //   const pollingPromises = endpoints.map(endpoint => pollSingleEndpoint(endpoint));
  
  //   // Use Promise.all to wait for all polling to complete
  //   await Promise.all(pollingPromises);
  // }

  async pollForResults(endpoint: string, schedule: ScheduleTaskResponse) {
    const maxRetries = 20;
    const retryDelay = 10000; // 10 seconds
  
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        console.log(`Polling API endpoint: ${endpoint}, for task: ${schedule.url}, attempt ${attempt + 1}`);
        
        // Validate if the endpoint is correct for the schedule's URL
        // if (!endpoint.includes(encodeURIComponent(schedule.url))) {
        //   console.log('Invalid endpoint for schedule, skipping...');
        //   return;
        // }
  
        const response = await axios.get(endpoint);
  
        if (response.data && response.data.status === 'completed') {
          console.log('Updating next scrape time for:', schedule.url);
          await this.supabaseService.updateNextScrapeTime(schedule);
          await this.handleApiResults(response.data.result, schedule);
          break; // Exit the loop on success
        } else {
          console.log(`Attempt ${attempt + 1} failed. Retrying after ${retryDelay / 1000} seconds...`);
          await this.delay(retryDelay); // Delay before retrying
        }
      } catch (error) {
        console.error('Error while polling API:', error);
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
    console.log('Received scrape results for URL:', schedule.url );
    
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

    console.log('Updating scrape results');
    await this.supabaseService.updateSchedule(updateMessage);
  }

  async handleKeywordResults(results: any, schedule: ScheduleTaskResponse) {
    // Process results and update Supabase or take further actions
    console.log('Received keyword results for url and keyword:', results.url, results.keyword);

    const updateKeywordResult = {
      id: schedule.id,
      keyword: results.keyword,
      results: schedule.keyword_results,
      newRank: results.ranking,
      newTopTen: results.topTen,
    } as updateKeywordResult;

    console.log('Updating keyword results');
    await this.supabaseService.updateKeywordResult(updateKeywordResult);
  }
  
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
