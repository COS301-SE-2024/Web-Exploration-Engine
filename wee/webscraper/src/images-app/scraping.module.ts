import { Module } from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import { ScrapingController } from './scraping.controller';
/**
 * Module for handling scraping-related functionality.
 */
@Module({
    providers: [ScrapingService],
    controllers: [ScrapingController],
})
export class ScrapingModule {}
