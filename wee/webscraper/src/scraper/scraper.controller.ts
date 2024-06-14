import { Controller, Get, Query } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

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
  @ApiOperation({ summary: 'Scrape a website' })
  @ApiQuery({ name: 'url', required: true, description: 'The URL to scrape' })
  @ApiResponse({ status: 200, description: 'Website successfully scraped' })
  @ApiResponse({ status: 400, description: 'Bad Request. URL parameter is required' })
  @ApiResponse({ status: 500, description: 'Internal Server Error. An error occurred while scraping the website' })
  @Get()
  async scrape(@Query('url') url: string) {
    return this.scraperService.scrape(url);
  }

  @ApiOperation({ summary: 'Get allowed paths from robots.txt of a given URL' })
  @ApiQuery({ name: 'url', required: true, description: 'The URL to check for allowed paths in robots.txt' })
  @ApiResponse({ 
    status: 200, 
    description: 'Allowed paths successfully retrieved', 
    schema: { 
      example: { 
        allowedPaths: ['/path1', '/path2'],
        disallowedPaths: ['/path3', '/path4'],
      } 
    } 
  })
  @ApiResponse({ status: 400, description: 'Bad Request. URL parameter is required' })
  @ApiResponse({ status: 500, description: 'Internal Server Error. Website does not have robots.txt file' })
  @Get('allowed-paths')
  async getAllowedPaths(@Query('url') url: string) {
    return this.scraperService.getAllowedPaths(url);
  }
  @ApiOperation({ summary: 'Extract domain from a given URL' })
  @ApiQuery({ name: 'url', required: true, description: 'The URL to extract domain from' })
  @ApiResponse({ status: 200, description: 'Domain successfully extracted' })
  @ApiResponse({ status: 400, description: 'Bad Request. URL parameter is required' })
  @ApiResponse({ status: 500, description: 'Internal Server Error. An error occurred while extracting domain' })
  @Get('extract-domain')
  async extractDomain(@Query('url') url: string) {
    return this.scraperService.extractDomain(url);
  }

  @ApiOperation({ summary: 'Read robots.txt file of a given URL' })
  @ApiQuery({ name: 'url', required: true, description: 'The URL to read robots.txt file from' })
  @ApiResponse({ 
    status: 200, 
    description: 'Robots.txt file successfully read', 
    schema: { 
      example: { 
        baseUrl: 'https://example.com',
        allowedPaths: ['/path1', '/path2'],
        disallowedPaths: ['/path3', '/path4'],
        isBaseUrlAllowed: true,
      } 
    } 
  })
  @ApiResponse({ status: 400, description: 'Bad Request. URL parameter is required' })
  @ApiResponse({ status: 500, description: 'Internal Server Error. An error occurred while reading robots.txt file' })
  @Get('read-robots')
  async readRobotsFile(@Query('url') url: string) {
    return this.scraperService.readRobotsFile(url);
  }
  

}
