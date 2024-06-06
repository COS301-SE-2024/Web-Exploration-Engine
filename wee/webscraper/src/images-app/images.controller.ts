import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { isCrawlingAllowed } from './robot';
import { ImagesService } from './images.service';

@ApiTags('Images')
@Controller()
export class ImagesController {
    constructor(private readonly scrapingService: ImagesService) {}

    @ApiOperation({ summary: 'Check if crawling is allowed for a given URL' })
    @ApiQuery({ name: 'url', description: 'The URL to check crawling permissions for', required: true, type: String })
    @ApiResponse({ status: 200, description: 'Returns true if crawling is allowed, otherwise false.' })
    @ApiResponse({ status: 403, description: 'Crawling not allowed or robots.txt not accessible.' })
    @Get('/isCrawlingAllowed')
    async isCrawlingAllowed(@Query('url') url: string): Promise<boolean> {
        return isCrawlingAllowed(url);
    }

    @ApiOperation({ summary: 'Scrape images from multiple URLs' })
    @ApiQuery({ name: 'urls', description: 'Comma-separated list of URLs to scrape images from', required: true, type: String })
    @ApiResponse({ status: 200, description: 'Returns an object containing image URLs for each URL', type: Object })
    @ApiResponse({ status: 500, description: 'Failed to scrape images from one or more URLs' })
    @Get('/scrapeImages')
    async scrapeImages(@Query('urls') urls: string): Promise<any> {
        const urlsArray = urls.split(',');
        const results = {};

        for (const url of urlsArray) {
            try {
                const images = await this.scrapingService.scrapeImages(url);
                results[url] = images;
            } catch (error) {
                results[url] = `Error: ${error.message}`;
            }
        }

        return results;
    }

    @ApiOperation({ summary: 'Scrape logos from multiple URLs' })
    @ApiQuery({ name: 'urls', description: 'Comma-separated list of URLs to scrape logos from', required: true, type: String })
    @ApiResponse({ status: 200, description: 'Returns an object containing logo URLs for each URL', type: Object })
    @ApiResponse({ status: 500, description: 'Failed to scrape logos from one or more URLs' })
    @Get('/scrapeLogos')
    async scrapeLogos(@Query('urls') urls: string): Promise<any> {
        const urlsArray = urls.split(',');
        const results = {};

        for (const url of urlsArray) {
            try {
                const logo = await this.scrapingService.scrapeLogos(url);
                results[url] = logo;
            } catch (error) {
                results[url] = `Error: ${error.message}`;
            }
        }

        return results;
    }

    @ApiOperation({ summary: 'Scrape metadata from a given URL' })
    @ApiQuery({ name: 'url', description: 'The URL to scrape metadata from', required: true, type: String })
    @ApiResponse({ status: 200, description: 'Returns an object containing the scraped metadata', type: Object })
    @ApiResponse({ status: 403, description: 'Crawling not allowed or robots.txt not accessible.' })
    @ApiResponse({ status: 500, description: 'Failed to scrape metadata.' })
    @Get('/scrape-metadata')
    async scrapeMetadata(@Query('url') url: string): Promise<any> {
        return this.scrapingService.scrapeMetadata(url);
    }
}
