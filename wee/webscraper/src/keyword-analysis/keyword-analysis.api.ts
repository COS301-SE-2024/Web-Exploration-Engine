import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

// Keyword Rankings endpoint
export const KeywordRankingsOperation = ApiOperation({ summary: 'Track where the site ranks for these keywords on search engines' });
export const KeywordRankingsQuery = ApiQuery({ name: 'url', required: true, description: 'The URL to analyze' });
export const KeywordRankingsResponse200 = ApiResponse({
  status: 200,
  description: 'Keyword rankings successfully tracked',
  schema: {
    type: 'object',
    properties: {
      ranking: { type: 'number' },
      results: { type: 'array', items: { type: 'object', properties: { title: { type: 'string' }, link: { type: 'string' } } } },
    },
  },
});
export const KeywordRankingsResponse400 = ApiResponse({
  status: 400,
  description: 'Bad Request. URL or keyword parameter is required',
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

// Keyword Density endpoint
export const KeywordDensityOperation = ApiOperation({ summary: 'Measure the keyword density on the webpage' });
export const KeywordDensityQuery = ApiQuery({ name: 'url', required: true, description: 'The URL to analyze' });
export const KeywordDensityResponse200 = ApiResponse({
  status: 200,
  description: 'Keyword density successfully measured',
  schema: {
    type: 'object',
    properties: {
      keywordCount: { type: 'number' },
      totalWords: { type: 'number' },
      density: { type: 'string' }, // Density as a percentage formatted to 2 decimal places
    },
  },
});
export const KeywordDensityResponse400 = ApiResponse({
  status: 400,
  description: 'Bad Request. URL or keyword parameter is required',
  schema: {
    type: 'object',
    properties: {
      errorStatus: { type: 'number' },
      errorCode: { type: 'string' },
      errorMessage: { type: 'string' },
    },
  },
});
export const KeywordDensityResponse500 = ApiResponse({
  status: 500,
  description: 'Internal Server Error. An error occurred while measuring keyword density',
  schema: {
    type: 'object',
    properties: {
      errorStatus: { type: 'number' },
      errorCode: { type: 'string' },
      errorMessage: { type: 'string' },
    },
  },
});

// Keyword in Anchor Texts endpoint
export const KeywordInAnchorTextsOperation = ApiOperation({ summary: 'Analyze keyword presence in anchor texts on the webpage' });
export const KeywordInAnchorTextsQuery = ApiQuery({ name: 'url', required: true, description: 'The URL to analyze' });
export const KeywordInAnchorTextsResponse200 = ApiResponse({
  status: 200,
  description: 'Keyword presence in anchor texts successfully analyzed',
  schema: {
    type: 'object',
    properties: {
      keywordInAnchorsPercentage: { type: 'string' }, // Percentage formatted to 2 decimal places
      anchorDetails: { type: 'array', items: { type: 'object', properties: { text: { type: 'string' }, href: { type: 'string' }, containsKeyword: { type: 'boolean' } } } },
    },
  },
});
export const KeywordInAnchorTextsResponse400 = ApiResponse({
  status: 400,
  description: 'Bad Request. URL or keyword parameter is required',
  schema: {
    type: 'object',
    properties: {
      errorStatus: { type: 'number' },
      errorCode: { type: 'string' },
      errorMessage: { type: 'string' },
    },
  },
});
export const KeywordInAnchorTextsResponse500 = ApiResponse({
  status: 500,
  description: 'Internal Server Error. An error occurred while analyzing keyword presence in anchor texts',
  schema: {
    type: 'object',
    properties: {
      errorStatus: { type: 'number' },
      errorCode: { type: 'string' },
      errorMessage: { type: 'string' },
    },
  },
});

// Keyword in Image Alts endpoint
export const KeywordInImageAltsOperation = ApiOperation({ summary: 'Analyze keyword presence in image alt texts on the webpage' });
export const KeywordInImageAltsQuery = ApiQuery({ name: 'url', required: true, description: 'The URL to analyze' });
export const KeywordInImageAltsResponse200 = ApiResponse({
  status: 200,
  description: 'Keyword presence in image alt texts successfully analyzed',
  schema: {
    type: 'object',
    properties: {
      totalImages: { type: 'number' },
      keywordInAltsCount: { type: 'number' },
      keywordInSrcCount: { type: 'number' },
      percentageInAlts: { type: 'string' }, // Percentage formatted to 2 decimal places
      percentageInSrcs: { type: 'string' }, // Percentage formatted to 2 decimal places
      imageDetails: { type: 'array', items: { type: 'object', properties: { alt: { type: 'string' }, src: { type: 'string' }, containsKeywordInAlt: { type: 'boolean' }, containsKeywordInSrc: { type: 'boolean' } } } },
    },
  },
});
export const KeywordInImageAltsResponse400 = ApiResponse({
  status: 400,
  description: 'Bad Request. URL or keyword parameter is required',
  schema: {
    type: 'object',
    properties: {
      errorStatus: { type: 'number' },
      errorCode: { type: 'string' },
      errorMessage: { type: 'string' },
    },
  },
});
export const KeywordInImageAltsResponse500 = ApiResponse({
  status: 500,
  description: 'Internal Server Error. An error occurred while analyzing keyword presence in image alt texts',
  schema: {
    type: 'object',
    properties: {
      errorStatus: { type: 'number' },
      errorCode: { type: 'string' },
      errorMessage: { type: 'string' },
    },
  },
  
});
// Combined Keyword Analysis endpoint
export const AllKeywordAnalysisOperation = ApiOperation({ summary: 'Get all keyword analysis results for specified keywords' });
export const AllKeywordAnalysisQuery = ApiQuery({ name: 'url', required: true, description: 'The URL to analyze' });
export const AllKeywordAnalysisQueryKeywords = ApiQuery({ name: 'keywords', required: true, description: 'Comma-separated list of keywords to analyze' });
export const AllKeywordAnalysisResponse200 = ApiResponse({
    status: 200,
    description: 'All keyword analysis results successfully retrieved',
    schema: {
      type: 'array',
      items: {
            type: 'string',
          },
      },
    });
  
export const AllKeywordAnalysisResponse400 = ApiResponse({
  status: 400,
  description: 'Bad Request. URL or keywords parameter is required',
  schema: {
    type: 'object',
    properties: {
      errorStatus: { type: 'number' },
      errorCode: { type: 'string' },
      errorMessage: { type: 'string' },
    },
  },
});
export const AllKeywordAnalysisResponse500 = ApiResponse({
  status: 500,
  description: 'Internal Server Error. An error occurred while retrieving all keyword analysis results',
  schema: {
    type: 'object',
    properties: {
      errorStatus: { type: 'number' },
      errorCode: { type: 'string' },
      errorMessage: { type: 'string' },
    },
  },
});

