'use server'
import { ScheduleTask, GetSchedulesResponse } from '../models/ScheduleModels'
import { createClient } from '../utils/supabase/server';

const supabaseClient = createClient();

export async function createScheduleTask(scheduleData: ScheduleTask) {
  const { user_id, url, frequency, next_scrape, keywords} = scheduleData;

  // convert frequency to correct format
  const formattedFrequency = frequency.toLowerCase();
  console.log(formattedFrequency);

  const createRequest = {
    user_id,
    url,
    frequency: formattedFrequency,
    next_scrape,
    result_history: [],
    keywords,
    keyword_results: [],
  } as ScheduleTask;

  const { data, error } = await supabaseClient
    .from('scheduled_tasks')
    .insert([
      createRequest,
    ]);

  if (error) {
    console.log(error.message);
    throw new Error(`Failed to create schedule: ${error.message}`);
  }
  return data;
}

// get all schedules for a user
export async function getSchedules(user_id: string) {
  const { data, error } = await supabaseClient
    .from('scheduled_tasks')
    .select('*')
    .eq('user_id', user_id);

  console.log(data);

  if (error) {
    throw new Error(`Failed to get schedules: ${error.message}`);
  }

  // return url and next_scrape for each schedule task
  return data.map((task: ScheduleTask) => {
    return {
      url: task.url,
      next_scrape: task.next_scrape,
    } as GetSchedulesResponse;
  }) as GetSchedulesResponse[]; 
}
