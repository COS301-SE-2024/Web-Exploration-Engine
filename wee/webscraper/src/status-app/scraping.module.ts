import { Module } from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import { ScrapingController } from './scraping.controller';

@Module({
    providers: [ScrapingService],
    controllers: [ScrapingController],
})
export class ScrapingModule {}
