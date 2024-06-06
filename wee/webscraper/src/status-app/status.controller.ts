import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { isCrawlingAllowed } from './robot';
import { StatusService } from './status.service';

/**
 * Controller responsible for handling scraping-related HTTP requests.
 */
@ApiTags('Status')
@Controller()
export class StatusController {
    constructor(private readonly scrapingService: StatusService) {}

    @ApiOperation({ summary: 'Check if crawling is allowed for given URLs' })
    @ApiQuery({ name: 'urls', description: 'The URLs to check crawling permissions for', required: true, type: [String] })
    @ApiResponse({ status: 200, description: 'Returns an array of booleans indicating if crawling is allowed for each URL.', type: [Boolean] })
    @ApiResponse({ status: 403, description: 'Crawling not allowed or robots.txt not accessible.' })
    @Get('/isCrawlingAllowed')
    async isCrawlingAllowed(@Query('urls') urls: string[]): Promise<boolean[]> {
        const crawlingPromises = urls.map(url => isCrawlingAllowed(url));
        return Promise.all(crawlingPromises);
    }

    @ApiOperation({ summary: 'Check the status of websites at given URLs' })
    @ApiQuery({ name: 'urls', description: 'The URLs of the websites to check', required: true, type: [String] })
    @ApiResponse({ status: 200, description: 'Returns an array of booleans indicating if each website is reachable and status is 2xx.', type: [Boolean] })
    @ApiResponse({ status: 500, description: 'Failed to check the website status.' })
    @Get('/status')
    async checkWebsiteStatus(@Query('urls') urls: string[]): Promise<boolean[]> {
        const statusPromises = urls.map(url => this.scrapingService.status(url));
        return Promise.all(statusPromises);
    }
}
