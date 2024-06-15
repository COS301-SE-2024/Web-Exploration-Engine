export interface ScraperResult {
  url: string;
  domainStatus: string;
  robots: RobotsResponse | ErrorResponse;
  metadata: Metadata | ErrorResponse;
  industryClassification: IndustryClassification;
  logo: string;
  images: string[];
  slogan: string;
}

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
  },
  domainClass: {
    label: string;
    score: number;
  }
}

export interface Summary {
  domainStatus: {
    parked: number;
    live: number;
    error: number;
  },
  industryClassification: {
    unclassifiedUrls: string[];
    industryPercentages: {
      industry: string;
      percentage: string;
    }[];
    weakClassification: {
      url: string;
      metadataClass: string;
      score: number;
    }[];
  },
  domainMatch: {
    percentageMatch: string;
    mismatchedUrls: {
      url: string;
      metadataClass: string;
      domainClass: string;
    }[];
  }

}