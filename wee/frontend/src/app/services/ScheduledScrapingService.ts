'use server'
import { ScheduleTask, GetSchedulesResponse, ScheduleTaskResponse } from '../models/ScheduleModels'
import { createClient } from '../utils/supabase/server';

const supabaseClient = createClient();

export async function createScheduleTask(scheduleData: ScheduleTask) {
  const { user_id, url, frequency, next_scrape, keywords} = scheduleData;

  // convert frequency to correct format
  const formattedFrequency = frequency.toLowerCase();

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
    .eq('user_id', user_id)
    .order('id', { ascending: true });


  if (error) {
    throw new Error(`Failed to get schedules: ${error.message}`);
  }

  // return url and next_scrape for each schedule task
  return data.map((task: ScheduleTaskResponse) => {
    return {
      id: task.id,
      url: task.url,
      next_scrape: task.next_scrape,
      keywords: task.keywords,
    } as GetSchedulesResponse;
  }) as GetSchedulesResponse[]; 
}

// update keyword list for a schedule
export async function updateKeywords(id: string, keywords: string[]) {
  // check what keywords were added or removed
  console.log('Updating keywords for schedule:', id);
  console.log('New keywords:', keywords);
  // get the current keywords for the schedule
  const { data, error } = await supabaseClient
    .from('scheduled_tasks')
    .select('keywords, keyword_results')
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to update keywords: ${error.message}`);
  }

  let updatedKeywordResults: string[] = [];

  if (data) {
    const currentKeywords = data[0].keywords as string[];
    const keywordResults = data[0].keyword_results as any[];

    // check for removed keywords
    const removedKeywords = currentKeywords.filter(keyword => !keywords.includes(keyword));

    // remove the removed keywords from the keyword_results
    updatedKeywordResults = keywordResults.filter((result: any) => {
      return !removedKeywords.includes(result.keyword);
    });
  }

  // update the keywords
  const { data: updateData, error: updateError } = await supabaseClient
    .from('scheduled_tasks')
    .update({ keywords, keyword_results: updatedKeywordResults })
    .eq('id', id);

  if (updateError) {
    throw new Error(`Failed to update keywords: ${updateError.message}`);
  }
}

export async function deleteSchedule(id: string) {
  const { data, error } = await supabaseClient
    .from('scheduled_tasks')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete schedule: ${error.message}`);
  }
  return data;
}



