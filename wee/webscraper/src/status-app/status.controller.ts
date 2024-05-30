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

    @ApiOperation({ summary: 'Check if crawling is allowed for a given URL' })
    @ApiQuery({ name: 'url', description: 'The URL to check crawling permissions for', required: true, type: String })
    @ApiResponse({ status: 200, description: 'Returns true if crawling is allowed, otherwise false.', type: Boolean })
    @ApiResponse({ status: 403, description: 'Crawling not allowed or robots.txt not accessible.' })
    @Get('/isCrawlingAllowed')
    async isCrawlingAllowed(@Query('url') url: string): Promise<boolean> {
        return isCrawlingAllowed(url);
    }

    @ApiOperation({ summary: 'Check the status of a website at a given URL' })
    @ApiQuery({ name: 'url', description: 'The URL of the website to check', required: true, type: String })
    @ApiResponse({ status: 200, description: 'Returns true if the website is reachable and status is 2xx, otherwise false.', type: Boolean })
    @ApiResponse({ status: 500, description: 'Failed to check the website status.' })
    @Get('/status')
    async checkWebsiteStatus(@Query('url') url: string): Promise<boolean> {
        return this.scrapingService.status(url);
    }
}
