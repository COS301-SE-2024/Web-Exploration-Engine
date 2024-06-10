import { Controller, Get, Query, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { IndustryService } from '../industry-classification-app/industry.service';

@ApiTags('Industry')
@Controller('scrapeIndustry')
export class IndustryController {
  constructor(private readonly scrapingService: IndustryService) {}

  @ApiOperation({ summary: 'Scrape metadata from given URLs' })
  @ApiQuery({ name: 'urls', required: true, description: 'Comma-separated URLs to scrape metadata from' })
  @ApiResponse({ status: 200, description: 'Metadata successfully scraped' })
  @ApiResponse({ status: 400, description: 'Bad Request. URLs are required' })
  @ApiResponse({ status: 500, description: 'Internal Server Error. Cannot scrape one or more websites' })
  @Get()
  async handleScrapeMetadata(@Query('urls') urls: string, @Res() res: Response) {
    if (!urls) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 'URLs are required' });
    }

    const urlArray = urls.split(',').map(url => url.trim());
    const metadataResults = [];

    for (const url of urlArray) {
      try {
        const metadata = await this.scrapingService.scrapeMetadata(url);
        metadataResults.push({ url, success: true, metadata });
      } catch (error) {
        metadataResults.push({ url, success: false, error: 'Cannot scrape this website' });
      }
    }

    res.status(HttpStatus.OK).json(metadataResults);
  }

  @ApiOperation({ summary: 'Check if scraping is allowed for a given URL' })
  @ApiQuery({ name: 'url', required: true, description: 'The URL to check for scraping permission' })
  @ApiResponse({ status: 200, description: 'Scraping permission status' })
  @Get('check-allowed')
  async checkAllowed(@Query('url') url: string): Promise<{ allowed: boolean }> {
    const allowed = await IndustryService.checkAllowed(url); 
    return { allowed };
  }
}
