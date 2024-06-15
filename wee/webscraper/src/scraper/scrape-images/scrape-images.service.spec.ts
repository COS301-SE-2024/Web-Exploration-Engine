/* eslint-disable @typescript-eslint/no-empty-function */
import { ScrapeImagesService } from './scrape-images.service';
import { RobotsResponse } from '../models/ServiceModels';

// Mock puppeteer and its methods
jest.mock('puppeteer', () => ({
  launch: jest.fn(() => Promise.resolve({
    newPage: jest.fn(() => Promise.resolve({
      goto: jest.fn(() => Promise.resolve()),
      evaluate: jest.fn(() => Promise.resolve(['/image1.jpg', '/image2.jpg'])),
    })),
    close: jest.fn(() => Promise.resolve()),
  })),
}));

describe('ScrapeImagesService', () => {
  let scrapeImagesService: ScrapeImagesService;

  beforeEach(() => {
    scrapeImagesService = new ScrapeImagesService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should scrape images successfully', async () => {
    const url = 'https://example.com';
    const robots: RobotsResponse = { 
      baseUrl: 'https://example.com',
      allowedPaths: [],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: true 
    };

    const imageUrls = await scrapeImagesService.scrapeImages(url, robots);

    expect(imageUrls).toHaveLength(2); // Asserting that two images are returned
    expect(imageUrls).toEqual(['/image1.jpg', '/image2.jpg']); // Asserting the exact URLs
  });

  it('should handle case where crawling is not allowed', async () => {
    const url = 'https://example.com';
    const robots: RobotsResponse = { 
      baseUrl: 'https://example.com',
      allowedPaths: [],
      disallowedPaths: [],
      isBaseUrlAllowed: false,
      isUrlScrapable: false 
    };

    const imageUrls = await scrapeImagesService.scrapeImages(url, robots);

    expect(imageUrls).toEqual([]); // Expecting empty array as no scraping is allowed
  });
});
