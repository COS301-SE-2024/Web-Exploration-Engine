import { Module } from '@nestjs/common';
import { ScraperModule } from '../scraper.module';
import { PubSubModule } from '../pub-sub/pub_sub.module';

@Module({
  imports: [ScraperModule , PubSubModule],
})
export class AppModule {}
