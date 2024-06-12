import { Injectable } from '@nestjs/common';

// Services
import { RobotsService } from './robots/robots.service';


@Injectable()
export class ScraperService {
  constructor(
    private readonly robotsService: RobotsService,
  ) {}

  async scrape(url: string) {
    // check if scraping is allowed
    const allowedToScrape = await this.robotsService.getAllowedPaths(url);
    
    return allowedToScrape;
  }
}
