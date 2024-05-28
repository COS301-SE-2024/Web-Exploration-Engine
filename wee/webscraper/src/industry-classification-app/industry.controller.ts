import { Controller, Get, Query, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ScrapingService } from '../industry-classification-app/industry.service';

@Controller('scrapeIndustry')
export class ScrapingController {
  constructor(private readonly scrapingService: ScrapingService) {}

  @Get()
  async handleScrapeMetadata(@Query('url') url: string, @Res() res: Response) {
    if (!url) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 'URL is required' });
    }

    try {
      const metadata = await this.scrapingService.scrapeMetadata(url);
      res.status(HttpStatus.OK).json(metadata);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Error scraping metadata' });
    }
  }
}
