export interface ScraperResult {
  url: string;
  domainStatus: string;
  robots: RobotsResponse | ErrorResponse;
  metadata: Metadata | ErrorResponse;
  industryClassification: IndustryClassification;
  logo: string;
  images: string[];
  slogan: string;
  contactInfo: ContactInfo;
  time:number;
  addresses: string[];
  screenshot: string;
  seoAnalysis: SeoAnalysis;
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

export interface ContactInfo {
  emails: string[],
  phones: string[],
  socialLinks: string[]
}

export interface SeoAnalysis {
  XMLSitemapAnalysis: XMLSitemapAnalysis | SEOError; // tech
  canonicalTagAnalysis: CanonicalTagAnalysis | SEOError; // tech
  headingAnalysis: HeadingAnalysis | SEOError; // on page
  imageAnalysis: ImageAnalysis | SEOError; // on page
  indexabilityAnalysis: IndexabilityAnalysis | SEOError; // tech
  internalLinksAnalysis: InternalLinksAnalysis | SEOError; // on page
  metaDescriptionAnalysis: MetaDescriptionAnalysis | SEOError; // on page
  mobileFriendlinessAnalysis: MobileFriendlinessAnalysis | SEOError; // tech
  structuredDataAnalysis: StructuredDataAnalysis | SEOError; // tech
  titleTagsAnalysis: TitleTagsAnalysis | SEOError; // on page
  uniqueContentAnalysis: UniqueContentAnalysis | SEOError; // on page
}

export interface XMLSitemapAnalysis {
  isSitemapValid: boolean;
  recommendations: string;
}

export interface CanonicalTagAnalysis {
  canonicalTag: string;
  isCanonicalTagPresent: boolean;
  recommendations: string;
}

export interface HeadingAnalysis {
  count: number;
  headings: string[];
  recommendations: string;
}

export interface ImageAnalysis {
  errorUrls: string[];
  missingAltTextCount: number;
  nonOptimizedCount: number;
  reasonsMap: ReasonsMap;
  recommendations: string;
  totalImages: number;
}

export interface ReasonsMap {
  format: string[];
  other: string[];
  size: string[];
}

export interface IndexabilityAnalysis {
  isIndexable: boolean;
  recommendations: string;
}

export interface InternalLinksAnalysis {
  recommendations: string;
  totalLinks: number;
  uniqueLinks: number;
}

export interface MetaDescriptionAnalysis {
  length: number;
  recommendations: string;
  titleTag: string;
}

export interface MobileFriendlinessAnalysis {
  isResponsive: boolean;
  recommendations: string;
}

export interface StructuredDataAnalysis {
  count: number;
  recommendations: string;
}

export interface TitleTagsAnalysis {
  length: number;
  metaDescription: string;
  recommendations: string;
}

export interface UniqueContentAnalysis {
  recommendations: string;
  textLength: number;
  uniqueWordsPercentage: number;
  repeatedWords: RepeatedWords[]
}

export interface RepeatedWords {
  word: string;
  count: number;
}

export interface SEOError {
  error: string;
}

export interface Summary {
  domainStatus: number[];
  domainErrorStatus: number;
  industryClassification: {
    unclassifiedUrls: string[];
    industryPercentages: {
      industries: string[];
      percentages: number[];
    };
    weakClassification: {
      url: string;
      metadataClass: string;
      score: number;
    }[];
  },
  domainMatch: {
    percentageMatch: number;
    mismatchedUrls: {
      url: string;
      metadataClass: string;
      domainClass: string;
    }[];
  }
  totalUrls: number;
  parkedUrls: string[];
  scrapableUrls: number;
  avgTime:number;
}