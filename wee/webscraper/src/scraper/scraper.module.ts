// src/scraper/scraper.module.ts
import { Module } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { ScraperController } from './scraper.controller';

// Services
import { RobotsService } from './robots/robots.service';
import { ScrapeMetadataService } from './scrape-metadata/scrape-metadata.service';
import { IndustryClassificationService } from './industry-classification/industry-classification.service';

@Module({
  controllers: [ScraperController],
  providers: [ScraperService, RobotsService, ScrapeMetadataService, IndustryClassificationService],
})
export class ScraperModule {}
