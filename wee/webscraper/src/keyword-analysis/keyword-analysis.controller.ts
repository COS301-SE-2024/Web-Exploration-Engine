import { Controller, Get, Query } from '@nestjs/common';
import { KeywordAnalysisService } from './keyword-analysis.service';
import {
  KeywordRankingsOperation,
  KeywordRankingsQuery,
  KeywordRankingsResponse200,
  KeywordRankingsResponse400,
  KeywordRankingsResponse500,
} from './keyword-analysis.api';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('keyword-analysis')
@Controller('keyword-analysis')
export class KeywordAnalysisController {
  constructor(private readonly keywordAnalysisService: KeywordAnalysisService) {}

  @Get('keyword-rankings')
  @KeywordRankingsOperation
  @KeywordRankingsQuery
  @KeywordRankingsResponse200
  @KeywordRankingsResponse400
  @KeywordRankingsResponse500
  async getKeywordRankings(
    @Query('url') url: string,
    @Query('keyword') keyword: string
  ) {
    const rankings = await this.keywordAnalysisService.getKeywordRanking(url, keyword);
    return { rankings };
  }

  @Get('keyword-density')
  async getKeywordDensity(
    @Query('url') url: string,
    @Query('keyword') keyword: string
  ) {
    const density = await this.keywordAnalysisService.getKeywordDensity(url, keyword);
    return { density };
  }
    
}
