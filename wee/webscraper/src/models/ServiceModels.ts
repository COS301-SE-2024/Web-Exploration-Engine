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
  metadataClass: {
    label: string;
    score: number;
  };
  domainClass: {
    label: string;
    score: number;
  };
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
  time: number;
  reviews:string[];
}
