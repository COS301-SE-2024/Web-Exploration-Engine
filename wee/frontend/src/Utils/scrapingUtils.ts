import { ErrorResponse, ScraperResult, UndefinedResponse } from "../app/models/ScraperModels";

export function isScrapedResult(data: ScraperResult | ErrorResponse | UndefinedResponse): data is ScraperResult {
    return (
      'url' in data &&
      'domainStatus' in data &&
      'robots' in data &&
      'metadata' in data &&
      'industryClassification' in data &&
      'logo' in data &&
      'images' in data &&
      'slogan' in data &&
      'contactInfo' in data &&
      'addresses' in data &&
      'screenshot' in data &&
      'seoAnalysis' in data &&
      'sentiment' in data &&
      'scrapeNews' in data &&
      'reviews' in data &&
      'shareCountdata' in data &&
      'time' in data
    );
  }