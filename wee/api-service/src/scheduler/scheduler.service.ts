import { Injectable } from '@nestjs/common';
import * as cron from 'node-cron';
import axios from 'axios';
import { SupabaseService } from '../supabase/supabase.service';
import { PubSubService } from '../pub-sub/pub_sub.service';
import { ScheduleTask, ScheduleTaskResponse, UpdateScheduleTask, updateKeywordResult } from '../models/scheduleTaskModels';
import { timestamp } from 'rxjs';


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

  async createSchedule(schedule: ScheduleTask) {
    // Create a new schedule in Supabase
    await this.supabaseService.createSchedule(schedule);
  }

  // async getSchedule(id: string) {
  //   // Get a schedule by ID from Supabase
  //   return await this.supabaseService.getScheduleById(id);
  // }


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

      const pollEndpoints: string[] = [];
      const apiUrl = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:3002/api';
      const pollScrapeEndpoint = `${apiUrl}/scraper/status?type=scrape`;
      const pollKeywordEndpoint = `${apiUrl}/scraper/keyword-status?`;

      for (const schedule of dueSchedules) {
        const message = {
          type: 'scrape',
          data: { url: schedule.url }
        };

        await this.pubsubService.publishMessage(this.topicName, message);
        pollEndpoints.push(`${pollScrapeEndpoint}&url=${encodeURIComponent(schedule.url)}`);



        // publish keyword tasks
        const keywords = schedule.keywords;
        for (const keyword of keywords) {
          const keywordMessage = {
            type: 'keyword-analysis',
            data: { url: schedule.url, keyword }
          };
          await this.pubsubService.publishMessage(this.topicName, keywordMessage);
          pollEndpoints.push(`${pollKeywordEndpoint}url=${encodeURIComponent(schedule.url)}&keyword=${encodeURIComponent(keyword)}`);
        }


        console.log('Updating next scrape time for:', schedule.url);
        await this.supabaseService.updateNextScrapeTime(schedule);

        // poll the API endpoint for the results
        console.log('Polling for results:', schedule.url);
        await this.pollForResults(pollEndpoints, schedule);

      }
    } catch (error) {
      console.error('Error during job execution:', error);
    } finally {
      this.isRunning = false; // Release lock
    }
  }

  // async pollApiEndpoint(url: string, schedule: ScheduleTaskResponse) {
  //   const maxRetries = 20;
  //   const retryDelay = 10000; // 10 seconds
  //   const apiUrl = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:3002/api';

  //   for (let attempt = 0; attempt < maxRetries; attempt++) {
  //     try {
  //       // this.logger.log(`Polling ${url}, attempt ${attempt + 1}`);

  //       // Make HTTP request to the API endpoint
  //       console.log('Polling API endpoint:', `${apiUrl}/scraper/status?type=scrape&url=${encodeURIComponent(url)}`);
  //       const response = await axios.get(`${apiUrl}/scraper/status?type=scrape&url=${encodeURIComponent(url)}`);


  //       if(response.data && response.data.status === 'completed') {
  //         this.handleApiResults(response.data.result, schedule);
  //         break;
  //       } else {
  //         // this.logger.warn('No results yet, retrying...');
  //         await this.delay(retryDelay);
  //       }
        
        
  //     } catch (error) {
  //       // this.logger.error('Error polling API', error);
  //       await this.delay(retryDelay);
  //     }
  //   }
  // }

  // async pollForResults(url: string, schedule: ScheduleTaskResponse, keywords: string[]) {
  //   const maxRetries = 20;
  //   const retryDelay = 10000; // 10 seconds
  //   const apiUrl = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:3002/api';

  //   for (let attempt = 0; attempt < maxRetries; attempt++) {
  //     try {
  //       // this.logger.log(`Polling ${url}, attempt ${attempt + 1}`);

  //       // Make HTTP request to the API endpoint
  //       console.log('Polling API endpoint:', `${apiUrl}/scraper/status?type=scrape&url=${encodeURIComponent(url)}`);
  //       const response = await axios.get(`${apiUrl}/scraper/status?type=scrape&url=${encodeURIComponent(url)}`);


  //       if(response.data && response.data.status === 'completed') {
  //         this.handleApiResults(response.data.result, schedule);
  //         break;
  //       } else {
  //         // this.logger.warn('No results yet, retrying...');
  //         await this.delay(retryDelay);
  //       }
        
        
  //     } catch (error) {
  //       // this.logger.error('Error polling API', error);
  //       await this.delay(retryDelay);
  //     }
  //   }
  // }

  // async pollKeywordEndpoint(url: string, schedule: ScheduleTaskResponse, keyword: string) {
  //   const maxRetries = 20;
  //   const retryDelay = 10000; // 10 seconds
  //   const apiUrl = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:3002/api';

  //   for (let attempt = 0; attempt < maxRetries; attempt++) {
  //     try {
  //       // this.logger.log(`Polling ${url}, attempt ${attempt + 1}`);

  //       // Make HTTP request to the API endpoint
  //       const pollApiEndpoint = `${apiUrl}/scraper/keyword-status?url=${encodeURIComponent(url)}&keyword=${encodeURIComponent(keyword)}`;
  //       console.log('Polling API endpoint: ', pollApiEndpoint);
  //       const response = await axios.get(pollApiEndpoint);


  //       if(response.data && response.data.status === 'completed') {
  //         this.handleKeywordResults(response.data.result, schedule);
  //         break;
  //       } else {
  //         // this.logger.warn('No results yet, retrying...');
  //         await this.delay(retryDelay);
  //       }
        
        
  //     } catch (error) {
  //       // this.logger.error('Error polling API', error);
  //       await this.delay(retryDelay);
  //     }
  //   }
  // }

  // async handleApiResults(results: any, schedule: ScheduleTaskResponse) {
  //   // Process results and update Supabase or take further actions
  //   // this.logger.log('Received results:', results);

  //   // calculate next scrape time based on frequency

  //   // append results to result_history
  //   schedule.result_history.push({ 
  //     timestamp: new Date().toISOString(),
  //     result: results 
  //   });

  //   // Example of updating Supabase with the results
  //   const updateMessage = {
  //     id: schedule.id,
  //     result_history: schedule.result_history,
  //     newResults: results,
  //   } as UpdateScheduleTask;

  //   console.log('Updating results');
  //   await this.supabaseService.updateSchedule(updateMessage);

  // }

  async pollForResults(endpoints: string[], schedule: ScheduleTaskResponse) {
    const maxRetries = 20;
    const retryDelay = 10000; // 10 seconds
  
    // Helper function to poll a single endpoint
    const pollSingleEndpoint = async (endpoint: string) => {
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          console.log(`Polling API endpoint: ${endpoint}, attempt ${attempt + 1}`);
          const response = await axios.get(endpoint);
  
          if (response.data && response.data.status === 'completed') {
            this.handleApiResults(response.data.result, schedule);
            break;
          } else {
            await this.delay(retryDelay); // Delay before retrying
          }
        } catch (error) {
          // Log the error and delay before retrying
          await this.delay(retryDelay);
        }
      }
    };
  
    // Create an array of promises for each endpoint to poll concurrently
    const pollingPromises = endpoints.map(endpoint => pollSingleEndpoint(endpoint));
  
    // Use Promise.all to wait for all polling to complete
    await Promise.all(pollingPromises);
  }

  async handleApiResults(results: any, schedule: ScheduleTaskResponse) {
    // Check if its scrape or keyword analysis
    if (results.url) {
      await this.handleScrapeResults(results, schedule);
    } else {
      await this.handleKeywordResults(results, schedule);
    }
  }

  async handleScrapeResults(results: any, schedule: ScheduleTaskResponse) {
    // Process results and update Supabase or take further actions
    console.log('Received scrape results:', results);

    // Example of updating Supabase with the results
    const updateMessage = {
      id: schedule.id,
      result_history: schedule.result_history,
      newResults: results,
    } as UpdateScheduleTask;

    console.log('Updating scrape results');
    await this.supabaseService.updateSchedule(updateMessage);
  }

  async handleKeywordResults(results: any, schedule: ScheduleTaskResponse) {
    // Process results and update Supabase or take further actions
    console.log('Received keyword results:', results);

    const updateKeywordResult = {
      id: schedule.id,
      keyword: results.keyword,
      timestampArr: schedule.keyword_results.find(kw => kw.keyword === results.keyword)?.timestampArr || [],
      resultArr: schedule.keyword_results.find(kw => kw.keyword === results.keyword)?.resultArr || [],
      newResult: results
    } as updateKeywordResult;

    console.log('Updating keyword results');
    await this.supabaseService.updateKeywordResult(updateKeywordResult);
  }


  
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
