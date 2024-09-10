import { Controller, Get, Query, Inject, Param, UseInterceptors } from '@nestjs/common';
import { PubSubService } from '../pub-sub/pub_sub.service';
import { ApiTags } from '@nestjs/swagger';
import { Cache } from 'cache-manager';
import {
  ScrapeOperation, RobotsOperation, MetadataOperation, StatusOperation, ClassifyIndustryOperation, ImagesOperation, LogoOperation, ScreenshotOperation, ContactInfoOperation, AddressesOperation, SeoAnalysisOperation,
  ScraperQuery, ScraperResponse200, ScraperResponse400, ScraperResponse500, NewsOperation,
  GetJobStatusQuery, GetJobStatusTypeQuery, GetJobStatusOperation, GetJobStatusResponse200, GetJobStatusResponse400, GetJobStatusKeywordQuery,
} from './scraper.api';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PerformanceInterceptor } from './performance.interceptor';

@ApiTags('Scraping')
@Controller('scraper')
@UseInterceptors(PerformanceInterceptor)
export class ScraperController {
  topicName: string;
  constructor(
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
    private readonly pubsubService : PubSubService,
  ) {
    this.topicName = process.env.GOOGLE_CLOUD_TOPIC;
    if (!this.topicName) {
      throw new Error('GOOGLE_CLOUD_TOPIC env variable is required');
    }
  } 

  @ScrapeOperation
  @ScraperQuery
  @ScraperResponse200
  @ScraperResponse400
  @ScraperResponse500
  @Get()
  async scrape(@Query('url') url: string) {
    try {
      if (!url) {
        throw new HttpException('URL is required', HttpStatus.BAD_REQUEST);
      }

      const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
      if (!urlPattern.test(url)) {
        throw new HttpException('Invalid URL format', HttpStatus.BAD_REQUEST);
      }

      console.log("Publishing scraping task for url: ", url);
      const message = {
        type: 'scrape',
        data: { url },
      };
      await this.pubsubService.publishMessage(this.topicName, message);

      return {
        message: 'Scraping task published',
        status: 'processing',
        pollingUrl: `/status?type=scrape&url=${encodeURIComponent(url)}`,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        console.warn('Handled error in scrape method:', error.message);
        throw error;
      } else {
        console.error('Unhandled error in scrape method:', error);
        throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @RobotsOperation
  @ScraperQuery
  @ScraperResponse200
  @ScraperResponse400
  @ScraperResponse500
  @Get('read-robots')
  async readRobotsFile(@Query('url') url: string) {
    try {
      if (!url) {
        throw new HttpException('URL is required', HttpStatus.BAD_REQUEST);
      }

      const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
      if (!urlPattern.test(url)) {
        throw new HttpException('Invalid URL format', HttpStatus.BAD_REQUEST);
      }

      console.log("Publishing read-robots task for url: ", url);
      const message = {
        type: 'read-robots',
        data: { url },
      };
      await this.pubsubService.publishMessage(this.topicName, message);

      return {
        message: 'Read robots task published',
        status: 'processing',
        pollingUrl: `/status/read-robots/${encodeURIComponent(url)}`,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        console.warn('Handled error in readRobotsFile method:', error.message);
        throw error;
      } else {
        console.error('Unhandled error in readRobotsFile method:', error);
        throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @MetadataOperation
  @ScraperQuery
  @ScraperResponse200
  @ScraperResponse400
  @ScraperResponse500
  @Get('scrape-metadata')
  async scrapeMetadata(@Query('url') url: string) {
    try {
      if (!url) {
        throw new HttpException('URL is required', HttpStatus.BAD_REQUEST);
      }

      const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
      if (!urlPattern.test(url)) {
        throw new HttpException('Invalid URL format', HttpStatus.BAD_REQUEST);
      }

      console.log("Publishing scrape-metadata task for url: ", url);
      const message = {
        type: 'scrape-metadata',
        data: { url },
      };
      await this.pubsubService.publishMessage(this.topicName, message);

      return {
        message: 'Scrape metadata task published',
        status: 'processing',
        pollingUrl: `/status/scrape-metadata/${encodeURIComponent(url)}`,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        console.warn('Handled error in scrapeMetadata method:', error.message);
        throw error;
      } else {
        console.error('Unhandled error in scrapeMetadata method:', error);
        throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @StatusOperation
  @ScraperQuery
  @ScraperResponse200
  @ScraperResponse400
  @ScraperResponse500
  @Get('scrape-status')
  async scrapeStatus(@Query('url') url: string) {
    try {
      if (!url) {
        throw new HttpException('URL is required', HttpStatus.BAD_REQUEST);
      }

      const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
      if (!urlPattern.test(url)) {
        throw new HttpException('Invalid URL format', HttpStatus.BAD_REQUEST);
      }

      console.log("Publishing scrape-metadata task for url: ", url);
      const message = {
        type: 'scrape-status',
        data: { url },
      };
      await this.pubsubService.publishMessage(this.topicName, message);

      return {
        message: 'Scrape metadata task published',
        status: 'processing',
        pollingUrl: `/status/scrape-status/${encodeURIComponent(url)}`,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        console.warn('Handled error in scrapeStatus method:', error.message);
        throw error;
      } else {
        console.error('Unhandled error in scrapeStatus method:', error);
        throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @ClassifyIndustryOperation
  @ScraperQuery
  @ScraperResponse200
  @ScraperResponse400
  @ScraperResponse500
  @Get('classify-industry')
  async classifyIndustry(@Query('url') url: string) {
    try {
      if (!url) {
        throw new HttpException('URL is required', HttpStatus.BAD_REQUEST);
      }

      const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
      if (!urlPattern.test(url)) {
        throw new HttpException('Invalid URL format', HttpStatus.BAD_REQUEST);
      }

      console.log("Publishing classify-industry task for url: ", url);
      const message = {
        type: 'classify-industry',
        data: { url },
      };
      await this.pubsubService.publishMessage(this.topicName, message);

      return {
        message: 'Classify industry task published',
        status: 'processing',
        pollingUrl: `/status/classify-industry/${encodeURIComponent(url)}`,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        console.warn('Handled error in classifyIndustry method:', error.message);
        throw error;
      } else {
        console.error('Unhandled error in classifyIndustry method:', error);
        throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @ImagesOperation
  @ScraperQuery
  @ScraperResponse200
  @ScraperResponse400
  @ScraperResponse500
  @Get('scrape-images')
  async scrapeImages(@Query('url') url: string) {
    try {
      if (!url) {
        throw new HttpException('URL is required', HttpStatus.BAD_REQUEST);
      }

      const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
      if (!urlPattern.test(url)) {
        throw new HttpException('Invalid URL format', HttpStatus.BAD_REQUEST);
      }

      console.log("Publishing scrape-images task for url: ", url);
      const message = {
        type: 'scrape-images',
        data: { url },
      };
      await this.pubsubService.publishMessage(this.topicName, message);

      return {
        message: 'Scrape images task published',
        status: 'processing',
        pollingUrl: `/status/scrape-images/${encodeURIComponent(url)}`,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        console.warn('Handled error in scrapeImages method:', error.message);
        throw error;
      } else {
        console.error('Unhandled error in scrapeImages method:', error);
        throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @LogoOperation
  @ScraperQuery
  @ScraperResponse200
  @ScraperResponse400
  @ScraperResponse500
  @Get('scrape-logo')
  async scrapeLogo(@Query('url') url: string) {
    try {
      if (!url) {
        throw new HttpException('URL is required', HttpStatus.BAD_REQUEST);
      }

      const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
      if (!urlPattern.test(url)) {
        throw new HttpException('Invalid URL format', HttpStatus.BAD_REQUEST);
      }

      console.log("Publishing scrape-logo task for url: ", url);
      const message = {
        type: 'scrape-logo',
        data: { url },
      };
      await this.pubsubService.publishMessage(this.topicName, message);

      return {
        message: 'Scrape logo task published',
        status: 'processing',
        pollingUrl: `/status/scrape-logo/${encodeURIComponent(url)}`,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        console.warn('Handled error in scrapeLogo method:', error.message);
        throw error;
      } else {
        console.error('Unhandled error in scrapeLogo method:', error);
        throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @ScreenshotOperation
  @ScraperQuery
  @ScraperResponse200
  @ScraperResponse400
  @ScraperResponse500
  @Get('screenshot')
  async getScreenshot(@Query('url') url: string) {
    try {
      if (!url) {
        throw new HttpException('URL is required', HttpStatus.BAD_REQUEST);
      }

      const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
      if (!urlPattern.test(url)) {
        throw new HttpException('Invalid URL format', HttpStatus.BAD_REQUEST);
      }

      console.log("Publishing screenshot task for url: ", url);
      const message = {
        type: 'screenshot',
        data: { url },
      };
      await this.pubsubService.publishMessage(this.topicName, message);

      return {
        message: 'Screenshot task published',
        status: 'processing',
        pollingUrl: `/status/screenshot/${encodeURIComponent(url)}`,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        console.warn('Handled error in getScreenshot method:', error.message);
        throw error;
      } else {
        console.error('Unhandled error in getScreenshot method:', error);
        throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }


  @ContactInfoOperation
  @ScraperQuery
  @ScraperResponse200
  @ScraperResponse400
  @ScraperResponse500
  @Get('scrape-contact-info')
  async scrapeContactInfo(@Query('url') url: string) {
    try {
      if (!url) {
        throw new HttpException('URL is required', HttpStatus.BAD_REQUEST);
      }

      const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
      if (!urlPattern.test(url)) {
        throw new HttpException('Invalid URL format', HttpStatus.BAD_REQUEST);
      }

      console.log("Publishing scrape-contact-info task for url: ", url);
      const message = {
        type: 'scrape-contact-info',
        data: { url },
      };
      await this.pubsubService.publishMessage(this.topicName, message);

      return {
        message: 'Scrape contact info task published',
        status: 'processing',
        pollingUrl: `/status/scrape-contact-info/${encodeURIComponent(url)}`,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        console.warn('Handled error in scrapeContactInfo method:', error.message);
        throw error;
      } else {
        console.error('Unhandled error in scrapeContactInfo method:', error);
        throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @AddressesOperation
  @ScraperQuery
  @ScraperResponse200
  @ScraperResponse400
  @ScraperResponse500
  @Get('scrape-addresses')
  async scrapeAddresses(@Query('url') url: string) {
    try {
      if (!url) {
        throw new HttpException('URL is required', HttpStatus.BAD_REQUEST);
      }

      const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
      if (!urlPattern.test(url)) {
        throw new HttpException('Invalid URL format', HttpStatus.BAD_REQUEST);
      }

      console.log("Publishing scrape-addresses task for url: ", url);
      const message = {
        type: 'scrape-addresses',
        data: { url },
      };
      await this.pubsubService.publishMessage(this.topicName, message);

      return {
        message: 'Scrape addresses task published',
        status: 'processing',
        pollingUrl: `/status/scrape-addresses/${encodeURIComponent(url)}`,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        console.warn('Handled error in scrapeAddresses method:', error.message);
        throw error;
      } else {
        console.error('Unhandled error in scrapeAddresses method:', error);
        throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @SeoAnalysisOperation
  @ScraperQuery
  @ScraperResponse200
  @ScraperResponse400
  @ScraperResponse500
  @Get('seo-analysis')
  async seoAnalysis(@Query('url') url: string) {
    try {
      if (!url) {
        throw new HttpException('URL is required', HttpStatus.BAD_REQUEST);
      }

      const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
      if (!urlPattern.test(url)) {
        throw new HttpException('Invalid URL format', HttpStatus.BAD_REQUEST);
      }

      console.log("Publishing seo-analysis task for url: ", url);
      const message = {
        type: 'seo-analysis',
        data: { url },
      };
      await this.pubsubService.publishMessage(this.topicName, message);

      return {
        message: 'SEO analysis task published',
        status: 'processing',
        pollingUrl: `/status/seo-analysis/${encodeURIComponent(url)}`,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        console.warn('Handled error in seoAnalysis method:', error.message);
        throw error;
      } else {
        console.error('Unhandled error in seoAnalysis method:', error);
        throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @SeoAnalysisOperation
  @ScraperQuery
  @ScraperResponse200
  @ScraperResponse400
  @ScraperResponse500
  @Get('keyword-analysis')
  async keywordAnalysis(@Query('url') url: string, @Query('keyword') keyword: string) {
    try {
      if (!url || !keyword) {
        throw new HttpException('URL and keyword is required', HttpStatus.BAD_REQUEST);
      }

      const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
      if (!urlPattern.test(url)) {
        throw new HttpException('Invalid URL format', HttpStatus.BAD_REQUEST);
      }

      console.log("Publishing keyword analysis task for url: ", url);
      const message = {
        type: 'keyword-analysis',
        data: { url, keyword },
      };
      await this.pubsubService.publishMessage(this.topicName, message);

      return {
        message: 'Keyword analysis task published',
        status: 'processing',
        pollingUrl: `/status/keyword-analysis/${encodeURIComponent(url)}`,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        console.warn('Handled error in keywordAnalysis method:', error.message);
        throw error;
      } else {
        console.error('Unhandled error in keywordAnalysis method:', error);
        throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Get('status')
  @GetJobStatusOperation
  @GetJobStatusResponse200
  @GetJobStatusResponse400
  @GetJobStatusTypeQuery
  @GetJobStatusQuery
  async getJobStatus(@Query('type') type: string, @Query('url') url: string ) {
    console.log(url, type);
    try {
      const acceptedTypes = [
        'scrape', 
        'read-robots', 
        'scrape-metadata',
        'scrape-status',
        'classify-industry',
        'scrape-logo',
        'scrape-images',
        'screenshot',
        'scrape-contact-info',
        'scrape-addresses',
        'seo-analysis',
        'keyword-analysis',
        'scrape-news'
      ];
      if (!acceptedTypes.includes(type)) {
        throw new HttpException('Invalid type', HttpStatus.BAD_REQUEST);
      }

      const cacheKey = `${url}-${type}`;
      const jobData:string = await this.cacheManager.get(cacheKey);
      if (!jobData) {
        return {
          url,
          message: 'Job not found',
          data: null,
        }
      }
      return JSON.parse(jobData);
    } catch (error) {
      if (error instanceof HttpException) {
        console.warn('Handled error in getJobStatus method:', error.message);
        throw error;
      } else {
        console.error('Unhandled error in getJobStatus method:', error);
        throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Get('keyword-status')
  @GetJobStatusOperation
  @GetJobStatusResponse200
  @GetJobStatusResponse400
  @GetJobStatusQuery
  @GetJobStatusKeywordQuery
  async getKeyWordAnalysis(@Query('url') url: string, @Query('keyword') keyword: string) {
      const cacheKey = `${url}-keyword-${keyword}`;
      const jobData:string = await this.cacheManager.get(cacheKey);
      if (!jobData) {
        return {
          url,
          keyword,
          message: 'Job not found',
          data: null,
        }
      }
      return JSON.parse(jobData);
    } catch (error) {
      if (error instanceof HttpException) {
        console.warn('Handled error in getJobStatus method:', error.message);
        throw error;
      } else {
        console.error('Unhandled error in getJobStatus method:', error);
        throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }


@NewsOperation
@ScraperQuery
@ScraperResponse200
@ScraperResponse400
@ScraperResponse500
@Get('scrape-news')
async scrapeNews(@Query('url') url: string) {
  try {
    if (!url) {
      throw new HttpException('URL is required', HttpStatus.BAD_REQUEST);
    }

    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    if (!urlPattern.test(url)) {
      throw new HttpException('Invalid URL format', HttpStatus.BAD_REQUEST);
    }

    console.log("Publishing scrape-news task for url: ", url);
    const message = {
      type: 'scrape-news',
      data: { url },
    };
    await this.pubsubService.publishMessage(this.topicName, message);

    return {
      message: 'Scrape news task published',
      status: 'processing',
      pollingUrl: `/status/scrape-news/${encodeURIComponent(url)}`,
    };
  } catch (error) {
    if (error instanceof HttpException) {
      console.warn('Handled error in scrapeNews method:', error.message);
      throw error;
    } else {
      console.error('Unhandled error in scrapeNews method:', error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

  }

  
