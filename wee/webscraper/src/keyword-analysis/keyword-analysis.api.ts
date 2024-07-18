import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

// Target Keywords endpoint
export const TargetKeywordsOperation = ApiOperation({ summary: 'Identify primary and secondary keywords the site is targeting' });
export const TargetKeywordsQuery = ApiQuery({ name: 'url', required: true, description: 'The URL to analyze' });
export const TargetKeywordsResponse200 = ApiResponse({
  status: 200,
  description: 'Keywords successfully identified',
  schema: {
    type: 'object',
    properties: {
      primaryKeywords: { type: 'array', items: { type: 'string' } },
      secondaryKeywords: { type: 'array', items: { type: 'string' } },
    },
  },
});
export const TargetKeywordsResponse400 = ApiResponse({
  status: 400,
  description: 'Bad Request. URL parameter is required',
  schema: {
    type: 'object',
    properties: {
      errorStatus: { type: 'number' },
      errorCode: { type: 'string' },
      errorMessage: { type: 'string' },
    },
  },
});
export const TargetKeywordsResponse500 = ApiResponse({
  status: 500,
  description: 'Internal Server Error. An error occurred while identifying keywords',
  schema: {
    type: 'object',
    properties: {
      errorStatus: { type: 'number' },
      errorCode: { type: 'string' },
      errorMessage: { type: 'string' },
    },
  },
});

// Keyword Rankings endpoint
export const KeywordRankingsOperation = ApiOperation({ summary: 'Track where the site ranks for these keywords on search engines' });
export const KeywordRankingsQuery = ApiQuery({ name: 'url', required: true, description: 'The URL to analyze' });
export const KeywordRankingsResponse200 = ApiResponse({
  status: 200,
  description: 'Keyword rankings successfully tracked',
  schema: {
    type: 'object',
    properties: {
      keywordRankings: { type: 'array', items: { type: 'string' } },
    },
  },
});
export const KeywordRankingsResponse400 = ApiResponse({
  status: 400,
  description: 'Bad Request. URL parameter is required',
  schema: {
    type: 'object',
    properties: {
      errorStatus: { type: 'number' },
      errorCode: { type: 'string' },
      errorMessage: { type: 'string' },
    },
  },
});
export const KeywordRankingsResponse500 = ApiResponse({
  status: 500,
  description: 'Internal Server Error. An error occurred while tracking keyword rankings',
  schema: {
    type: 'object',
    properties: {
      errorStatus: { type: 'number' },
      errorCode: { type: 'string' },
      errorMessage: { type: 'string' },
    },
  },
});

// Keyword Volume endpoint
export const KeywordVolumeOperation = ApiOperation({ summary: 'Measure the search volume for each keyword' });
export const KeywordVolumeQuery = ApiQuery({ name: 'url', required: true, description: 'The URL to analyze' });
export const KeywordVolumeResponse200 = ApiResponse({
  status: 200,
  description: 'Keyword volume successfully measured',
  schema: {
    type: 'object',
    properties: {
      keywordVolume: { type: 'array', items: { type: 'object', properties: { keyword: { type: 'string' }, volume: { type: 'number' } } } },
    },
  },
});
export const KeywordVolumeResponse400 = ApiResponse({
  status: 400,
  description: 'Bad Request. URL parameter is required',
  schema: {
    type: 'object',
    properties: {
      errorStatus: { type: 'number' },
      errorCode: { type: 'string' },
      errorMessage: { type: 'string' },
    },
  },
});
export const KeywordVolumeResponse500 = ApiResponse({
  status: 500,
  description: 'Internal Server Error. An error occurred while measuring keyword volume',
  schema: {
    type: 'object',
    properties: {
      errorStatus: { type: 'number' },
      errorCode: { type: 'string' },
      errorMessage: { type: 'string' },
    },
  },
});

// Keyword Difficulty endpoint
export const KeywordDifficultyOperation = ApiOperation({ summary: 'Assess the competition level for each keyword' });
export const KeywordDifficultyQuery = ApiQuery({ name: 'url', required: true, description: 'The URL to analyze' });
export const KeywordDifficultyResponse200 = ApiResponse({
  status: 200,
  description: 'Keyword difficulty successfully assessed',
  schema: {
    type: 'object',
    properties: {
      keywordDifficulty: { type: 'array', items: { type: 'object', properties: { keyword: { type: 'string' }, difficulty: { type: 'number' } } } },
    },
  },
});
export const KeywordDifficultyResponse400 = ApiResponse({
  status: 400,
  description: 'Bad Request. URL parameter is required',
  schema: {
    type: 'object',
    properties: {
      errorStatus: { type: 'number' },
      errorCode: { type: 'string' },
      errorMessage: { type: 'string' },
    },
  },
});
export const KeywordDifficultyResponse500 = ApiResponse({
  status: 500,
  description: 'Internal Server Error. An error occurred while assessing keyword difficulty',
  schema: {
    type: 'object',
    properties: {
      errorStatus: { type: 'number' },
      errorCode: { type: 'string' },
      errorMessage: { type: 'string' },
    },
  },
});

