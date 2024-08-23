import { Module } from '@nestjs/common';
import { ScraperModule } from '../scraper.module';
import { PubSubModule } from '../pub-sub/pub_sub.module';
// import { KeywordAnalysisService } from '../keyword-analysis/keyword-analysis.service';
// import { KeywordAnalysisController } from '../keyword-analysis/keyword-analysis.controller';
@Module({
  imports: [ScraperModule , PubSubModule],
  // controllers: [KeywordAnalysisController],
  // providers: [KeywordAnalysisService],
})
export class AppModule {}