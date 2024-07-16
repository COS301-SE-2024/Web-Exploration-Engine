import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

// Services
import { RobotsService } from './robots/robots.service';
import { ScrapeMetadataService } from './scrape-metadata/scrape-metadata.service';
import { ScrapeStatusService } from './scrape-status/scrape-status.service';
import { IndustryClassificationService } from './industry-classification/industry-classification.service';
import { ScrapeLogoService } from './scrape-logo/scrape-logo.service';
import { ScrapeImagesService } from './scrape-images/scrape-images.service';
import { ScreenshotService } from './screenshot-homepage/screenshot.service';
import { ScrapeContactInfoService } from './scrape-contact-info/scrape-contact-info.service';
import { ScrapeAddressService } from './scrape-address/scrape-address.service';
import { SeoAnalysisService } from './seo-analysis/seo-analysis.service';

// Models
import {
  ErrorResponse,
  RobotsResponse,
  Metadata,
  IndustryClassification,
} from './models/ServiceModels';

@Injectable()
export class ScraperService {
  constructor(
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
    private readonly robotsService: RobotsService,
    private readonly metadataService: ScrapeMetadataService,
    private readonly scrapeStatusService: ScrapeStatusService,
    private readonly industryClassificationService: IndustryClassificationService,
    private readonly scrapeLogoService: ScrapeLogoService,
    private readonly scrapeImagesService: ScrapeImagesService,
    private readonly screenshotService: ScreenshotService,
    private readonly scrapeContactInfoService: ScrapeContactInfoService,
    private readonly scrapeAddressService: ScrapeAddressService,
    private readonly seoAnalysisService: SeoAnalysisService,
  ) {}

  async scrape(url: string) {
    const start = performance.now();

    const cachedData:string = await this.cacheManager.get(url);
    if (cachedData) {
      const end = performance.now();
      const times = (end - start) / 1000;
      console.log('CACHE HIT', times);
      const dataFromCache = JSON.parse(cachedData);

      // update the time field of the object being returned from cache
      dataFromCache.time = parseFloat(times.toFixed(3));      
      return dataFromCache;
    }
    
    console.log('CACHE MISS - SCRAPE');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = {
      url: '',
      domainStatus: '',
      robots: null as RobotsResponse | ErrorResponse | null,
      metadata: null as Metadata | ErrorResponse | null,
      industryClassification: null as IndustryClassification | null,
      logo: '',
      images: [],
      slogan: '',
      contactInfo: { emails: [], phones: [] },
      time: 0,
      addresses: [],
      screenshot:'' as string | ErrorResponse,
      seoAnalysis: null as any,
    };

    // validate url

    data.url = url;

    // scrape robots.txt file & url validation
    // scrape web status - live, parked, under construction
    const robotsPromise = this.robotsService.readRobotsFile(data.url);
    const statusPromise = this.scrapeStatusService.scrapeStatus(data.url);

    const [robotsResponse, status] = await Promise.all([
      robotsPromise,
      statusPromise,
    ]);
    data.domainStatus = status;

    // blocking - check for error response
    // some kind of retry mechanism here?
    if ('errorStatus' in robotsResponse) {
      data.robots = robotsResponse as ErrorResponse;
      return data;
    }

    data.robots = robotsResponse as RobotsResponse;

    // scrape metadata & html - can we do this in parallel?
    // metadata checks if url is allowed to be scraped
    const metadataResponse = await this.metadataService.scrapeMetadata(
      data.url,
      data.robots
    );
    if ('errorStatus' in metadataResponse) {
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

    // classify industry based on metadata and domain name
    const industryClassificationPromise =
      this.industryClassificationService.classifyIndustry(
        data.url,
        data.metadata
      );

    // scrape logo
    const logoPromise = this.scrapeLogoService.scrapeLogo(
      data.url,
      data.metadata,
      data.robots
    );

    // scrape images - doesn't use metadata -- need to check if scraping images is allowed
    const imagesPromise = this.scrapeImagesService.scrapeImages(
      data.url,
      data.robots
    );
    const contactInfoPromise = this.scrapeContactInfoService.scrapeContactInfo(
      data.url,
      data.robots
    );
    const addressPromise = this.scrapeAddressService.scrapeAddress(
      data.url,
      data.robots
    );

    // get screenshot
    const screenshotPromise = this.getScreenshot(data.url);
    const seoAnalysisPromise = this.seoAnalysisService.seoAnalysis(data.url,data.robots);
    const [
      industryClassification,
      logo,
      images,
      contactInfo,
      addresses,
      screenshot,
      seoAnalysis,
    ] = await Promise.all([
      industryClassificationPromise,
      logoPromise,
      imagesPromise,
      contactInfoPromise,
      addressPromise,
      screenshotPromise,
      seoAnalysisPromise,
    ]);
    data.industryClassification = industryClassification;
    data.logo = logo;
    data.images = images;
    data.contactInfo = contactInfo;
    data.addresses = addresses.addresses;
    
    if ('errorStatus' in screenshot) {
      data.screenshot = ''; // Handle error case appropriately
    } else {
      data.screenshot = (screenshot as { screenshot: string }).screenshot; // Assign the screenshot URL
    }

    data.seoAnalysis = seoAnalysis;
    // scrape slogan

    // scrape images

    // do we want to perform analysis in the scraper service? - probably not

    const end = performance.now();
    const time = (end - start) / 1000;
    data.time = parseFloat(time.toFixed(3));

    // set the data in the cache
    await this.cacheManager.set(url, JSON.stringify(data));
    return data;
  }

  scrapeUrls(urls: string[]) {
    // scrape multiple urls in parallel
    // return data
  }

  async readRobotsFile(url: string) {
    return this.robotsService.readRobotsFile(url);
  }

  async scrapeMetadata(url: string) {
    const robotsResponse = await this.robotsService.readRobotsFile(url);
    if ('errorStatus' in robotsResponse) {
      return robotsResponse;
    }

    return this.metadataService.scrapeMetadata(
      robotsResponse.baseUrl,
      robotsResponse as RobotsResponse
    );
  }

  async scrapeStatus(url: string) {
    return this.scrapeStatusService.scrapeStatus(url);
  }

  async classifyIndustry(url: string) {
    const metadataResponse = await this.scrapeMetadata(url);
    if ('errorStatus' in metadataResponse) {
      return metadataResponse;
    }
    return this.industryClassificationService.classifyIndustry(
      url,
      metadataResponse
    );
  }

  async scrapeLogo(url: string) {
    const robotsResponse = await this.robotsService.readRobotsFile(url);
    if ('errorStatus' in robotsResponse) {
      return robotsResponse;
    }
    const metadataResponse = await this.metadataService.scrapeMetadata(
      robotsResponse.baseUrl,
      robotsResponse as RobotsResponse
    );
    if ('errorStatus' in metadataResponse) {
      return metadataResponse;
    }
    return this.scrapeLogoService.scrapeLogo(
      url,
      metadataResponse,
      robotsResponse
    );
  }

  async scrapeImages(url: string) {
    const robotsResponse = await this.robotsService.readRobotsFile(url);
    if ('errorStatus' in robotsResponse) {
      return robotsResponse;
    }
    const metadataResponse = await this.metadataService.scrapeMetadata(
      robotsResponse.baseUrl,
      robotsResponse as RobotsResponse
    );
    if ('errorStatus' in metadataResponse) {
      return metadataResponse;
    }
    return this.scrapeImagesService.scrapeImages(url, robotsResponse);
  }
  //get screenshot of the homepage
  async getScreenshot(url: string) {
    const robotsResponse = await this.robotsService.readRobotsFile(url);
    if ('errorStatus' in robotsResponse) {
      return robotsResponse;
    }
    return this.screenshotService.captureScreenshot(url, robotsResponse);
  }
  async scrapeContactInfo(url: string) {
    const robotsResponse = await this.robotsService.readRobotsFile(url);
    if ('errorStatus' in robotsResponse) {
      return robotsResponse;
    }

    return this.scrapeContactInfoService.scrapeContactInfo(
      url,
      robotsResponse as RobotsResponse
    );
  }
  async scrapeAddress(url: string) {
    const robotsResponse = await this.robotsService.readRobotsFile(url);
    if ('errorStatus' in robotsResponse) {
      return robotsResponse;
    }
    return this.scrapeAddressService.scrapeAddress(
      url,
      robotsResponse as RobotsResponse
    );
  }
  async seoAnalysis(url: string) {
    const htmlContent = await this.seoAnalysisService.fetchHtmlContent(url);
    const [metaDescriptionAnalysis,titleTagsAnalysis,headingAnalysis,imageAnalysis,uniqueContentAnalysis,internalLinksAnalysis,siteSpeedAnalysis, mobileFriendlinessAnalysis,
    ] = await Promise.all([
      this.seoAnalysisService.analyzeMetaDescription(htmlContent,url),
      this.seoAnalysisService.analyzeTitleTag(htmlContent),
      this.seoAnalysisService.analyzeHeadings(htmlContent),
      this.seoAnalysisService.analyzeImageOptimization(url),
      this.seoAnalysisService.analyzeContentQuality(htmlContent),
      this.seoAnalysisService.analyzeInternalLinks(htmlContent),
      this.seoAnalysisService.analyzeSiteSpeed(url),
      this.seoAnalysisService.analyzeMobileFriendliness(url),
    ]);
  
    return {
      titleTagsAnalysis,
      metaDescriptionAnalysis,
      headingAnalysis,
      imageAnalysis,
      uniqueContentAnalysis,
      internalLinksAnalysis,
      siteSpeedAnalysis,
      mobileFriendlinessAnalysis,

      
   };
  }
}

