import { Controller, Get, Query, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { IndustryService } from '../industry-classification-app/industry.service';
import axios from 'axios';

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

  @Get('percentages')
  @ApiOperation({ summary: 'Calculate percentage of each industry from given URLs' })
  @ApiQuery({ name: 'urls', required: true, description: 'Comma-separated URLs to scrape metadata from' })
  @ApiResponse({ status: 200, description: 'Industry percentages calculated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request. URLs are required' })
  @ApiResponse({ status: 500, description: 'Internal Server Error. Cannot calculate industry percentages' })
  async getPercentage(@Query('urls') urls: string, @Res() res: Response) {
    if (!urls) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 'URLs are required' });
    }
    try {
      const { industryPercentages } = await this.scrapingService.calculateIndustryPercentages(urls);
      res.status(HttpStatus.OK).json({ industryPercentages });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Error calculating industry percentages' });
    }
  }

  @Get('domain-match')
  @ApiOperation({ summary: 'Classify industry based on the URL' })
  @ApiQuery({ name: 'url', required: true, description: 'The URL to classify the industry for' })
  @ApiResponse({ status: 200, description: 'Industry classified successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request. URL is required' })
  @ApiResponse({ status: 500, description: 'Internal Server Error. Cannot classify the industry' })
  async domainMatch(@Query('url') url: string, @Res() res: Response) {
    if (!url) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 'URL is required' });
    }
    try {
      const industry = await this.scrapingService.domainMatch(url);
      res.status(HttpStatus.OK).json({ url, industry });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Error classifying the industry' });
    }
  }
  @Get('compare')
  @ApiOperation({ summary: 'Compare industry classifications from scrapeMetadata and domainMatch' })
  @ApiQuery({ name: 'urls', required: true, description: 'Comma-separated URLs to compare industry classifications for' })
  @ApiResponse({ status: 200, description: 'Comparison result' })
  @ApiResponse({ status: 400, description: 'Bad Request. URLs are required' })
  @ApiResponse({ status: 500, description: 'Internal Server Error. Cannot compare industry classifications' })
  async compareIndustries(@Query('urls') urls: string, @Res() res: Response) {
    if (!urls) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 'URLs are required' });
    }
    try {
      const comparison = await this.scrapingService.compareIndustries(urls);
      res.status(HttpStatus.OK).json(comparison);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Error comparing industry classifications' });
    }
  }

  @Get('domain-percentage-match')
  @ApiOperation({ summary: 'Count the number of true domain matches from given URLs' })
  @ApiQuery({ name: 'urls', required: true, description: 'Comma-separated URLs to compare industry classifications for' })
  @ApiResponse({ status: 200, description: 'Count of true domain matches' })
  @ApiResponse({ status: 400, description: 'Bad Request. URLs are required' })
  @ApiResponse({ status: 500, description: 'Internal Server Error. Cannot count true domain matches' })
  async countTrueDomainMatches(@Query('urls') urls: string, @Res() res: Response) {
    if (!urls) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 'URLs are required' });
    }
    try {
      const percentage = await this.scrapingService.countTrueDomainMatches(urls);
      res.status(HttpStatus.OK).json({ percentage });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Error calculating true domain match percentage' });
    }
  }
}
