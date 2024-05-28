import { Controller, Get, Query } from '@nestjs/common';
import { isCrawlingAllowed } from './robot';
import { ScrapingService } from './scraping.service';

@Controller()
export class ScrapingController {
    constructor(private readonly scrapingService: ScrapingService) {}

    @Get('/isCrawlingAllowed')
    async isCrawlingAllowed(@Query('url') url: string): Promise<boolean> {
        return isCrawlingAllowed(url);
    }

    @Get('/scrapeImages')
    async scrapeImages(@Query('url') url: string): Promise<string[]> {
        return this.scrapingService.scrapeImages(url);
    }

    @Get('/scrapeLogos')
    async scrapeLogos(@Query('url') url: string): Promise<string> { 
        return this.scrapingService.scrapeLogos(url);
    }

    @Get('/scrape-metadata')
    async scrapeMetadata(@Query('url') url: string): Promise<any> {
        return this.scrapingService.scrapeMetadata(url);
    }
}