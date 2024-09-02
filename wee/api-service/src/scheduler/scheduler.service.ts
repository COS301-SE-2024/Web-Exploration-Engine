import { Injectable } from '@nestjs/common';
import * as cron from 'node-cron';
import axios from 'axios';
import { SupabaseService } from '../supabase/supabase.service';
import { PubSubService } from '../pub-sub/pub_sub.service';
import { ScheduleTask, ScheduleTaskResponse, UpdateScheduleTask } from '../models/scheduleTaskModels';


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
      console.log('Number of due schedules:', dueSchedules.length);

      for (const schedule of dueSchedules) {
        const message = {
          type: 'scrape',
          data: { url: schedule.url }
        };

        await this.pubsubService.publishMessage(this.topicName, message);
        console.log('Updating next scrape time for:', schedule.url);
        await this.supabaseService.updateNextScrapeTime(schedule);

        await this.pollApiEndpoint(schedule.url, schedule); // Poll the API
      }
    } catch (error) {
      console.error('Error during job execution:', error);
    } finally {
      this.isRunning = false; // Release lock
    }
  }

  async pollApiEndpoint(url: string, schedule: ScheduleTaskResponse) {
    const maxRetries = 20;
    const retryDelay = 10000; // 10 seconds
    const apiUrl = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:3002/api';

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // this.logger.log(`Polling ${url}, attempt ${attempt + 1}`);

        // Make HTTP request to the API endpoint
        console.log('Polling API endpoint:', `${apiUrl}/scraper/status?type=scrape&url=${encodeURIComponent(url)}`);
        const response = await axios.get(`${apiUrl}/scraper/status?type=scrape&url=${encodeURIComponent(url)}`);


        if(response.data && response.data.status === 'completed') {
          this.handleApiResults(response.data.result, schedule);
          break;
        } else {
          // this.logger.warn('No results yet, retrying...');
          await this.delay(retryDelay);
        }
        
        
      } catch (error) {
        // this.logger.error('Error polling API', error);
        await this.delay(retryDelay);
      }
    }
  }

  async handleApiResults(results: any, schedule: ScheduleTaskResponse) {
    // Process results and update Supabase or take further actions
    // this.logger.log('Received results:', results);

    // calculate next scrape time based on frequency

    // append results to result_history
    schedule.result_history.push({ 
      timestamp: new Date().toISOString(),
      result: results 
    });

    // Example of updating Supabase with the results
    const updateMessage = {
      id: schedule.id,
      result_history: schedule.result_history,
      newResults: results,
    } as UpdateScheduleTask;

    console.log('Updating results');
    await this.supabaseService.updateSchedule(updateMessage);

  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
