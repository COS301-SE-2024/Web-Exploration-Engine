import { Controller, Get, Query } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { ApiTags } from '@nestjs/swagger';
import { Metadata } from './models/ServiceModels';
import {
  ScrapeOperation, ScrapeQuery, ScrapeResponse200, ScrapeResponse400, ScrapeResponse500,
  ReadRobotsOperation, ReadRobotsQuery, ReadRobotsResponse200, ReadRobotsResponse400, ReadRobotsResponse500,
  ScrapeMetadataOperation, ScrapeMetadataQuery, ScrapeMetadataResponse200, ScrapeMetadataResponse400, ScrapeMetadataResponse500,
  ScrapeStatusOperation, ScrapeStatusQuery, ScrapeStatusResponse200,
  ClassifyIndustryOperation, ClassifyIndustryQuery, ClassifyIndustryResponse200,
  ScrapeImagesOperation, ScrapeImagesQuery, ScrapeImagesResponse200, ScrapeImagesResponse400,
  ScrapeLogoOperation, ScrapeLogoQuery, ScrapeLogoResponse200, ScrapeLogoResponse400,
  ScreenshotOperation, ScreenshotQuery, ScreenshotResponse200, ScreenshotResponse400, ScreenshotResponse500,
} from './scraper.api';
import { StringDecoder } from 'string_decoder';

@ApiTags('Scraping')
@Controller('scraper')
export class ScraperController {
  constructor(
    private readonly scraperService: ScraperService,
  ) {}

  /*
    This is the endpoint that will be used through the frontend to scrape the website
    Right now it only takes in a URL through a get request - but in future it will take
    in the URL and the customised scraping options
  */
  @ScrapeOperation
  @ScrapeQuery
  @ScrapeResponse200
  @ScrapeResponse400
  @ScrapeResponse500
  @Get()
  async scrape(@Query('url') url: string) {
    return this.scraperService.scrape(url);
  }

  @ReadRobotsOperation
  @ReadRobotsQuery
  @ReadRobotsResponse200
  @ReadRobotsResponse400
  @ReadRobotsResponse500
  @Get('read-robots')
  async readRobotsFile(@Query('url') url: string) {
    return this.scraperService.readRobotsFile(url);
  }

  @ScrapeMetadataOperation
  @ScrapeMetadataQuery
  @ScrapeMetadataResponse200
  @ScrapeMetadataResponse400
  @ScrapeMetadataResponse500
  @Get('scrape-metadata')
  async scrapeMetadata(@Query('url') url: string) {
    return this.scraperService.scrapeMetadata(url);
  }

  @ScrapeStatusOperation
  @ScrapeStatusQuery
  @ScrapeStatusResponse200
  @Get('scrape-status')
  async scrapeStatus(@Query('url') url: string) {
    return this.scraperService.scrapeStatus(url);
  }

  @ClassifyIndustryOperation
  @ClassifyIndustryQuery
  @ClassifyIndustryResponse200
  @Get('classify-industry')
  async classifyIndustry(@Query('url') url: string) {
    return this.scraperService.classifyIndustry(url);
  }

  @ScrapeImagesOperation
  @ScrapeImagesQuery
  @ScrapeImagesResponse200
  @ScrapeImagesResponse400
  @Get('scrape-images')
  async scrapeImages(@Query('url') url: string) {
    return this.scraperService.scrapeImages(url);
  }

  @ScrapeLogoOperation
  @ScrapeLogoQuery
  @ScrapeLogoResponse200
  @ScrapeLogoResponse400
  @Get('scrape-logo')
  async scrapeLogo(@Query('url') url: string) {
    return this.scraperService.scrapeLogo(url);
  }

  @ScreenshotOperation
  @ScreenshotQuery
  @ScreenshotResponse200
  @ScreenshotResponse400
  @ScreenshotResponse500
  @Get('screenshot')
  async getScreenshot(@Query('url') url: string) {
    return this.scraperService.getScreenshot(url);
  }


}
