// scraper.api.ts

import { ApiOperation, ApiQuery, ApiResponse, ApiParam } from '@nestjs/swagger';

// Operation descriptions
export const ScrapeOperation = ApiOperation({ summary: 'Publish task to scrape the url provided' });
export const RobotsOperation = ApiOperation({ summary: 'Publish task to read the robots.txt file of the url provided' });
export const MetadataOperation = ApiOperation({ summary: 'Publish task to scrape metadata from the url provided' });
export const StatusOperation = ApiOperation({ summary: 'Publish task to scrape the status of the url provided' });
export const ClassifyIndustryOperation = ApiOperation({ summary: 'Publish task to classify the industry of the url provided' });
export const LogoOperation = ApiOperation({ summary: 'Publish task to scrape logos from the url provided' });
export const ImagesOperation = ApiOperation({ summary: 'Publish task to scrape images from the url provided' });
export const IndustryOperation = ApiOperation({ summary: 'Publish task to classify the industry of the url provided' });
export const ScreenshotOperation = ApiOperation({ summary: 'Publish task to capture screenshot of the url provided' });
export const ContactInfoOperation = ApiOperation({ summary: 'Publish task to scrape contact information from the url provided' });
export const AddressesOperation = ApiOperation({ summary: 'Publish task to scrape addresses from the url provided' });
export const SeoAnalysisOperation = ApiOperation({ summary: 'Publish task to perform SEO analysis on the url provided' });
export const NewsOperation =ApiOperation({ summary: 'Publish task to perform News extraction on the url provided' });
export const socialAnalyticsOperation = ApiOperation({ summary: 'Publish task to perform social medial analytics on the url provided' });
export const ReviewsOperation = ApiOperation({ summary: 'Publish task to scrape reviews on the url provided' });
// Query descriptions
export const ScraperQuery = ApiQuery({ name: 'url', required: true, description: 'The URL to scrape' });

// Response descriptions
export const ScraperResponse200 = ApiResponse({ status: 200, description: 'Task successfully published' });
export const ScraperResponse400 = ApiResponse({ status: 400, description: 'Bad Request. URL parameter is required/Invalid URL provided' });
export const ScraperResponse500 = ApiResponse({ status: 500, description: 'Internal Server Error. An error occurred while publishing the task' });


// // Scraper endpoint
// export const ScrapeQuery = ApiQuery({ name: 'url', required: true, description: 'The URL to scrape' });
// export const ScrapeResponse200 = ApiResponse({ status: 200, description: 'Task successfully published' });
// export const ScrapeResponse400 = ApiResponse({ status: 400, description: 'Bad Request. URL parameter is required/Invalid URL provided' });
// export const ScrapeResponse500 = ApiResponse({ status: 500, description: 'Internal Server Error. An error occurred while scraping the website' });

// // Robots endpoint
// export const ReadRobotsOperation = ApiOperation({ summary: 'Read robots.txt and interpret file' });
// export const ReadRobotsQuery = ApiQuery({ name: 'url', required: true, description: 'The URL to read robots.txt file' });
// export const ReadRobotsResponse200 = ApiResponse({
//   status: 200,
//   description: 'Robots.txt file successfully read',
//   schema: {
//     type: 'object',
//     properties: {
//       baseUrl: { type: 'string' },
//       allowedPaths: {
//         type: "array",
//         "items": { type: "string" }
//       },
//       disallowedPaths: {
//         type: "array",
//         "items": { type: "string" }
//       },
//       isBaseUrlAllowed: { type: 'boolean' },
//     },
//   },
// });
// export const ReadRobotsResponse400 = ApiResponse({
//   status: 400,
//   description: 'Bad Request. URL parameter is required',
//   schema: {
//     type: 'object',
//     properties: {
//       errorStatus: { type: 'number' },
//       errorCode: { type: 'string' },
//       errorMessage: { type: 'string' },
//     },
//   },
// });
// export const ReadRobotsResponse500 = ApiResponse({
//   status: 500,
//   description: 'Internal Server Error. An error occurred while reading robots.txt file',
//   schema: {
//     type: 'object',
//     properties: {
//       errorStatus: { type: 'number' },
//       errorCode: { type: 'string' },
//       errorMessage: { type: 'string' },
//     },
//   },
// });

// // Metadata endpoint
// export const ScrapeMetadataOperation = ApiOperation({ summary: 'Scrape metadata from a website' });
// export const ScrapeMetadataQuery = ApiQuery({ name: 'url', required: true, description: 'The URL to scrape' });
// export const ScrapeMetadataResponse200 = ApiResponse({
//   status: 200,
//   description: 'Metadata successfully scraped',
//   schema: {
//     type: 'object',
//     properties: {
//       title: { type: 'string' },
//       description: { type: 'string' },
//       keywords: { type: 'string' },
//       ogTitle: { type: 'string' },
//       ogDescription: { type: 'string' },
//       ogImage: { type: 'string' },
//     },
//   },
// });
// export const ScrapeMetadataResponse400 = ApiResponse({
//   status: 400,
//   description: 'Bad Request. URL parameter is required',
//   schema: {
//     type: 'object',
//     properties: {
//       errorStatus: { type: 'number' },
//       errorCode: { type: 'string' },
//       errorMessage: { type: 'string' },
//     },
//   },
// });
// export const ScrapeMetadataResponse500 = ApiResponse({
//   status: 500,
//   description: 'Internal Server Error. An error occurred while scraping metadata',
//   schema: {
//     type: 'object',
//     properties: {
//       errorStatus: { type: 'number' },
//       errorCode: { type: 'string' },
//       errorMessage: { type: 'string' },
//     },
//   },
// });

// // Status endpoint
// export const ScrapeStatusOperation = ApiOperation({ summary: 'Scrape the status of a website' });
// export const ScrapeStatusQuery = ApiQuery({ name: 'url', required: true, description: 'The URL to scrape' });
// export const ScrapeStatusResponse200 = ApiResponse({
//   status: 200,
//   description: 'Website status successfully scraped',
//   schema: {
//     type: 'string',
//     enum: ['live', 'parked'],
//   },
// });

// // Logos endpoint
// export const ScrapeLogoOperation = ApiOperation({ summary: 'Scrape logos from given URL' });
// export const ScrapeLogoQuery = ApiQuery({ name: 'url', required: true, description: 'The URL to scrape' });
// export const ScrapeLogoResponse200 = ApiResponse({
//   status: 200,
//   description: 'Logos successfully scraped',
//   schema: {
//     type: 'array',
//     items: {
//       type: 'string',
//     },
//   },
// });
// export const ScrapeLogoResponse400 = ApiResponse({
//   status: 400,
//   description: 'Bad Request. URL parameter is required',
//   schema: {
//     type: 'object',
//     properties: {
//       errorStatus: { type: 'number' },
//       errorCode: { type: 'string' },
//       errorMessage: { type: 'string' },
//     },
//   },
// });

// // Images endpoint
// export const ScrapeImagesOperation = ApiOperation({ summary: 'Scrape images from given URL' });
// export const ScrapeImagesQuery = ApiQuery({ name: 'url', required: true, description: 'The URL to scrape' });
// export const ScrapeImagesResponse200 = ApiResponse({
//   status: 200,
//   description: 'Images successfully scraped',
//   schema: {
//     type: 'array',
//     items: {
//       type: 'string',
//     },
//   },
// });
// export const ScrapeImagesResponse400 = ApiResponse({
//   status: 400,
//   description: 'Bad Request. URL parameter is required',
//   schema: {
//     type: 'object',
//     properties: {
//       errorStatus: { type: 'number' },
//       errorCode: { type: 'string' },
//       errorMessage: { type: 'string' },
//     },
//   },
// });


// // Industry classification endpoint
// export const ClassifyIndustryOperation = ApiOperation({ summary: 'Classify industry of a website based on metadata and based on the domain name' });
// export const ClassifyIndustryQuery = ApiQuery({ name: 'url', required: true, description: 'The URL to classify' });
// export const ClassifyIndustryResponse200 = ApiResponse({
//   status: 200,
//   description: 'Industry classification successful',
//   schema: {
//     type: 'object',
//     properties: {
//       metadataClass: {
//         type: 'object',
//         properties: {
//           label: { type: 'string' },
//           score: { type: 'number' },
//         },
//       },
//       domainClass: {
//         type: 'object',
//         properties: {
//           label: { type: 'string' },
//           score: { type: 'number' },
//         },
//       },
//     },
//   },
// });

// // Screenshot endpoint
// export const ScreenshotOperation = ApiOperation({ summary: 'Capture screenshot of a website' });
// export const ScreenshotQuery = ApiQuery({ name: 'url', required: true, description: 'The URL to capture screenshot' });
// export const ScreenshotResponse200 = ApiResponse({
//   status: 200,
//   description: 'Screenshot successfully captured',
//   schema: {
//     type: 'string',
//     format: 'binary',
//   },
// });
// export const ScreenshotResponse400 = ApiResponse({
//   status: 400,
//   description: 'Bad Request. URL parameter is required',
//   schema: {
//     type: 'object',
//     properties: {
//       errorStatus: { type: 'number' },
//       errorCode: { type: 'string' },
//       errorMessage: { type: 'string' },
//     },
//   },
// });
// // Scrape Contact Info endpoint
// export const ScrapeContactInfoOperation = ApiOperation({ summary: 'Scrape contact information from a website' });
// export const ScrapeContactInfoQuery = ApiQuery({ name: 'url', required: true, description: 'The URL to scrape contact information from' });
// export const ScrapeContactInfoResponse200 = ApiResponse({
//   status: 200,
//   description: 'Contact information successfully scraped',
//   schema: {
//     type: 'object',
//     properties: {
//       emails: { type: 'array', items: { type: 'string' } },
//       phones: { type: 'array', items: { type: 'string' } },
//       socialLinks: { type: 'array', items: { type: 'string' } },
//     },
//   },
// });

// export const ScrapeContactInfoResponse400 = ApiResponse({
//   status: 400,
//   description: 'Bad Request. URL parameter is required',
//   schema: {
//     type: 'object',
//     properties: {
//       errorStatus: { type: 'number' },
//       errorCode: { type: 'string' },
//       errorMessage: { type: 'string' },
//     },
//   },
// });
// export const ScreenshotResponse500 = ApiResponse({
//   status: 500,
//   description: 'Internal Server Error. An error occurred while capturing the screenshot',

// schema: {
//   type: 'object',
//   properties: {
//     errorStatus: { type: 'number' },
//     errorCode: { type: 'string' },
//     errorMessage: { type: 'string' },
//   },
// },
// });
// export const ScrapeContactInfoResponse500 = ApiResponse({
//   status: 500,
//   description: 'Internal Server Error. An error occurred while scraping contact information',
//   schema: {
//     type: 'object',
//     properties: {
//       errorStatus: { type: 'number' },
//       errorCode: { type: 'string' },
//       errorMessage: { type: 'string' },
//     },
//   },
// });
// // Scrape Addresses endpoint
// export const ScrapeAddressesOperation = ApiOperation({ summary: 'Scrape addresses from a website' });
// export const ScrapeAddressesQuery = ApiQuery({ name: 'url', required: true, description: 'The URL to scrape addresses from' });
// export const ScrapeAddressesResponse200 = ApiResponse({
//   status: 200,
//   description: 'Addresses successfully scraped',
//   schema: {
//     type: 'array',
//     items: {
//       type: 'string',
//     },
//   },
// });
// export const ScrapeAddressesResponse400 = ApiResponse({
//   status: 400,
//   description: 'Bad Request. URL parameter is required',
//   schema: {
//     type: 'object',
//     properties: {
//       errorStatus: { type: 'number' },
//       errorCode: { type: 'string' },
//       errorMessage: { type: 'string' },
//     },
//   },
// });
// export const ScrapeAddressesResponse500 = ApiResponse({
//   status: 500,
//   description: 'Internal Server Error. An error occurred while scraping addresses',
//   schema: {
//     type: 'object',
//     properties: {
//       errorStatus: { type: 'number' },
//       errorCode: { type: 'string' },
//       errorMessage: { type: 'string' },
//     },
//   },
// });

// export const SeoAnalysisOperation = ApiOperation({ summary: 'Perform SEO analysis on a website' });
// export const SeoAnalysisQuery = ApiQuery({ name: 'url', required: true, description: 'The URL to perform SEO analysis on' });
// export const SeoAnalysisResponse200 = ApiResponse({
//   status: 200,
//   description: 'SEO analysis successfully performed',
//   schema: {
//     type: 'object',
//     properties: {
//       titleTags: { type: 'string' },
//       metaDescriptions: { type: 'string' },

//         },
//   },
// });
// export const SeoAnalysisResponse400 = ApiResponse({
//   status: 400,
//   description: 'Bad Request. URL parameter is required',
//   schema: {
//     type: 'object',
//     properties: {
//       errorStatus: { type: 'number' },
//       errorCode: { type: 'string' },
//       errorMessage: { type: 'string' },
//     },
//   },
// });
// export const SeoAnalysisResponse500 = ApiResponse({
//   status: 500,
//   description: 'Internal Server Error. An error occurred while performing SEO analysis',
//   schema: {
//     type: 'object',
//     properties: {
//       errorStatus: { type: 'number' },
//       errorCode: { type: 'string' },
//       errorMessage: { type: 'string' },
//     },
//   },
// });

// getJobStatus endpoint
// export const GetJobStatusTypeParam = ApiParam({
//   name: 'type',
//   required: true,
//   description: 'Type of the job.',
//   schema: {
//     type: 'string',
//     enum: [
//       'scrape',
//       'read-robots',
//       'scrape-metadata',
//       'scrape-status',
//       'classify-industry',
//       'scrape-logo',
//       'scrape-images',
//       'screenshot',
//       'scrape-contact-info',
//       'scrape-addresses',
//       'seo-analysis',
//     ],
//   },
// });
// export const GetJobStatusUrlParam = ApiParam({
//   name: 'url',
//   required: true,
//   description: 'URL of the job.',
//   schema: {
//     type: 'string',
//   },
// });
export const GetJobStatusQuery = ApiQuery({ name: 'url', required: true, description: 'The URL to scrape' });
export const GetJobStatusTypeQuery = ApiQuery({ name: 'type', required: true, description: 'Type of the job' });
export const GetJobStatusKeywordQuery = ApiQuery({ name: 'keyword', required: true, description: 'The keyword to analyse' });


export const GetJobStatusOperation = ApiOperation({ summary: 'Get the status of a job' });

export const GetJobStatusResponse200 = ApiResponse({
  status: 200,
  description: 'Job status successfully retrieved',
  schema: {
    type: 'object',
    properties: {
      status: { type: 'string' },
      result: { type: 'object' },
    },
  },
});

export const GetJobStatusResponse400 = ApiResponse({
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

// // Scrape Addresses endpoint
// export const ScrapeAddressesOperation = ApiOperation({ summary: 'Scrape addresses from a website' });
// export const ScrapeAddressesQuery = ApiQuery({ name: 'url', required: true, description: 'The URL to scrape addresses from' });
// export const ScrapeAddressesResponse200 = ApiResponse({
//   status: 200,
//   description: 'Addresses successfully scraped',
//   schema: {
//     type: 'array',
//     items: {
//       type: 'string',
//     },
//   },
// });
// export const ScrapeAddressesResponse400 = ApiResponse({
//   status: 400,
//   description: 'Bad Request. URL parameter is required',
//   schema: {
//     type: 'object',
//     properties: {
//       errorStatus: { type: 'number' },
//       errorCode: { type: 'string' },
//       errorMessage: { type: 'string' },
//     },
//   },
// });
// export const ScrapeAddressesResponse500 = ApiResponse({
//   status: 500,
//   description: 'Internal Server Error. An error occurred while scraping addresses',
//   schema: {
//     type: 'object',
//     properties: {
//       errorStatus: { type: 'number' },
//       errorCode: { type: 'string' },
//       errorMessage: { type: 'string' },
//     },
//   },
// });

// export const SeoAnalysisOperation = ApiOperation({ summary: 'Perform SEO analysis on a website' });
// export const SeoAnalysisQuery = ApiQuery({ name: 'url', required: true, description: 'The URL to perform SEO analysis on' });
// export const SeoAnalysisResponse200 = ApiResponse({
//   status: 200,
//   description: 'SEO analysis successfully performed',
//   schema: {
//     type: 'object',
//     properties: {
//       titleTags: { type: 'string' },
//       metaDescriptions: { type: 'string' },

//         },
//   },
// });
// export const SeoAnalysisResponse400 = ApiResponse({
//   status: 400,
//   description: 'Bad Request. URL parameter is required',
//   schema: {
//     type: 'object',
//     properties: {
//       errorStatus: { type: 'number' },
//       errorCode: { type: 'string' },
//       errorMessage: { type: 'string' },
//     },
//   },
// });
// export const SeoAnalysisResponse500 = ApiResponse({
//   status: 500,
//   description: 'Internal Server Error. An error occurred while performing SEO analysis',
//   schema: {
//     type: 'object',
//     properties: {
//       errorStatus: { type: 'number' },
//       errorCode: { type: 'string' },
//       errorMessage: { type: 'string' },
//     },
//   },
// });
