import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { ScheduleTask, UpdateScheduleTask } from '../models/scheduleTaskModels';

@Injectable()
export class SupabaseService {
  supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  serviceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
  private readonly supabaseClient = createClient(this.supabaseURL, this.serviceKey);

  async createSchedule(scheduleData: ScheduleTask) {
    const { user_id, url, frequency, next_scrape } = scheduleData;
    const { data, error } = await this.supabaseClient
      .from('scraping_schedules')
      .insert([
        { user_id, url, frequency, next_scrape },
      ]);

    if (error) {
      throw new Error(`Failed to create schedule: ${error.message}`);
    }
    return data;
  }

  async updateSchedule(scheduleData: UpdateScheduleTask) {
    const { id, next_scrape, updated_at, result_history } = scheduleData;
    const { data, error } = await this.supabaseClient
      .from('scraping_schedules')
      .update({ next_scrape, result_history, updated_at })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to update schedule: ${error.message}`);
    }
    return data;
  }
}
