import { Controller, Get, Query } from '@nestjs/common';
import { RobotsService } from './robots.service';

@Controller('robots')
export class RobotsController {
  constructor(private readonly robotsService: RobotsService) {}

  @Get('allowed-paths')
  async getAllowedPaths(@Query('url') url: string) {
    if (!url) {
      return { error: 'URL parameter is required' };
    }
    try {
      const allowedPaths = await this.robotsService.getAllowedPaths(url);
      return { allowedPaths: Array.from(allowedPaths) };
    } catch (error) {
      return { error: 'An error occurred while fetching allowed paths' };
    }
  }
}
