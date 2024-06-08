import { Controller, Get, Query, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { IndustryService } from '../industry-classification-app/industry.service';

@ApiTags('Industry')
@Controller('scrapeIndustry')
export class IndustryController {
  constructor(private readonly scrapingService: IndustryService) {}

  @ApiOperation({ summary: 'Scrape metadata from given URLs' })
  @ApiQuery({ name: 'urls', required: true, description: 'Comma-separated list of URLs to scrape metadata from' })
  @ApiResponse({ status: 200, description: 'Metadata successfully scraped' })
  @ApiResponse({ status: 400, description: 'Bad Request. URLs are required' })
  @ApiResponse({ status: 500, description: 'Internal Server Error. Cannot scrape one or more websites' })
  @Get()
  async handleScrapeMetadata(@Query('urls') urls: string, @Res() res: Response) {
    if (!urls) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 'URLs are required' });
    }

    const urlList = urls.split(',');

    try {
      const results = await Promise.all(
        urlList.map(async (url) => {
          try {
            const metadata = await this.scrapingService.scrapeMetadata(url.trim());
            return { url, metadata, error: null };
          } catch (error) {
            return { url, metadata: null, error: 'Cannot scrape this website' };
          }
        })
      );

      res.status(HttpStatus.OK).json(results);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'An unexpected error occurred' });
    }
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
