import { Controller, Get, Query } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import {
  ScrapeOperation,
  ScrapeQuery,
  ScrapeResponse200,
  ScrapeResponse400,
  ScrapeResponse500,
  ReadRobotsOperation,
  ReadRobotsQuery,
  ReadRobotsResponse200,
  ReadRobotsResponse400,
  ReadRobotsResponse500,
  ScrapeMetadataOperation,
  ScrapeMetadataQuery,
  ScrapeMetadataResponse200,
  ScrapeMetadataResponse400,
  ScrapeMetadataResponse500,
} from './scraper.api';

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

}
