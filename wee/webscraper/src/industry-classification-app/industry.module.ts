import { Module } from '@nestjs/common';
import { ScrapingService } from '../industry-classification-app/industry.service';
import { ScrapingController } from '../industry-classification-app/industry.controller';

@Module({
  controllers: [ScrapingController],
  providers: [ScrapingService],
})
export class ScrapingModule {}
