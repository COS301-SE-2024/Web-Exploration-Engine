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

    @Get('/status') 
    async checkWebsiteStatus(@Query('url') url: string): Promise<boolean> {
        return this.scrapingService.status(url);
    }
}