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
}
