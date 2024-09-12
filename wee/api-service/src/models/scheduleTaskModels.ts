export interface ScheduleTask {
  // id is auto-generated by Supabase
  user_id: string;
  url: string;
  frequency: string;
  next_scrape?: string; // timestamp
  // created_at is auto-generated by Supabase
  // updated_at is auto-generated by Supabase
  // result_history will initially be empty
}

export interface ScheduleResult {
  timestampArr: string[];
  commentCount: number[];
  shareCount: number[];
  reactionCount: number[];
  totalEngagement: number[]; // sum of comment, share, reaction - can show sum of increase/decrease
  pinCount: number[]; // Pinterest share count
  newsSentiment: newsSentiment;
  rating: number[]; // average of reviews
  numReviews: number[]; // number of reviews
  trustIndex: number[]; // trust index
  NPS: number[]; // Net Promoter Score
  recommendationStatus: string[]; // recommendation status
  starRatings: starRatings[][];
  siteSpeed: number[]; // site speed
  performanceScore: number[]; // performance score
  accessibilityScore: number[]; // accessibility score
  bestPracticesScore: number[]; // best practices score
}

export interface NewsItem {
  title: string;
  link: string;
  source: string;
  pubDate: string;
  sentimentScores?: {
    positive: number;
    negative: number;
    neutral: number;
  };
}


export interface UpdateScheduleTask {
  id: string,
  result_history: ScheduleResult;
  newCommentCount: number;
  newShareCount: number;
  newReactionCount: number;
  newTotalEngagement: number;
  newPinCount: number;
  newNewsSentiment: NewsItem[];
  newRating: number;
  newNumReviews: number;
  newTrustIndex: number;
  newNPS: number;
  newRecommendationStatus: string;
  newStarRatings: starRatings[]; // array of starRatings
  newSiteSpeed: number;
  newPerformanceScore: number;
  newAccessibilityScore: number;
  newBestPracticesScore: number;
}

export interface ScheduleTaskResponse {
  id: string
  user_id: string;
  url: string;
  frequency: string;
  next_scrape: string; // timestamp
  updated_at: string; // timestamp
  created_at: string; // timestamp
  result_history: ScheduleResult;
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

export interface newsSentiment {
  positiveAvg: number[];
  negativeAvg: number[];
  neutralAvg: number[];
}

export interface starRatings {
  stars: number;
  numReviews: number;
}





