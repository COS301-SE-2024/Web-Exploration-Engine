import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { ScheduleTask, UpdateScheduleTask, ScheduleTaskResponse } from '../models/scheduleTaskModels';
import { DateTime } from 'luxon'; // for date manipulation and timezones

@Injectable()
export class SupabaseService {
  supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  serviceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
  private readonly supabaseClient = createClient(this.supabaseURL, this.serviceKey);

  async createSchedule(scheduleData: ScheduleTask) {
    const { user_id, url, frequency, next_scrape } = scheduleData;

    // Set the time zone to South Africa
    const timeZone = 'Africa/Johannesburg';
    
    // Get the current date in the desired time zone
    const now = DateTime.now().setZone(timeZone);
    const formattedDate = now.toUTC().toFormat("yyyy-MM-dd HH:mm:ss.SSSSSSZZ");

    const { data, error } = await this.supabaseClient
      .from('scheduled_tasks')
      .insert([
        { 
          user_id, 
          url, 
          frequency, 
          next_scrape: next_scrape || formattedDate, 
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
    

    // Set the time zone to South Africa
    const timeZone = 'Africa/Johannesburg';
    
    // Get the current date in the desired time zone
    const now = DateTime.now().setZone(timeZone);
    const formattedDate = now.toUTC().toFormat("yyyy-MM-dd HH:mm:ss.SSSSSSZZ");

    // append the new results to the result history
    result_history.push({ 
      timestamp: formattedDate,
      result: newResults 
    });

    const { data, error } = await this.supabaseClient
      .from('scheduled_tasks')
      .update({ result_history, updated_at: now.toISO() })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to update schedule: ${error.message}`);
    }
    return data;
  }

  async getDueSchedules() {
    console.log('Getting due schedules...');

    // Set the time zone to South Africa
    const timeZone = 'Africa/Johannesburg';
    
    // Get the current date in the desired time zone
    const now = DateTime.now().setZone(timeZone);

    const formattedDate = now.toUTC().toFormat("yyyy-MM-dd HH:mm:ss.SSSSSSZZ");



    const { data, error } = await this.supabaseClient
      .from('scheduled_tasks')
      .select('*')
      .lte('next_scrape', formattedDate);

    if (error) {
      throw new Error(`Failed to get due schedules: ${error.message}`);
    }
    return data as ScheduleTaskResponse[];
  }

  async updateNextScrapeTime(schedule: ScheduleTaskResponse) {
      // Destructure the schedule object
      const { id, frequency } = schedule;
    
      // Set the time zone to South Africa
      const timeZone = 'Africa/Johannesburg';
    
      // Get the current date in the desired time zone
      const now = DateTime.now().setZone(timeZone);
    
      // Determine the next scrape time based on the frequency
      let nextScrape: DateTime;
    
      switch (frequency) {
        case 'daily':
          nextScrape = now.plus({ days: 1 });
          break;
        case 'weekly':
          nextScrape = now.plus({ weeks: 1 });
          break;
        case 'bi-weekly':
          nextScrape = now.plus({ weeks: 2 });
          break;
        case 'monthly':
          nextScrape = now.plus({ months: 1 });
          break;
        default:
          throw new Error(`Invalid frequency: ${frequency}`);
      }
    
      // Convert to UTC before using or storing
      const formattedDate = nextScrape.toUTC().toFormat("yyyy-MM-dd HH:mm:ss.SSSSSSZZ");

      // Update the next scrape time in the database
      const { data, error } = await this.supabaseClient
        .from('scheduled_tasks')
        .update({ next_scrape: formattedDate })
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to update next scrape time: ${error.message}`);
      }
    
    }


  async getScheduleById(id: string) {
    const { data, error } = await this.supabaseClient
      .from('scheduled_tasks')
      .select('*')
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to get schedule: ${error.message}`);
    }
    return data;
  }

}


