import { Module } from '@nestjs/common';
import { KeywordAnalysisController } from './keyword-analysis.controller';

@Module({
  controllers: [KeywordAnalysisController],
})
export class KeywordAnalysisModule {}
