import { Controller, Get, Query } from '@nestjs/common';
import { RobotsService } from './robots.service';

@Controller('robots')
export class RobotsController {
  constructor(private readonly robotsService: RobotsService) {}

  @Get('allowed-paths')
  async getAllowedPaths(@Query('url') url: string) {
    return this.robotsService.getAllowedPaths(url);
  }
}
