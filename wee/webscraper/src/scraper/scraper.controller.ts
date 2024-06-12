import { Controller, Get, Query } from '@nestjs/common';
import { ScraperService } from './scraper.service';

// Services
import { RobotsService } from './robots/robots.service';

@Controller('scraper')
export class ScraperController {
  constructor(
    private readonly scraperService: ScraperService,
    private readonly robotsService: RobotsService,
  ) {}

  /*  
    This is the endpoint that will be used through the frontend to scrape the website 
    Right now it only takes in a URL through a get request - but in future it will take 
    in the URL and the customised scraping options
  */

  @Get()
  async scrape(@Query('url') url: string) {
    return this.scraperService.scrape(url);
  }

  @Get('allowed-paths')
  async getAllowedPaths(@Query('url') url: string) {
    return this.robotsService.getAllowedPaths(url);
  }
}
