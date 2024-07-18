import { Module } from '@nestjs/common';
import { ScraperModule } from '../scraper.module';
import { KeywordAnalysisService } from '../keyword-analysis/keyword-analysis.service';
import { KeywordAnalysisController } from '../keyword-analysis/keyword-analysis.controller';
@Module({
  imports: [ScraperModule],
  controllers: [KeywordAnalysisController],
  providers: [KeywordAnalysisService],
})
export class AppModule {}