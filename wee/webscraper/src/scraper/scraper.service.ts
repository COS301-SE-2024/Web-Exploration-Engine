import { Injectable } from '@nestjs/common';

// Services
import { RobotsService } from './robots/robots.service';
import { ScrapeMetadataService } from './scrape-metadata/scrape-metadata.service';
import { ScrapeStatusService } from './scrape-status/scrape-status.service';
import { IndustryClassificationService } from './industry-classification/industry-classification.service';
// Models
import { ErrorResponse, RobotsResponse, Metadata } from './models/ServiceModels';

@Injectable()
export class ScraperService {
  constructor(
    private readonly robotsService: RobotsService,
    private readonly metadataService: ScrapeMetadataService,
    private readonly scrapeStatusService: ScrapeStatusService,
    private readonly industryClassificationService: IndustryClassificationService
  ) {}

  async scrape(url: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = {
      url: '',
      domainStatus: '' ,
      robots: {} as RobotsResponse | ErrorResponse,
      robotsError: {} as ErrorResponse,
      metadata: {} as Metadata | ErrorResponse,
      metadataError: {} as ErrorResponse,
      industryClassification: {} as any,
    };

    // validate url

    data.url = url;

    // scrape robots.txt file & url validation
    // scrape web status - live, parked, under construction
    const robotsPromise = this.robotsService.readRobotsFile(data.url);
    const statusPromise = this.scrapeStatusService.scrapeStatus(data.url);

    const [robotsResponse, status] = await Promise.all([robotsPromise, statusPromise]);
    data.domainStatus = status;

    // blocking - check for error response
    // some kind of retry mechanism here?
    if ("errorStatus" in robotsResponse) {
      data.robotsError = robotsResponse as ErrorResponse;
      return data;
    }

    data.robots = robotsResponse as RobotsResponse;

    // scrape metadata & html - can we do this in parallel?
    const metadataResponse = await this.metadataService.scrapeMetadata(data.url, data.robots);
    if ("errorStatus" in metadataResponse) {
      data.metadata = {
        title: null,
        description: null,
        keywords: null,
        ogTitle: null,
        ogDescription: null,
        ogImage: null,
      } as Metadata;
    } else {
      data.metadata = metadataResponse as Metadata;
    }

    // classify industry based on metadata
    const industryClassification = await this.industryClassificationService.classifyIndustry(data.url, data.metadata);
    data.industryClassification = industryClassification;


    // classify industry based on domain name - for domain match

    // scrape logo

    // scrape slogan

    // scrape images

    // do we want to perform analysis in the scraper service? - probably not

    return data;
  }

  scrapeUrls(urls: string[]) { 
    // scrape multiple urls in parallel
    // return data
  };


  async readRobotsFile(url: string) {
    return this.robotsService.readRobotsFile(url);
  }

  async scrapeMetadata(url: string) {
    const robotsResponse = await this.robotsService.readRobotsFile(url);
    if ("errorStatus" in robotsResponse) {
      return robotsResponse;
    }

    return this.metadataService.scrapeMetadata(url, robotsResponse as RobotsResponse);
  }

  async scrapeStatus(url: string) {
    return this.scrapeStatusService.scrapeStatus(url);
  }

  async classifyIndustry(url: string) {
    const metadataResponse = await this.scrapeMetadata(url);
    if ("errorStatus" in metadataResponse) {
      return metadataResponse;
    }
    return this.industryClassificationService.classifyIndustry(url, metadataResponse);
  }
}
