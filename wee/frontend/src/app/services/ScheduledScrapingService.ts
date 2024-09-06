'use server'
import { ScheduleTask } from '../models/ScheduleModels'
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
