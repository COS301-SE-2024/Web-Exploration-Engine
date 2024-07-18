import { Controller, Get, Query } from '@nestjs/common';
import { KeywordAnalysisService } from './keyword-analysis.service';
import {
  KeywordRankingsOperation,
  KeywordRankingsQuery,
  KeywordRankingsResponse200,
  KeywordRankingsResponse400,
  KeywordRankingsResponse500,
  KeywordDensityOperation,
  KeywordDensityQuery,
  KeywordDensityResponse200,
  KeywordDensityResponse400,
  KeywordDensityResponse500,
  KeywordInAnchorTextsOperation,
  KeywordInAnchorTextsQuery,
  KeywordInAnchorTextsResponse200,
  KeywordInAnchorTextsResponse400,
  KeywordInAnchorTextsResponse500,
  KeywordInImageAltsOperation,
  KeywordInImageAltsQuery,
  KeywordInImageAltsResponse200,
  KeywordInImageAltsResponse400,
  KeywordInImageAltsResponse500,
  AllKeywordAnalysisOperation,
  AllKeywordAnalysisQuery,
  AllKeywordAnalysisQueryKeywords,
  AllKeywordAnalysisResponse200,
  AllKeywordAnalysisResponse400,
  AllKeywordAnalysisResponse500,
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
  @KeywordDensityOperation
  @KeywordDensityQuery
  @KeywordDensityResponse200
  @KeywordDensityResponse400
  @KeywordDensityResponse500
  async getKeywordDensity(
    @Query('url') url: string,
    @Query('keyword') keyword: string
  ) {
    const density = await this.keywordAnalysisService.getKeywordDensity(url, keyword);
    return { density };
  }

  @Get('keyword-in-anchor-texts')
  @KeywordInAnchorTextsOperation
  @KeywordInAnchorTextsQuery
  @KeywordInAnchorTextsResponse200
  @KeywordInAnchorTextsResponse400
  @KeywordInAnchorTextsResponse500
  async getKeywordInAnchorTexts(
    @Query('url') url: string,
    @Query('keyword') keyword: string
  ) {
    const anchorTexts = await this.keywordAnalysisService.getKeywordInAnchorTexts(url, keyword);
    return anchorTexts;
  }

  @Get('keyword-in-image-alts')
  @KeywordInImageAltsOperation
  @KeywordInImageAltsQuery
  @KeywordInImageAltsResponse200
  @KeywordInImageAltsResponse400
  @KeywordInImageAltsResponse500
  async getKeywordInImageAlts(
    @Query('url') url: string,
    @Query('keyword') keyword: string
  ) {
    const imageAlts = await this.keywordAnalysisService.getKeywordInImageAlts(url, keyword);
    return imageAlts;
  }

  @Get()
  @AllKeywordAnalysisOperation
  @AllKeywordAnalysisQuery
  @AllKeywordAnalysisQueryKeywords
  @AllKeywordAnalysisResponse200
  @AllKeywordAnalysisResponse400
  @AllKeywordAnalysisResponse500
  async getAllKeywordAnalysis(
    @Query('url') url: string,
    @Query('keywords') keywords: string
  ) {
    const keywordList = keywords.split(',').map(keyword => keyword.trim());

    const results = await Promise.all(keywordList.map(async (keyword) => {
      const [rankings, density, anchorTexts, imageAlts] = await Promise.all([
        this.keywordAnalysisService.getKeywordRanking(url, keyword),
        this.keywordAnalysisService.getKeywordDensity(url, keyword),
        this.keywordAnalysisService.getKeywordInAnchorTexts(url, keyword),
        this.keywordAnalysisService.getKeywordInImageAlts(url, keyword)
      ]);

      return {
        keyword,
        keywordRankings: rankings,
        keywordDensity: density,
        keywordInAnchorTexts: anchorTexts,
        keywordInImageAlts: imageAlts
      };
    }));

    return results;
  }
}