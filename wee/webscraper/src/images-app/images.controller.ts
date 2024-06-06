import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { isCrawlingAllowed } from './robot';
import { ImagesService } from './images.service';

@ApiTags('Images')
@Controller()
export class ImagesController {
    constructor(private readonly scrapingService: ImagesService) {}

    @ApiOperation({ summary: 'Check if crawling is allowed for given URLs' })
    @ApiQuery({ name: 'urls', description: 'The URLs to check crawling permissions for', required: true, type: [String] })
    @ApiResponse({ status: 200, description: 'Returns an array of booleans indicating if crawling is allowed for each URL.' })
    @ApiResponse({ status: 403, description: 'Crawling not allowed or robots.txt not accessible.' })
    @Get('/isCrawlingAllowed')
    async isCrawlingAllowed(@Query('urls') urls: string[]): Promise<boolean[]> {
        const results = await Promise.all(urls.map(url => isCrawlingAllowed(url)));
        return results;
    }

    @ApiOperation({ summary: 'Scrape images from given URLs' })
    @ApiQuery({ name: 'urls', description: 'The URLs to scrape images from', required: true, type: [String] })
    @ApiResponse({ status: 200, description: 'Returns an array of arrays of image URLs', type: [String] })
    @ApiResponse({ status: 403, description: 'Crawling not allowed or robots.txt not accessible.' })
    @ApiResponse({ status: 500, description: 'Failed to scrape images.' })
    @Get('/scrapeImages')
    async scrapeImages(@Query('urls') urls: string[]): Promise<string[][]> {
        const results = await Promise.all(urls.map(url => this.scrapingService.scrapeImages(url)));
        return results;
    }

    @ApiOperation({ summary: 'Scrape logos from given URLs' })
    @ApiQuery({ name: 'urls', description: 'The URLs to scrape logos from', required: true, type: [String] })
    @ApiResponse({ status: 200, description: 'Returns an array of logo URLs or null if no logo is found', type: [String] })
    @ApiResponse({ status: 403, description: 'Crawling not allowed or robots.txt not accessible.' })
    @ApiResponse({ status: 500, description: 'Failed to scrape logos.' })
    @Get('/scrapeLogos')
    async scrapeLogos(@Query('urls') urls: string[]): Promise<(string | null)[]> {
        const results = await Promise.all(urls.map(url => this.scrapingService.scrapeLogos(url)));
        return results;
    }

    @ApiOperation({ summary: 'Scrape metadata from given URLs' })
    @ApiQuery({ name: 'urls', description: 'The URLs to scrape metadata from', required: true, type: [String] })
    @ApiResponse({ status: 200, description: 'Returns an array of objects containing the scraped metadata', type: [Object] })
    @ApiResponse({ status: 403, description: 'Crawling not allowed or robots.txt not accessible.' })
    @ApiResponse({ status: 500, description: 'Failed to scrape metadata.' })
    @Get('/scrapeMetadata')
    async scrapeMetadata(@Query('urls') urls: string[]): Promise<any[]> {
        const results = await Promise.all(urls.map(url => this.scrapingService.scrapeMetadata(url)));
        return results;
    }
}
