import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { SloganService } from './slogan.service';

@ApiTags('Slogan')
@Controller('scrapeSlogans')
export class SloganController {
    constructor(private readonly sloganService: SloganService) {}

    @ApiOperation({ summary: 'Scrape slogans from multiple URLs' })
    @ApiQuery({ name: 'urls', description: 'Comma-separated list of URLs to scrape slogans from', required: true, type: String })
    @ApiResponse({ status: 200, description: 'Returns an object containing slogans for each URL', type: Object })
    @ApiResponse({ status: 500, description: 'Failed to scrape slogans from one or more URLs' })
    @Get()
    async scrapeSlogans(@Query('urls') urls: string): Promise<any> {
        const urlsArray = urls.split(',');
        const results = {};

        for (const url of urlsArray) {
            try {
                const slogans = await this.sloganService.scrapeSlogans(url);
                results[url] = slogans;
            } catch (error) {
                results[url] = `Error: ${error.message}`;
            }
        }

        return results;
    }
}
