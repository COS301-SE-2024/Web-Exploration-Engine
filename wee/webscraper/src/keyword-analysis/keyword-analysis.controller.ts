import { Controller, Get, Query } from '@nestjs/common';
import { KeywordAnalysisService } from './keyword-analysis.service';
import {
  TargetKeywordsOperation, TargetKeywordsQuery, TargetKeywordsResponse200, TargetKeywordsResponse400, TargetKeywordsResponse500,
  KeywordRankingsOperation, KeywordRankingsQuery, KeywordRankingsResponse200, KeywordRankingsResponse400, KeywordRankingsResponse500,
  KeywordVolumeOperation, KeywordVolumeQuery, KeywordVolumeResponse200, KeywordVolumeResponse400, KeywordVolumeResponse500,
  KeywordDifficultyOperation, KeywordDifficultyQuery, KeywordDifficultyResponse200, KeywordDifficultyResponse400, KeywordDifficultyResponse500
} from './keyword-analysis.api';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('keyword-analysis')
@Controller('keyword-analysis')
export class KeywordAnalysisController {
  constructor(private readonly keywordAnalysisService: KeywordAnalysisService) {}

}
