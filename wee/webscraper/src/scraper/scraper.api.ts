// scraper.api.ts

import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

// Scraper endpoint
export const ScrapeOperation = ApiOperation({ summary: 'Scrape a website' });
export const ScrapeQuery = ApiQuery({ name: 'url', required: true, description: 'The URL to scrape' });
export const ScrapeResponse200 = ApiResponse({ status: 200, description: 'Website successfully scraped' });
export const ScrapeResponse400 = ApiResponse({ status: 400, description: 'Bad Request. URL parameter is required' });
export const ScrapeResponse500 = ApiResponse({ status: 500, description: 'Internal Server Error. An error occurred while scraping the website' });

// Robots endpoint
export const ReadRobotsOperation = ApiOperation({ summary: 'Read robots.txt and interpret file' });
export const ReadRobotsQuery = ApiQuery({ name: 'url', required: true, description: 'The URL to read robots.txt file' });
export const ReadRobotsResponse200 = ApiResponse({
  status: 200,
  description: 'Robots.txt file successfully read',
  schema: {
    type: 'object',
    properties: {
      baseUrl: { type: 'string' },
      allowedPaths: { 
        type: "array",
        "items": { type: "string" }
      },
      disallowedPaths: { 
        type: "array",
        "items": { type: "string" }
      },
      isBaseUrlAllowed: { type: 'boolean' },
    },
  },
});
export const ReadRobotsResponse400 = ApiResponse({
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
export const ReadRobotsResponse500 = ApiResponse({
  status: 500,
  description: 'Internal Server Error. An error occurred while reading robots.txt file',
  schema: {
    type: 'object',
    properties: {
      errorStatus: { type: 'number' },
      errorCode: { type: 'string' },
      errorMessage: { type: 'string' },
    },
  },
});

// Metadata endpoint
export const ScrapeMetadataOperation = ApiOperation({ summary: 'Scrape metadata from a website' });
export const ScrapeMetadataQuery = ApiQuery({ name: 'url', required: true, description: 'The URL to scrape' });
export const ScrapeMetadataResponse200 = ApiResponse({
  status: 200,
  description: 'Metadata successfully scraped',
  schema: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      description: { type: 'string' },
      keywords: { type: 'string' },
      ogTitle: { type: 'string' },
      ogDescription: { type: 'string' },
      ogImage: { type: 'string' },
    },
  },
});
export const ScrapeMetadataResponse400 = ApiResponse({
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
export const ScrapeMetadataResponse500 = ApiResponse({
  status: 500,
  description: 'Internal Server Error. An error occurred while scraping metadata',
  schema: {
    type: 'object',
    properties: {
      errorStatus: { type: 'number' },
      errorCode: { type: 'string' },
      errorMessage: { type: 'string' },
    },
  },
});

// Status endpoint
export const ScrapeStatusOperation = ApiOperation({ summary: 'Scrape the status of a website' });
export const ScrapeStatusQuery = ApiQuery({ name: 'url', required: true, description: 'The URL to scrape' });
export const ScrapeStatusResponse200 = ApiResponse({
  status: 200,
  description: 'Website status successfully scraped',
  schema: {
    type: 'string',
    enum: ['live', 'parked'],
  },
});

// Logos endpoint
export const ScrapeLogoOperation = ApiOperation({ summary: 'Scrape logos from given URL' });
export const ScrapeLogoQuery = ApiQuery({ name: 'url', required: true, description: 'The URL to scrape' });
export const ScrapeLogoResponse200 = ApiResponse({
  status: 200,
  description: 'Logos successfully scraped',
  schema: {
    type: 'array',
    items: {
      type: 'string',
    },
  },
});
export const ScrapeLogoResponse400 = ApiResponse({
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

// Images endpoint
export const ScrapeImagesOperation = ApiOperation({ summary: 'Scrape images from given URL' });
export const ScrapeImagesQuery = ApiQuery({ name: 'url', required: true, description: 'The URL to scrape' });
export const ScrapeImagesResponse200 = ApiResponse({
  status: 200,
  description: 'Images successfully scraped',
  schema: {
    type: 'array',
    items: {
      type: 'string',
    },
  },
});
export const ScrapeImagesResponse400 = ApiResponse({
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


// Industry classification endpoint
export const ClassifyIndustryOperation = ApiOperation({ summary: 'Classify industry of a website based on metadata and based on the domain name' });
export const ClassifyIndustryQuery = ApiQuery({ name: 'url', required: true, description: 'The URL to classify' });
export const ClassifyIndustryResponse200 = ApiResponse({
  status: 200,
  description: 'Industry classification successful',
  schema: {
    type: 'object',
    properties: {
      metadataClass: {
        type: 'object',
        properties: {
          label: { type: 'string' },
          score: { type: 'number' },
        },
      },
      domainClass: {
        type: 'object',
        properties: {
          label: { type: 'string' },
          score: { type: 'number' },
        },
      },
    },
  },
});

// Scrape Contact Info endpoint
export const ScrapeContactInfoOperation = ApiOperation({ summary: 'Scrape contact information from a website' });
export const ScrapeContactInfoQuery = ApiQuery({ name: 'url', required: true, description: 'The URL to scrape contact information from' });
export const ScrapeContactInfoResponse200 = ApiResponse({
  status: 200,
  description: 'Contact information successfully scraped',
  schema: {
    type: 'object',
    properties: {
      emails: { type: 'array', items: { type: 'string' } },
      phones: { type: 'array', items: { type: 'string' } },
    },
  },
});
export const ScrapeContactInfoResponse400 = ApiResponse({
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
export const ScrapeContactInfoResponse500 = ApiResponse({
  status: 500,
  description: 'Internal Server Error. An error occurred while scraping contact information',
  schema: {
    type: 'object',
    properties: {
      errorStatus: { type: 'number' },
      errorCode: { type: 'string' },
      errorMessage: { type: 'string' },
    },
  },
});
// Scrape Addresses endpoint
export const ScrapeAddressesOperation = ApiOperation({ summary: 'Scrape addresses from a website' });
export const ScrapeAddressesQuery = ApiQuery({ name: 'url', required: true, description: 'The URL to scrape addresses from' });
export const ScrapeAddressesResponse200 = ApiResponse({
  status: 200,
  description: 'Addresses successfully scraped',
  schema: {
    type: 'array',
    items: {
      type: 'string',
    },
  },
});
export const ScrapeAddressesResponse400 = ApiResponse({
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
export const ScrapeAddressesResponse500 = ApiResponse({
  status: 500,
  description: 'Internal Server Error. An error occurred while scraping addresses',
  schema: {
    type: 'object',
    properties: {
      errorStatus: { type: 'number' },
      errorCode: { type: 'string' },
      errorMessage: { type: 'string' },
    },
  },
});


