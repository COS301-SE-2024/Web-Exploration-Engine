import { Controller, Get, Query } from '@nestjs/common';
import { isCrawlingAllowed } from './robot';
import { ImagesService } from './scraping.service';
/**
 * Controller to handle web scraping related endpoints
 */
@Controller()
export class ImagesController {
    constructor(private readonly scrapingService: ImagesService) {}
    /**
     * To check if crawling is allowed for a given URL.
     * @param url - The URL to check for crawling permission.
     */
    @Get('/isCrawlingAllowed')
    async isCrawlingAllowed(@Query('url') url: string): Promise<boolean> {
        return isCrawlingAllowed(url);
    }
    /**
     * to scrape images from a given URL.
     * @param url - The URL to scrape images from.
     */
    @Get('/scrapeImages')
    async scrapeImages(@Query('url') url: string): Promise<string[]> {
        return this.scrapingService.scrapeImages(url);
    }
    /**
     * To scrape logos from a given URL.
     * @param url - The URL to scrape logos from.
     */
    @Get('/scrapeLogos')
    async scrapeLogos(@Query('url') url: string): Promise<string> { 
        return this.scrapingService.scrapeLogos(url);
    }
     /**
     * To scrape metadata from a given URL.
     * @param  url - The URL to scrape metadata from.
     */
    @Get('/scrape-metadata')
    async scrapeMetadata(@Query('url') url: string): Promise<any> {
        return this.scrapingService.scrapeMetadata(url);
    }
}