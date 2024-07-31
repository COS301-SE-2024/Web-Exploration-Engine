import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Cache } from 'cache-manager';

// Services
import { PubSubService } from './pub-sub/pub_sub.service';
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
export class ScraperService implements OnModuleInit {
  
  constructor(
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
    private readonly pubsub: PubSubService,
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

  onModuleInit() {
    this.listenForScrapingTasks();
  }

  async scrapeWebsite(url: string, type: string) {
    switch (type) {
      case 'scrape':
        return this.scrape(url);
      case 'read-robots':
        return this.readRobotsFile(url);
      case 'scrape-metadata':
        return this.scrapeMetadata(url);
      case 'scrape-status':
        return this.scrapeStatus(url);
      case 'classify-industry':
        return this.classifyIndustry(url);
      case 'scrape-logo':
        return this.scrapeLogo(url);
      case 'scrape-images':
        return this.scrapeImages(url);
      case 'screenshot':
        return this.getScreenshot(url);
      case 'scrape-contact-info':
        return this.scrapeContactInfo(url);
      case 'scrape-address':
        return this.scrapeAddress(url);
      case 'seo-analysis':
        return this.seoAnalysis(url);
      default:
        throw new Error(`Unknown scraping type: ${type}`);
    }
  }

  async scrape(url: string) {
    console.log("Started scaping")
    const start = performance.now();

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
    const screenshotPromise = this.screenshotService.captureScreenshot(url, robotsResponse);
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
    data.time = parseFloat(time.toFixed(4));

    // set the data in the cache
    await this.cacheManager.set(url, JSON.stringify(data));
    return data;
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
    const [metaDescriptionAnalysis,titleTagsAnalysis,headingAnalysis,imageAnalysis,uniqueContentAnalysis
      ,internalLinksAnalysis,siteSpeedAnalysis, mobileFriendlinessAnalysis,structuredDataAnalysis,
      indexabilityAnalysis,XMLSitemapAnalysis,canonicalTagAnalysis,lighthouseAnalysis,
    ] = await Promise.all([
      this.seoAnalysisService.analyzeMetaDescription(htmlContent,url),
      this.seoAnalysisService.analyzeTitleTag(htmlContent),
      this.seoAnalysisService.analyzeHeadings(htmlContent),
      this.seoAnalysisService.analyzeImageOptimization(url),
      this.seoAnalysisService.analyzeContentQuality(htmlContent),
      this.seoAnalysisService.analyzeInternalLinks(htmlContent),
      this.seoAnalysisService.analyzeSiteSpeed(url),
      this.seoAnalysisService.analyzeMobileFriendliness(url),
      this.seoAnalysisService.analyzeStructuredData(htmlContent),
      this.seoAnalysisService.analyzeIndexability(htmlContent),
      this.seoAnalysisService.analyzeXmlSitemap(url),
      this.seoAnalysisService.analyzeCanonicalTags(htmlContent),
      this.seoAnalysisService.runLighthouse(url),
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
      structuredDataAnalysis,
      indexabilityAnalysis,
      XMLSitemapAnalysis,
      canonicalTagAnalysis,
      lighthouseAnalysis,      
   };
  }

  async listenForScrapingTasks() {
    const subscriptionName = 'projects/alien-grove-429815-s9/subscriptions/scraping-tasks-sub'

    const messageHandler = async (message) => {
      try {
        await this.handleMessage(message);
      } catch (error) {
        console.error('Error handling message', error);
      }
    };

    this.pubsub.subscribe(subscriptionName, messageHandler);
  }

  async handleMessage(message) {
    const start = performance.now();
    const { url, type } = JSON.parse(message.data.toString());
    const cacheKey = `${url}-${type}`; // eg https://www.google.com-scrape  

    // Cache check and update logic
    const cachedData = await this.getCachedData(cacheKey);
    if (cachedData) {
      // check if error status
      if (cachedData.status !== 'error') {
        // update time if cache proccessing is completed
        if (cachedData.status === 'completed') {
          const end = performance.now();
          const times = (end - start) / 1000;
          console.log('CACHE HIT', times);
      
          // Update time field
          cachedData.time = parseFloat(times.toFixed(4));
        }

        return cachedData;
      }
    }
  
    // Scrape if not in cache/already processing (CACHE MISS or error status)
    console.log('CACHE MISS - SCRAPE');
  
    // Add to cache as processing
    await this.cacheManager.set(cacheKey, JSON.stringify({ status: 'processing', pollingURL: `/scraper/status/${encodeURIComponent(url)}` }));
    message.ack();
  
    try {
      const result = await this.scrapeWebsite(url, type);
      const completeData = {
        status: 'completed',
        result,
      };
      await this.cacheManager.set(cacheKey, JSON.stringify(completeData));
      console.log(`Scraping completed for URL: ${url}, Type: ${type}`);
      // console.log(`Result: ${result}`);
    } catch (error) {
      console.error(`Error scraping URL: ${url}`, error);
      await this.cacheManager.set(cacheKey, JSON.stringify({ status: 'error' }));
    }
  }

  async getCachedData(url) {
    const cachedDataString:string = await this.cacheManager.get(url);
    if (cachedDataString) {
      const data = JSON.parse(cachedDataString);
      if (data.status === 'completed') {
        return data;
      } else if (data.status === 'processing') {
        console.log(`Already processing URL: ${url}`);
        return null;
      } else if (data.status === 'error') {
        console.error(`Error scraping URL: ${url}`, data.error);
        return null;
      }
    }
    return null;
  }
}

