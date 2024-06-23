import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { StatusService } from './status.service';

/**
 * Controller responsible for handling status-related HTTP requests.
 */
@ApiTags('Status')
@Controller()
export class StatusController {
    constructor(private readonly statusService: StatusService) {}

    @ApiOperation({ summary: 'Check the status of websites at given URLs' })
    @ApiQuery({ name: 'urls', description: 'Comma-separated list of URLs of the websites to check', required: true, type: String })
    @ApiResponse({ status: 200, description: 'Returns an array of booleans indicating if each website is reachable and status is 2xx.', type: [Boolean] })
    @ApiResponse({ status: 500, description: 'Failed to check the website status.' })
    @Get('/status')
    async checkWebsiteStatus(@Query('urls') urls: string): Promise<boolean[]> {
        const urlsArray = urls.split(',');
        const statusPromises = urlsArray.map(url => this.statusService.status(url));
        return Promise.all(statusPromises);
    }

    @ApiOperation({ summary: 'Get the percentage of live and parked websites at given URLs' })
    @ApiQuery({ name: 'urls', description: 'Comma-separated list of URLs of the websites to check', required: true, type: String })
    @ApiResponse({ status: 200, description: 'Returns the percentage of live and parked websites.', type: Object })
    @ApiResponse({ status: 500, description: 'Failed to calculate the website percentages.' })
    @Get('/status/summary')
    async getWebsiteStatusPercentages(@Query('urls') urls: string): Promise<{ live: number; parked: number }> {
        const urlsArray = urls.split(',');
        return this.statusService.calculateSummary(urlsArray);
    }
}
