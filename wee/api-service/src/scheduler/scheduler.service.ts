import { Injectable } from '@nestjs/common';
import * as cron from 'node-cron';
import axios from 'axios';
import { SupabaseService } from '../supabase/supabase.service';
import { PubSubService } from '../pub-sub/pub_sub.service';
import { ScheduleTask, ScheduleTaskResponse } from '../models/scheduleTaskModels';


@Injectable()
export class SchedulerService {
  topicName: string;

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly pubsubService: PubSubService
  ) {
    this.topicName = process.env.GOOGLE_CLOUD_TOPIC;

    // Schedule the cron job to run every minute
    cron.schedule('* * * * *', () => this.checkSchedules());
  }

  async createSchedule(schedule: ScheduleTask) {
    // Create a new schedule in Supabase
    await this.supabaseService.createSchedule(schedule);
  }

  async checkSchedules() {
    // Fetch all schedules that are due for scraping
    const dueSchedules = await this.supabaseService.getDueSchedules() as ScheduleTaskResponse[];

    for (const schedule of dueSchedules) {
      const message = {
        type: 'scrape',
        data: { url: schedule.url }
      };

      // Publish scraping tasks to Pub/Sub
      this.pubsubService.publishMessage(this.topicName, message);

      // Poll the API endpoint until results are available
      this.pollApiEndpoint(schedule.url, schedule);
      
      // Update next scrape time after publishing
      // await this.supabaseService.updateNextScrapeTime(schedule);
    }
  }

  async pollApiEndpoint(url: string, schedule: ScheduleTaskResponse) {
    const maxRetries = 10;
    const retryDelay = 5000; // 5 seconds
    const apiUrl = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:3002/api';

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // this.logger.log(`Polling ${url}, attempt ${attempt + 1}`);

        // Make HTTP request to the API endpoint
        const response = await axios.get(`${apiUrl}/scraper/status?type=scrape&url=${encodeURIComponent(url)}`);
        console.log('Response:', response);
        
        if (response.data && response.data.results) {
          // Handle successful response
          
          this.handleApiResults(response.data.results, schedule);
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
    schedule.result_history.push({ result: results });

    // Example of updating Supabase with the results
    const updateMessage = {
      id: schedule.id,
      user_id: schedule.user_id,
      url: schedule.url,
      frequency: schedule.frequency,
      next_scrape: schedule.next_scrape,
      updated_at: new Date().toISOString(),
      result_history: schedule.result_history
    };
    await this.supabaseService.updateSchedule(results);
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
