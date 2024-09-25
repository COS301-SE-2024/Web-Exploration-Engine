/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { performance } from 'perf_hooks';
import getLogger from '../logging/webscraperlogger'
import { Cache } from 'cache-manager';
import * as puppeteer from 'puppeteer';

// Services
import { ProxyService } from './proxy/proxy.service';
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
import { SentimentAnalysisService } from './sentiment-analysis/sentiment-analysis.service';
import { KeywordAnalysisService } from './keyword-analysis/keyword-analysis.service';
import {NewsScraperService} from './scrape-news/scrape-news.service';
import { ShareCountService } from './share-count-analytics/share-count-analytics.service';
import { ScrapeReviewsService } from './scrape-reviews/scrape-reviews.service';
// Models
import {
  ErrorResponse,
  RobotsResponse,
  Metadata,
  IndustryClassification,
  SentimentClassification,
  ScrapeResult,
  ReviewData,
} from './models/ServiceModels';
import { error } from 'console';

const serviceName = "[ScraperService]";
const logger = getLogger();
logger.info('Scraper service initialised',serviceName);
@Injectable()
export class ScraperService implements OnModuleInit {

  constructor(
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
    private readonly pubsub: PubSubService,
    private readonly proxyService: ProxyService,
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
    private readonly sentimentAnalysisService: SentimentAnalysisService,
    private readonly keywordAnalysisService: KeywordAnalysisService,
    private readonly reviewsService: ScrapeReviewsService,
    private readonly newsScraperService: NewsScraperService,
    private readonly shareCountService: ShareCountService,
  ) {}

  onModuleInit() {
    this.listenForScrapingTasks();
  }

  async scrapeWebsite(data: {url: string, keyword?: string}, type: string) {
    switch (type) {
      case 'scrape':
        return this.scrape(data.url);
      case 'read-robots':
        return this.readRobotsFile(data.url);
      case 'scrape-metadata':
        return this.scrapeMetadata(data.url);
      case 'scrape-status':
        return this.scrapeStatus(data.url);
      case 'classify-industry':
        return this.classifyIndustry(data.url);
      case 'scrape-logo':
        return this.scrapeLogo(data.url);
      case 'scrape-images':
        return this.scrapeImages(data.url);
      case 'screenshot':
        return this.getScreenshot(data.url);
      case 'scrape-contact-info':
        return this.scrapeContactInfo(data.url);
      case 'scrape-addresses':
        return this.scrapeAddress(data.url);
      case 'seo-analysis':
        return this.seoAnalysis(data.url);
      case 'keyword-analysis':
        return this.keywordAnalysis(data.url, data.keyword);
      case 'scrape-news':
        return this.scrapeNews(data.url);
      case 'share-count':
        return this.getShareCount(data.url);
      case 'scrape-reviews':
        return this.scrapeReviews(data.url);
      default:
        throw new Error(`Unknown scraping type: ${type}`);
    }
  }

  async scrape(url: string) {
    logger.info('Scraping task started', serviceName, {url, type: 'scrape'});
    const start = performance.now();

    // create puppeteer instance
    const proxy = this.proxyService.getProxy();
    let browser: puppeteer.Browser;
    try {
      browser = await puppeteer.launch({
        args: [`--proxy-server=${proxy}`, '--no-sandbox', '--disable-setuid-sandbox'],
      });

    } catch (error) {
      logger.error('Scraping task failed', serviceName, {url, type: 'scrape', error: "Failed to launch browser"});
      return {
        errorStatus: 500,
        errorCode: '500 Internal Server Error',
        errorMessage: `Failed to launch browser ${error}`,
      } as ErrorResponse;
    }

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
      addresses: [],
      screenshot:'' as string | ErrorResponse,
      seoAnalysis: null as any,
      sentiment: null as SentimentClassification | null,
      scrapeNews: [],
      shareCountdata: null as any,
      time: 0,
      reviews: null as ReviewData | null,
    } as ScrapeResult;

    data.url = url;

  // Scrape robots.txt status concurrently
    const robotsPromise = this.robotsService.readRobotsFile(url);
    const statusPromise = this.scrapeStatusService.scrapeStatus(url);

    const [robots, domainStatus] = await Promise.all([robotsPromise, statusPromise]);

    data.domainStatus = domainStatus;

    if ('errorStatus' in robots) {
      data.robots = robots as ErrorResponse;
      // close browser
      await browser.close();
      // stop early if robots.txt scraping fails
      const end = performance.now();
      const time = (end - start) / 1000;
      data.time = parseFloat(time.toFixed(4));
      return data;
    }

    data.robots = robots as RobotsResponse;


  // Serially scrape metadata and all services that depend on only robots.txt
    const metadataPromise = this.metadataService.scrapeMetadata(data.robots.baseUrl, data.robots, browser);
    const screenshotPromise = this.screenshotService.captureScreenshot(url, data.robots, browser);
    const contactInfoPromise = this.scrapeContactInfoService.scrapeContactInfo(url, data.robots, browser);
    const addressPromise = this.scrapeAddressService.scrapeAddress(url, data.robots, browser);
    const seoAnalysisPromise = this.seoAnalysisService.seoAnalysis(url, data.robots, browser);



    const [metadata, screenshot, contactInfo, addresses, seoAnalysis] = await Promise.all([metadataPromise, screenshotPromise, contactInfoPromise, addressPromise, seoAnalysisPromise]);

    if ('errorStatus' in screenshot) {
      data.screenshot = screenshot as ErrorResponse;
    } else {
      data.screenshot = screenshot.screenshot;
    }

    // add error handling for contactInfo and addresses
    data.contactInfo = contactInfo;

    data.addresses = addresses.addresses;

    if ('errorStatus' in metadata) {
      data.metadata = metadata as ErrorResponse;
      // close browser
      await browser.close();
      const end = performance.now();
      const time = (end - start) / 1000;
      data.time = parseFloat(time.toFixed(4));
      return data; // return early if metadata scraping fails
    } else {
      data.metadata = metadata as Metadata;
    }

    data.seoAnalysis = seoAnalysis;

  // Scrape services dependent on metadata
    const industryClassificationPromise = this.industryClassificationService.classifyIndustry(url, data.metadata);
    const logoPromise = this.scrapeLogoService.scrapeLogo(url, data.metadata, data.robots, browser);
    const imagesPromise = this.scrapeImagesService.scrapeImages(url, data.robots, browser);
    const sentimentClassificationPromise = this.sentimentAnalysisService.classifySentiment(url, data.metadata);

    const newsScrapingPromise = this.newsScraperService.fetchNewsArticles(url);
    const shareCountPromise = this.shareCountService.getShareCount(url);
    const reviewsPromise = this.reviewsService.scrapeReviews(url, browser);

    const [industryClassification, logo, images, sentimentAnalysis, newsScraping, shareCount, reviews ] = await Promise.all([
      industryClassificationPromise, logoPromise, imagesPromise, sentimentClassificationPromise, newsScrapingPromise, shareCountPromise, reviewsPromise
    ]);

    // add error handling industryClassification
    data.industryClassification = industryClassification as IndustryClassification;

    data.logo = logo;

    data.images = images;

    data.sentiment = sentimentAnalysis;


    data.scrapeNews = newsScraping;
    
    data.shareCountdata = shareCount;

    data.reviews = reviews;

    // close browser
    await browser.close();

    const end = performance.now();
    const time = (end - start) / 1000;
    data.time = parseFloat(time.toFixed(4));
    const duration = end - start;

    logger.info('Scraping task completed successfully', serviceName, {url, type: 'scrape', duration});

    return data;
  }

  async readRobotsFile(url: string) {
    const data = await this.robotsService.readRobotsFile(url);
    return data;
  }

  async scrapeMetadata(url: string) {
    const robotsResponse = await this.robotsService.readRobotsFile(url);
    if ('errorStatus' in robotsResponse) {
      return robotsResponse;
    }

    // create puppeteer instance
    let browser: puppeteer.Browser;
    try {
      browser = await puppeteer.launch(); // add proxy here
    } catch (error) {
      logger.error(serviceName,'Failed to launch browser', error);
      return {
        errorStatus: 500,
        errorCode: '500 Internal Server Error',
        errorMessage: 'Failed to launch browser',
      } as ErrorResponse;
    }

    const metadataResponse = await this.metadataService.scrapeMetadata(
      robotsResponse.baseUrl,
      robotsResponse as RobotsResponse,
      browser
    );

    await browser.close();
    return metadataResponse;
  }

  async scrapeStatus(url: string) {
    const data = await this.scrapeStatusService.scrapeStatus(url);
    return data;
  }

  async classifyIndustry(url: string) {
    const robotsResponse = await this.robotsService.readRobotsFile(url);
    if ('errorStatus' in robotsResponse) {
      return robotsResponse;
    }
    // create puppeteer instance
    let browser: puppeteer.Browser;
    const proxy = this.proxyService.getProxy();
    try {
      browser = await puppeteer.launch({
        args: [`--proxy-server=${proxy}`, '--no-sandbox', '--disable-setuid-sandbox'],
      }); // add proxy here
    } catch (error) {
      logger.error(serviceName,'Failed to launch browser', error);
      return {
        errorStatus: 500,
        errorCode: '500 Internal Server Error',
        errorMessage: 'Failed to launch browser',
      } as ErrorResponse;
    }

    const metadataResponse = await this.metadataService.scrapeMetadata(
      robotsResponse.baseUrl,
      robotsResponse as RobotsResponse,
      browser
    );

    if ('errorStatus' in metadataResponse) {
      await browser.close();
      return metadataResponse;
    }

    const industryClassification = await this.industryClassificationService.classifyIndustry(url, metadataResponse as Metadata);
    return industryClassification;
  }

  async scrapeLogo(url: string) {
    const robotsResponse = await this.robotsService.readRobotsFile(url);
    if ('errorStatus' in robotsResponse) {
      return robotsResponse;
    }

    // create puppeteer instance
    let browser: puppeteer.Browser;
    const proxy = this.proxyService.getProxy();
    try {
      browser = await puppeteer.launch({
        args: [`--proxy-server=${proxy}`, '--no-sandbox', '--disable-setuid-sandbox'],
      }); // add proxy here
    } catch (error) {
      logger.error(serviceName,'Failed to launch browser', error);
      return {
        errorStatus: 500,
        errorCode: '500 Internal Server Error',
        errorMessage: 'Failed to launch browser',
      } as ErrorResponse;
    }

    const metadataResponse = await this.metadataService.scrapeMetadata(
      robotsResponse.baseUrl,
      robotsResponse as RobotsResponse,
      browser
    );
    if ('errorStatus' in metadataResponse) {
      await browser.close();
      return metadataResponse;
    }

    const logo = await this.scrapeLogoService.scrapeLogo(url, metadataResponse as Metadata, robotsResponse, browser);
    await browser.close();
    return logo;
  }

  async scrapeImages(url: string) {
    const robotsResponse = await this.robotsService.readRobotsFile(url);
    if ('errorStatus' in robotsResponse) {
      return robotsResponse;
    }

    // create puppeteer instance
    let browser: puppeteer.Browser;
    const proxy = this.proxyService.getProxy();
    try {
      browser = await puppeteer.launch({
        args: [`--proxy-server=${proxy}`, '--no-sandbox', '--disable-setuid-sandbox'],
      });
    } catch (error) {
      logger.error(serviceName,'Failed to launch browser', error);
      return {
        errorStatus: 500,
        errorCode: '500 Internal Server Error',
        errorMessage: 'Failed to launch browser',
      } as ErrorResponse;
    }

    const metadataResponse = await this.metadataService.scrapeMetadata(
      robotsResponse.baseUrl,
      robotsResponse as RobotsResponse,
      browser
    );
    if ('errorStatus' in metadataResponse) {
      await browser.close();
      return metadataResponse;
    }

    const images = await this.scrapeImagesService.scrapeImages(url, robotsResponse, browser);
    await browser.close();
    return images;
  }

  //get screenshot of the homepage
  async getScreenshot(url: string) {
    const robotsResponse = await this.robotsService.readRobotsFile(url);
    if ('errorStatus' in robotsResponse) {
      return robotsResponse;
    }

    // create puppeteer instance
    let browser: puppeteer.Browser;
    const proxy = this.proxyService.getProxy();
    try {
      browser = await puppeteer.launch({
        args: [`--proxy-server=${proxy}`, '--no-sandbox', '--disable-setuid-sandbox'],
      });
    } catch (error) {
      logger.error(serviceName,'Failed to launch browser', error);
      return {
        errorStatus: 500,
        errorCode: '500 Internal Server Error',
        errorMessage: 'Failed to launch browser',
      } as ErrorResponse;
    }

    const screenshot = await this.screenshotService.captureScreenshot(url, robotsResponse, browser);
    await browser.close();
    return screenshot;
  }

  async scrapeContactInfo(url: string) {
    const robotsResponse = await this.robotsService.readRobotsFile(url);
    if ('errorStatus' in robotsResponse) {
      return robotsResponse;
    }

    // create puppeteer instance
    let browser: puppeteer.Browser;
    const proxy = this.proxyService.getProxy();
    try {
      browser = await puppeteer.launch({
        args: [`--proxy-server=${proxy}`, '--no-sandbox', '--disable-setuid-sandbox'],
      }); // add proxy here
    } catch (error) {
      logger.error(serviceName,'Failed to launch browser', error);
      return {
        errorStatus: 500,
        errorCode: '500 Internal Server Error',
        errorMessage: 'Failed to launch browser',
      } as ErrorResponse;
    }

    const contactInfo = await this.scrapeContactInfoService.scrapeContactInfo(url, robotsResponse, browser);
    await browser.close();
    return contactInfo;
  }

  async scrapeAddress(url: string) {
    const robotsResponse = await this.robotsService.readRobotsFile(url);
    if ('errorStatus' in robotsResponse) {
      return robotsResponse;
    }

    // create puppeteer instance
    let browser: puppeteer.Browser;
    const proxy = this.proxyService.getProxy();
    try {
      browser = await puppeteer.launch({
        args: [`--proxy-server=${proxy}`, '--no-sandbox', '--disable-setuid-sandbox'],
      }); // add proxy here
    } catch (error) {
      logger.error(serviceName,'Failed to launch browser', error);
      return {
        errorStatus: 500,
        errorCode: '500 Internal Server Error',
        errorMessage: 'Failed to launch browser',
      } as ErrorResponse;
    }

    const addresses = await this.scrapeAddressService.scrapeAddress(url, robotsResponse, browser);
    await browser.close();
    return addresses;
  }

  async seoAnalysis(url: string) {
    const robotsResponse = await this.robotsService.readRobotsFile(url);
    if ('errorStatus' in robotsResponse) {
      return robotsResponse;
    }

    // create puppeteer instance
    let browser: puppeteer.Browser;
    const proxy = this.proxyService.getProxy();
    try {
      browser = await puppeteer.launch({
        args: [`--proxy-server=${proxy}`, '--no-sandbox', '--disable-setuid-sandbox'],
      }); // add proxy here
    } catch (error) {
      logger.error(serviceName,'Failed to launch browser', error);
      return {
        errorStatus: 500,
        errorCode: '500 Internal Server Error',
        errorMessage: 'Failed to launch browser',
      } as ErrorResponse;
    }

    const seoAnalysis = await this.seoAnalysisService.seoAnalysis(url, robotsResponse, browser);
    await browser.close();
    return seoAnalysis;
  }

  async classifySentiment(url: string) {
    const robotsResponse = await this.robotsService.readRobotsFile(url);
    if ('errorStatus' in robotsResponse) {
      return robotsResponse;
    }

    // create puppeteer instance
    let browser: puppeteer.Browser;
    const proxy = this.proxyService.getProxy();
    try {
      browser = await puppeteer.launch({
        args: [`--proxy-server=${proxy}`, '--no-sandbox', '--disable-setuid-sandbox'],
      }); // add proxy here
    } catch (error) {
      logger.error(serviceName,'Failed to launch browser', error);
      return {
        errorStatus: 500,
        errorCode: '500 Internal Server Error',
        errorMessage: 'Failed to launch browser',
      } as ErrorResponse;
    }

    const metadataResponse = await this.metadataService.scrapeMetadata(
      robotsResponse.baseUrl,
      robotsResponse as RobotsResponse,
      browser
    );
    if ('errorStatus' in metadataResponse) {
      await browser.close();
      return metadataResponse;
    }

    const sentimentClassification = await this.sentimentAnalysisService.classifySentiment(url, metadataResponse as Metadata);
    await browser.close();
    return sentimentClassification;
  }

  async keywordAnalysis(url: string, keyword: string) {
    // create puppeteer instance
    let browser: puppeteer.Browser;
    const proxy = this.proxyService.getProxy();
    try {
      browser = await puppeteer.launch({
        args: [`--proxy-server=${proxy}`, '--no-sandbox', '--disable-setuid-sandbox'],
      }); // add proxy here
    } catch (error) {
      logger.error(serviceName,'Failed to launch browser', error);
      return {
        errorStatus: 500,
        errorCode: '500 Internal Server Error',
        errorMessage: 'Failed to launch browser',
      } as ErrorResponse;
    }

    const keywordAnalysis = await this.keywordAnalysisService.getKeywordRanking(url, keyword, browser);
    await browser.close();
    return keywordAnalysis;
  }

  async listenForScrapingTasks() {
    const subscriptionName = process.env.GOOGLE_CLOUD_SUBSCRIPTION;
    if (!subscriptionName) {
      logger.error("Environment variable error", serviceName, {variable: 'GOOGLE_CLOUD_SUBSCRIPTION', type: 'string', error: 'not set'});
      return;
    }

    const messageHandler = async (message) => {
      try {
        await this.handleMessage(message);
      } catch (error) {
        logger.error('Error handling message', serviceName, {error: error.message});
      }
    };

    await this.pubsub.subscribe(subscriptionName, messageHandler);
    logger.info('Subscribed to Pub/Sub topic', serviceName, {subscriptionName});
  }

  async handleMessage(message) {
    // Get the publish time of the message - when message was originally published
    const publishTime = message.publishTime;

    // Calculate the age of the message in milliseconds
    const messageAge = Date.now() - publishTime.getTime();

    // Define a threshold for maximum age, e.g., 5 minutes (300,000 milliseconds)
    const maxAge = 5 * 60 * 1000;

    logger.info('Received scraping task', serviceName, {messageId: message.id, messageAge, publishTime});

    if (messageAge > maxAge) {
        logger.info('Stale message', serviceName, {descraiption: 'Message is to old, will be moved to a dead-letter topic after 5 retries', messageId: message.id, messageAge, maxAge});
        // Handle stale messages (e.g., nack, move to a dead-letter topic, log, etc.)
        message.nack();
        // Return error response??
    } else {
        // Process the message if it is within acceptable age limits
        //logger.info(serviceName,`Processing message: ${message.data.toString()}`)

        const start = performance.now();
        const { data, type } = JSON.parse(message.data.toString());
        if (!data) {
          message.nack();
          logger.error('Error processing message', serviceName, {error: 'Data field is required'});
          throw new Error('Data field is required');
          
        }

        const { url } = data;
        let cacheKey: string;

        // separate cache key format for keyword analysis - need to account for key word input
        if (type === 'keyword-analysis') {
          const { keyword } = data;
          cacheKey = `${url}-keyword-${keyword}`; // eg https://www.google.com-keyword-analysis
        } else {
          cacheKey = `${url}-${type}`; // eg https://www.google.com-scrape
        }

        // Cache check and update logic
        const cachedData = await this.getCachedData(cacheKey);
        if (cachedData) {
          // check if error status
          if (cachedData.status !== 'error') {
            // update time if cache proccessing is completed
            if (cachedData.status === 'completed') {
              const end = performance.now();
              const times = (end - start) / 1000;
              logger.info('Cache hit for scraping task', serviceName, {url, type, cacheKey});

              // Update time field
              cachedData.result.time = parseFloat(times.toFixed(4));
              await this.cacheManager.set(cacheKey, JSON.stringify(cachedData));
            }

            // Performance Logging
            const duration = performance.now() - start;
            logger.info('Scraping task completed', serviceName, {duration, url, type, cacheHit: true});
            message.ack();
            return;
          }
        }

        // Scrape if not in cache/already processing (CACHE MISS or error status)
        //logger.info(serviceName,'CACHE MISS - SCRAPE');

        // Add to cache as processing
        logger.info('Cache miss for scraping task', serviceName, {url, type, cacheKey});
        await this.cacheManager.set(cacheKey, JSON.stringify({ status: 'processing', pollingURL: `/scraper/status/${encodeURIComponent(url)}` }));
        message.ack();

        try {
          const result = await this.scrapeWebsite(data, type);
          const completeData = {
            status: 'completed',
            result,
          };
          await this.cacheManager.set(cacheKey, JSON.stringify(completeData));

          // logger.info(serviceName,`Scraping completed for URL: ${url}, Type: ${type}`);
          // Performance Logging
          const duration = performance.now() - start;
          // logger.info(serviceName,`Duration of ${serviceName} : ${duration}, cache-miss`);
         } catch (error) {
          // logger.error(serviceName,`Error scraping URL: ${url}`, error);
          await this.cacheManager.set(cacheKey, JSON.stringify({ status: 'error' }));
        }
    }
  }

  async getShareCount(url: string) {
    try {
      const shareCount = await this.shareCountService.getShareCount(url);
      return shareCount;
    } catch (error) {
      logger.error(serviceName,`${serviceName} Failed to get share count for ${url}: ${error}`);
      return {
        errorStatus: 500,
        errorCode: '500 Internal Server Error',
        errorMessage: `Failed to get share count for ${url}: ${error}`,
      } as ErrorResponse;
    }
  }
  async getCachedData(cacheKey: string) {
    const cachedDataString:string = await this.cacheManager.get(cacheKey);
    if (cachedDataString) {
      const data = JSON.parse(cachedDataString);
      if (data.status === 'completed') {
        return data;
      } else if (data.status === 'processing') {
        logger.info(serviceName,`Already processing ojb: ${cacheKey}`);
        return null;
      } else if (data.status === 'error') {
        logger.error(serviceName,`Error during scraping job: ${cacheKey}`, data.error);
        return null;
      }
    }
    return null;
  }
  async scrapeNews(url: string) {
    const robotsResponse = await this.robotsService.readRobotsFile(url);
    if ('errorStatus' in robotsResponse) {
      return robotsResponse;
    }

    let browser: puppeteer.Browser;
    const proxy = this.proxyService.getProxy();

    try {
      browser = await puppeteer.launch({
        args: [`--proxy-server=${proxy}`, '--no-sandbox', '--disable-setuid-sandbox'],
      });
    } catch (error) {
      logger.error(serviceName,`${serviceName} Failed to launch browser: ${error instanceof Error ? error.message : String(error)}`);
      return {
        errorStatus: 500,
        errorCode: '500 Internal Server Error',
        errorMessage: 'Failed to launch browser',
      } as ErrorResponse;
    }

    try {
      const newsData = await this.newsScraperService.fetchNewsArticles(url);
      return newsData;
    } catch (error) {
      logger.error(serviceName,`${serviceName} Error scraping news: ${error instanceof Error ? error.message : String(error)}`);
      return {
        errorStatus: 500,
        errorCode: '500 Internal Server Error',
        errorMessage: `Error scraping news: ${error instanceof Error ? error.message : String(error)}`,
      } as ErrorResponse;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
  async scrapeReviews(url: string) {
    const robotsResponse = await this.robotsService.readRobotsFile(url);
    if ('errorStatus' in robotsResponse) {
      return robotsResponse;
    }
  
    let browser: puppeteer.Browser;
    const proxy = this.proxyService.getProxy();
  
    try {
      browser = await puppeteer.launch({
        args: [`--proxy-server=${proxy}`, '--no-sandbox', '--disable-setuid-sandbox'],
      });
    } catch (error) {
      logger.error(serviceName,`Failed to launch browser for scraping reviews: ${error instanceof Error ? error.message : String(error)}`);
      return {
        errorStatus: 500,
        errorCode: '500 Internal Server Error',
        errorMessage: 'Failed to launch browser',
      } as ErrorResponse;
    }
  
    try {
      const reviewsData = await this.reviewsService.scrapeReviews(url, browser);
      return reviewsData;
    } catch (error) {
      logger.error(serviceName,`Error scraping reviews: ${error instanceof Error ? error.message : String(error)}`);
      return {
        errorStatus: 500,
        errorCode: '500 Internal Server Error',
        errorMessage: `Error scraping reviews: ${error instanceof Error ? error.message : String(error)}`,
      } as ErrorResponse;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
  

}

