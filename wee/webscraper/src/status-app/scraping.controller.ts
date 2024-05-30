import { Controller, Get, Query } from '@nestjs/common';
import { isCrawlingAllowed } from './robot';
import { ScrapingService } from './scraping.service';

/**
 * Controller responsible for handling scraping-related HTTP requests.
 */
@Controller()
export class ScrapingController {
    constructor(private readonly scrapingService: ScrapingService) {}
    /**
     * Checks if crawling is allowed for a given URL.
     * @param url The URL to check.
     */
    @Get('/isCrawlingAllowed')
    async isCrawlingAllowed(@Query('url') url: string): Promise<boolean> {
        return isCrawlingAllowed(url);
    }
    /**
     * Checks the status of a website at a given URL.
     * @param url The URL of the website to check.
     */
    @Get('/status') 
    async checkWebsiteStatus(@Query('url') url: string): Promise<boolean> {
        return this.scrapingService.status(url);
    }
}