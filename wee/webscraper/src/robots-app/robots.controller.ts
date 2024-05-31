import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { RobotsService } from './robots.service';

@ApiTags('Robots')
@Controller('robots')
export class RobotsController {
  constructor(private readonly robotsService: RobotsService) {}

  @ApiOperation({ summary: 'Get allowed paths from robots.txt of a given URL' })
  @ApiQuery({ name: 'url', required: true, description: 'The URL to check for allowed paths in robots.txt' })
  @ApiResponse({ status: 200, description: 'Allowed paths successfully retrieved', schema: { example: { allowedPaths: ['/path1', '/path2'] } } })
  @ApiResponse({ status: 400, description: 'Bad Request. URL parameter is required' })
  @ApiResponse({ status: 500, description: 'Internal Server Error. Website does not have robots.txt file' })
  @Get('allowed-paths')
  async getAllowedPaths(@Query('url') url: string) {
    if (!url) {
      return { error: 'URL parameter is required' };
    }
    try {
      const allowedPaths = await this.robotsService.getAllowedPaths(url);
      return { allowedPaths: Array.from(allowedPaths) };
    } catch (error) {
      return { error: 'Website does not have robots.txt file, it cannot be scraped' };
    }
  }
}
