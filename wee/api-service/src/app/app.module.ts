import { Module } from '@nestjs/common';
import { ScraperModule } from '../scraper/scraper.module';
import { PubSubModule } from '../pub-sub/pub_sub.module';
import { SchedulerModule } from '../scheduler/scheduler.module';

@Module({
  imports: [
    ScraperModule, 
    PubSubModule, 
    SchedulerModule
  ],
})
export class AppModule {}
