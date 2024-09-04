import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { ScheduleTask, UpdateScheduleTask, ScheduleTaskResponse, updateKeywordResult } from '../models/scheduleTaskModels';

@Injectable()
export class SupabaseService {
  supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  serviceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
  private readonly supabaseClient = createClient(this.supabaseURL, this.serviceKey);

  async createSchedule(scheduleData: ScheduleTask) {
    const { user_id, url, frequency, next_scrape } = scheduleData;

    let nextScrape: Date;

    if (next_scrape) {
      nextScrape = new Date(next_scrape); // may have to fix this - time zone issue
    } else {
      nextScrape = new Date();
    }

    const { data, error } = await this.supabaseClient
      .from('scheduled_tasks')
      .insert([
        { 
          user_id, 
          url, 
          frequency, 
          next_scrape: nextScrape.toISOString(),
          result_history: [] 
        },
      ]);

    if (error) {
      throw new Error(`Failed to create schedule: ${error}`);
    }
    return data;
  }

  async updateSchedule(scheduleData: UpdateScheduleTask) {
    const { id, result_history, newResults } = scheduleData;
    
    // get the current date and time
    const now = new Date();
    
    // append the new results to the result history
    result_history.push({ 
      timestamp: now.toISOString(),
      result: newResults 
    });

    const { data, error } = await this.supabaseClient
      .from('scheduled_tasks')
      .update({ result_history, updated_at: now.toISOString() })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to update schedule: ${error.message}`);
    }
    return data;
  }

  async updateKeywordResult(scheduleData: updateKeywordResult) {
    const { id, keyword, timestampArr, newResult, resultArr} = scheduleData;

    // append to necessary fields
    timestampArr.push(new Date().toISOString());
    // append result to resultArr

    const { data, error } = await this.supabaseClient
      .from('scheduled_tasks')
      .update({ 
        keyword_results: { keyword, timestampArr, resultArr } 
      })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to update keyword result: ${error.message}`);
    }
    return data;
  }


  async getDueSchedules() {
    console.log('Getting due schedules...');

    // get the current date and time
    const now = new Date();

    const { data, error } = await this.supabaseClient
      .from('scheduled_tasks')
      .select('*')
      .lte('next_scrape', now.toISOString());

    if (error) {
      throw new Error(`Failed to fetch due schedules: ${error.message}`);
    }
    return data as ScheduleTaskResponse[];
  }

  async updateNextScrapeTime(schedule: ScheduleTaskResponse) {
      // Destructure the schedule object
      const { id, frequency } = schedule;
    
      // Determine the next scrape time based on the frequency
      let nextScrape: string;
      try {
        nextScrape = this.calculateNextScrapeTime(frequency);
      } catch (error) {
        throw new Error(`Failed to calculate next scrape time: ${error.message}`);
      }

      // Update the next scrape time in the database
      const { data, error } = await this.supabaseClient
        .from('scheduled_tasks')
        .update({ next_scrape: nextScrape })
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to update next scrape time: ${error.message}`);
      }
    
  }

  calculateNextScrapeTime(frequency: string): string {
    // Get the current date and time
    const now = new Date();
    
    // Create a new Date object to avoid mutating the original now object
    const nextScrape: Date = new Date(now.getTime());
    
    // Calculate the next scrape time based on the frequency
    switch (frequency) {
      case 'daily':
        nextScrape.setDate(nextScrape.getDate() + 1);
        break;
      case 'weekly':
        nextScrape.setDate(nextScrape.getDate() + 7);
        break;
      case 'bi-weekly':
        nextScrape.setDate(nextScrape.getDate() + 14);
        break;
      case 'monthly':
        nextScrape.setMonth(nextScrape.getMonth() + 1);
        break;
      default:
        throw new Error('Invalid frequency');
    }
  
    // Return the next scrape time in ISO format
    return nextScrape.toISOString();
  }
  
  // async getScheduleById(id: string) {
  //   const { data, error } = await this.supabaseClient
  //     .from('scheduled_tasks')
  //     .select('*')
  //     .eq('id', id);

  //   if (error) {
  //     throw new Error(`Failed to get schedule: ${error.message}`);
  //   }
  //   return data;
  // }

}


