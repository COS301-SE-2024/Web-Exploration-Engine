import { Controller, Get, Query, Inject, Param, UseInterceptors } from '@nestjs/common';
import { PubSubService } from './pub-sub/pub_sub.service';
import { ApiTags } from '@nestjs/swagger';
import { Cache } from 'cache-manager';
import {
  ScrapeOperation, RobotsOperation, MetadataOperation, StatusOperation, ClassifyIndustryOperation, ImagesOperation, LogoOperation, ScreenshotOperation, ContactInfoOperation, AddressesOperation, SeoAnalysisOperation,
  ScraperQuery, ScraperResponse200, ScraperResponse400, ScraperResponse500,
  GetJobStatusTypeParam, GetJobStatusUrlParam, GetJobStatusOperation, GetJobStatusResponse200, GetJobStatusResponse400,
} from './scraper.api';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PerformanceInterceptor } from './performance.interceptor';

@ApiTags('Scraping')
@Controller('scraper')
@UseInterceptors(PerformanceInterceptor)
export class ScraperController {
  constructor(
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
    private readonly pubsubService : PubSubService,
  ) {}

  topicName = 'projects/alien-grove-429815-s9/topics/scraping-tasks'

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
        url,
      };
      await this.pubsubService.publishMessage(this.topicName, message);

      return {
        message: 'Scraping task published',
        status: 'processing',
        pollingUrl: `/status/scrape/${encodeURIComponent(url)}`,
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
        url,
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
        url,
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
        url,
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
        url,
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
        url,
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
        url,
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
        url,
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
        url,
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
        url,
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
        url,
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

  @Get('status/:type/:url')
  @GetJobStatusOperation
  @GetJobStatusResponse200
  @GetJobStatusResponse400
  @GetJobStatusTypeParam
  @GetJobStatusUrlParam
  async getJobStatus(@Param('type') type: string, @Param('url') url: string ) {
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
}
// import { Controller, Get, Query } from '@nestjs/common';
// import { ScraperService } from './scraper.service';
// import { ApiTags } from '@nestjs/swagger';
// import { Metadata } from './models/ServiceModels';
// import {
//   ScrapeOperation, ScrapeQuery, ScrapeResponse200, ScrapeResponse400, ScrapeResponse500,
//   ReadRobotsOperation, ReadRobotsQuery, ReadRobotsResponse200, ReadRobotsResponse400, ReadRobotsResponse500,
//   ScrapeMetadataOperation, ScrapeMetadataQuery, ScrapeMetadataResponse200, ScrapeMetadataResponse400, ScrapeMetadataResponse500,
//   ScrapeStatusOperation, ScrapeStatusQuery, ScrapeStatusResponse200,
//   ClassifyIndustryOperation, ClassifyIndustryQuery, ClassifyIndustryResponse200,
//   ScrapeImagesOperation, ScrapeImagesQuery, ScrapeImagesResponse200, ScrapeImagesResponse400,
//   ScrapeLogoOperation, ScrapeLogoQuery, ScrapeLogoResponse200, ScrapeLogoResponse400,
//   ScreenshotOperation, ScreenshotQuery, ScreenshotResponse200, ScreenshotResponse400, ScreenshotResponse500,
//   ScrapeContactInfoOperation, ScrapeContactInfoQuery, ScrapeContactInfoResponse200, ScrapeContactInfoResponse400, ScrapeContactInfoResponse500,
//   ScrapeAddressesOperation, ScrapeAddressesQuery, ScrapeAddressesResponse200, ScrapeAddressesResponse400, ScrapeAddressesResponse500,
//   SeoAnalysisOperation, SeoAnalysisQuery, SeoAnalysisResponse200, SeoAnalysisResponse400, SeoAnalysisResponse500,
// } from './scraper.api';
// import { StringDecoder } from 'string_decoder';

// @ApiTags('Scraping')
// @Controller('scraper')
// export class ScraperController {
//   constructor(
//     private readonly scraperService: ScraperService,
//   ) {}

//   /*
//     This is the endpoint that will be used through the frontend to scrape the website
//     Right now it only takes in a URL through a get request - but in future it will take
//     in the URL and the customised scraping options
//   */
//   @ScrapeOperation
//   @ScrapeQuery
//   @ScrapeResponse200
//   @ScrapeResponse400
//   @ScrapeResponse500
//   @Get()
//   async scrape(@Query('url') url: string) {
//     return this.scraperService.scrape(url);
//   }

//   @ReadRobotsOperation
//   @ReadRobotsQuery
//   @ReadRobotsResponse200
//   @ReadRobotsResponse400
//   @ReadRobotsResponse500
//   @Get('read-robots')
//   async readRobotsFile(@Query('url') url: string) {
//     return this.scraperService.readRobotsFile(url);
//   }

//   @ScrapeMetadataOperation
//   @ScrapeMetadataQuery
//   @ScrapeMetadataResponse200
//   @ScrapeMetadataResponse400
//   @ScrapeMetadataResponse500
//   @Get('scrape-metadata')
//   async scrapeMetadata(@Query('url') url: string) {
//     return this.scraperService.scrapeMetadata(url);
//   }

//   @ScrapeStatusOperation
//   @ScrapeStatusQuery
//   @ScrapeStatusResponse200
//   @Get('scrape-status')
//   async scrapeStatus(@Query('url') url: string) {
//     return this.scraperService.scrapeStatus(url);
//   }

//   @ClassifyIndustryOperation
//   @ClassifyIndustryQuery
//   @ClassifyIndustryResponse200
//   @Get('classify-industry')
//   async classifyIndustry(@Query('url') url: string) {
//     return this.scraperService.classifyIndustry(url);
//   }

//   @ScrapeImagesOperation
//   @ScrapeImagesQuery
//   @ScrapeImagesResponse200
//   @ScrapeImagesResponse400
//   @Get('scrape-images')
//   async scrapeImages(@Query('url') url: string) {
//     return this.scraperService.scrapeImages(url);
//   }

//   @ScrapeLogoOperation
//   @ScrapeLogoQuery
//   @ScrapeLogoResponse200
//   @ScrapeLogoResponse400
//   @Get('scrape-logo')
//   async scrapeLogo(@Query('url') url: string) {
//     return this.scraperService.scrapeLogo(url);
//   }

//   @ScreenshotOperation
//   @ScreenshotQuery
//   @ScreenshotResponse200
//   @ScreenshotResponse400
//   @ScreenshotResponse500
//   @Get('screenshot')
//   async getScreenshot(@Query('url') url: string) {
//     return this.scraperService.getScreenshot(url);
//   }


//   @ScrapeContactInfoOperation
//   @ScrapeContactInfoQuery
//   @ScrapeContactInfoResponse200
//   @ScrapeContactInfoResponse400
//   @ScrapeContactInfoResponse500
//   @Get('scrape-contact-info')
//   async scrapeContactInfo(@Query('url') url: string) {
//     return this.scraperService.scrapeContactInfo(url);
//   }

//   @ScrapeAddressesOperation
//   @ScrapeAddressesQuery
//   @ScrapeAddressesResponse200
//   @ScrapeAddressesResponse400
//   @ScrapeAddressesResponse500
//   @Get('scrape-addresses')
//   async scrapeAddresses(@Query('url') url: string) {
//     return this.scraperService.scrapeAddress(url);
//   }

//   @SeoAnalysisOperation
//   @SeoAnalysisQuery
//   @SeoAnalysisResponse200
//   @SeoAnalysisResponse400
//   @SeoAnalysisResponse500
//   @Get('seo-analysis')
//   async seoAnalysis(@Query('url') url: string) {
//     return this.scraperService.seoAnalysis(url);
//   }

// }
