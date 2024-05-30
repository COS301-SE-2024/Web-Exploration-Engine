import { Controller, Get, Query, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { IndustryService } from '../industry-classification-app/industry.service';

@ApiTags('Industry')
@Controller('scrapeIndustry')
export class IndustryController {
  constructor(private readonly scrapingService: IndustryService) {}

  @ApiOperation({ summary: 'Scrape metadata from a given URL' })
  @ApiQuery({ name: 'url', required: true, description: 'The URL to scrape metadata from' })
  @ApiResponse({ status: 200, description: 'Metadata successfully scraped' })
  @ApiResponse({ status: 400, description: 'Bad Request. URL is required' })
  @ApiResponse({ status: 500, description: 'Internal Server Error. Cannot scrape this website' })
  @Get()
  async handleScrapeMetadata(@Query('url') url: string, @Res() res: Response) {
    if (!url) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 'URL is required' });
    }

    try {
      const metadata = await this.scrapingService.scrapeMetadata(url);
      res.status(HttpStatus.OK).json(metadata);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Cannot Scrape this Website' });
    }
  }

  @ApiOperation({ summary: 'Check if scraping is allowed for a given URL' })
  @ApiQuery({ name: 'url', required: true, description: 'The URL to check for scraping permission' })
  @ApiResponse({ status: 200, description: 'Scraping permission status' })
  @Get('check-allowed')
  async checkAllowed(@Query('url') url: string): Promise<{ allowed: boolean }> {
    const allowed = await this.scrapingService.checkAllowed(url);
    return { allowed };
  }
}
