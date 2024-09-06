export interface ScheduleTask {
  user_id: string;
  url: string;
  frequency: string;
  next_scrape: string; // timestamp
  keywords: string[];
}

export interface SavedResult {
  // how to store the result of a scrape?
  // this is just a placeholder
  timestamp: string; // timestamp
  result: string;
}

export interface UpdateScheduleTask {
  id: string,
  result_history: SavedResult[];
  newResults: any;
}

export interface ScheduleTaskResponse {
  id: string
  user_id: string;
  url: string;
  frequency: string;
  next_scrape: string; // timestamp
  updated_at: string; // timestamp
  created_at: string; // timestamp
  result_history: SavedResult[];
  keywords: string[];
  keyword_results: KeywordResult[];
}

export interface KeywordResult {
  keyword: string;
  timestampArr: string[];
  rankArr: string[];
  topTenArr: string[][];
}

export interface updateKeywordResult {
  id: string;
  keyword: string;
  results: KeywordResult[];
  newRank: string;
  newTopTen: string[];
}

export interface GetSchedulesResponse {
  url: string;
  next_scrape: string;
}




