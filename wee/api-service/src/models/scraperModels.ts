/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ErrorResponse {
  errorStatus: number;
  errorCode: string;
  errorMessage: string;
  details?: {
    timestamp: string;
    path: string;
  }
}

export interface RobotsResponse {
  baseUrl: string;
  allowedPaths: string[];
  disallowedPaths: string[];
  isUrlScrapable: boolean; // for scraping metadata, images, logos
  isBaseUrlAllowed: boolean; // for scraping metadata
}

export interface Metadata {
  title: string | null;
  description: string | null;
  keywords: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
}

export interface IndustryClassification {
  zeroShotMetaDataClassify: {
    label: string;
    score: number;
  }[];
  zeroShotDomainClassify: {
    label: string;
    score: number;
  }[];
}

export interface SentimentClassification {
  sentimentAnalysis: {
    positive: number;
    negative: number;
    neutral: number;
  };
  positiveWords: string[];
  negativeWords: string[];
  emotions: { [emotion: string]: number };
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


export interface ScrapeResult {
  url: string;
  domainStatus: string;
  robots: RobotsResponse | ErrorResponse;
  metadata?: Metadata | ErrorResponse;
  industryClassification?: IndustryClassification | ErrorResponse;
  logo?: string | ErrorResponse;
  images?: string[] | ErrorResponse;
  slogan?: string | ErrorResponse;
  contactInfo?: { emails: string[], phones: string[], socialLinks: string[] } ;
  addresses?: string[] | ErrorResponse;
  screenshot?: string | ErrorResponse;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  seoAnalysis?: any;
  sentiment?: SentimentClassification | ErrorResponse;
  scrapeNews: NewsItem[] | ErrorResponse;
  shareCountdata?:any
  time: number;
}


{
  "status": "completed",
  "result": [
    "Rating: 2.19",
    "Number of reviews: 843",
    "Trustindex rating: 2.7",
    "NPS: -42 NPS",
    "Recommendation status: Unlikely",
    "Review breakdown: 213 Reviews; 28 Reviews; 12 Reviews; 47 Reviews; 543 Reviews"
  ]
}