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

    @ApiOperation({ summary: 'Scrape images from a given URL' })
    @ApiQuery({ name: 'url', description: 'The URL to scrape images from', required: true, type: String })
    @ApiResponse({ status: 200, description: 'Returns an array of image URLs', type: [String] })
    @ApiResponse({ status: 403, description: 'Crawling not allowed or robots.txt not accessible.' })
    @ApiResponse({ status: 500, description: 'Failed to scrape images.' })
    @Get('/scrapeImages')
    async scrapeImages(@Query('url') url: string): Promise<string[]> {
        return this.scrapingService.scrapeImages(url);
    }

    @ApiOperation({ summary: 'Scrape logos from a given URL' })
    @ApiQuery({ name: 'url', description: 'The URL to scrape logos from', required: true, type: String })
    @ApiResponse({ status: 200, description: 'Returns the URL of the logo if found, otherwise null', type: String })
    @ApiResponse({ status: 403, description: 'Crawling not allowed or robots.txt not accessible.' })
    @ApiResponse({ status: 500, description: 'Failed to scrape logos.' })
    @Get('/scrapeLogos')
    async scrapeLogos(@Query('url') url: string): Promise<string | null> { 
        return this.scrapingService.scrapeLogos(url);
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
