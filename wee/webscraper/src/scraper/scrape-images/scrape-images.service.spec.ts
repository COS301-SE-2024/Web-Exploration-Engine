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

  it('should handle puppeteer launch failure', async () => {
    // Mock puppeteer to throw an error on launch
    const puppeteer = require('puppeteer');
    puppeteer.launch.mockImplementation(() => {
      throw new Error('Failed to launch browser');
    });

    const url = 'https://example.com';
    const robots: RobotsResponse = { 
      baseUrl: 'https://example.com',
      allowedPaths: [],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: true 
    };

    const imageUrls = await scrapeImagesService.scrapeImages(url, robots);

    expect(imageUrls).toEqual([]); // Expecting empty array due to launch failure
  });

  it('should handle empty image array', async () => {
    // Mock puppeteer to return empty image array
    const puppeteer = require('puppeteer');
    puppeteer.launch.mockImplementation(() => Promise.resolve({
      newPage: jest.fn(() => Promise.resolve({
        goto: jest.fn(() => Promise.resolve()),
        evaluate: jest.fn(() => Promise.resolve([])),
      })),
      close: jest.fn(() => Promise.resolve()),
    }));

    const url = 'https://example.com';
    const robots: RobotsResponse = { 
      baseUrl: 'https://example.com',
      allowedPaths: [],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: true 
    };

    const imageUrls = await scrapeImagesService.scrapeImages(url, robots);

    expect(imageUrls).toEqual([]); // Expecting empty array due to no images found
  });

  it('should handle URL navigation failure', async () => {
    // Mock puppeteer to throw an error on page.goto
    const puppeteer = require('puppeteer');
    puppeteer.launch.mockImplementation(() => Promise.resolve({
      newPage: jest.fn(() => Promise.resolve({
        goto: jest.fn(() => {
          throw new Error('Navigation failed');
        }),
        evaluate: jest.fn(() => Promise.resolve([])),
      })),
      close: jest.fn(() => Promise.resolve()),
    }));

    const url = 'https://example.com';
    const robots: RobotsResponse = { 
      baseUrl: 'https://example.com',
      allowedPaths: [],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: true 
    };

    const imageUrls = await scrapeImagesService.scrapeImages(url, robots);

    expect(imageUrls).toEqual([]); // Expecting empty array due to navigation failure
  });

  it('should limit the number of images to 50', async () => {
    // Mock puppeteer to return more than 50 images
    const puppeteer = require('puppeteer');
    puppeteer.launch.mockImplementation(() => Promise.resolve({
      newPage: jest.fn(() => Promise.resolve({
        goto: jest.fn(() => Promise.resolve()),
        evaluate: jest.fn(() => Promise.resolve(new Array(100).fill('/image.jpg'))),
      })),
      close: jest.fn(() => Promise.resolve()),
    }));

    const url = 'https://example.com';
    const robots: RobotsResponse = { 
      baseUrl: 'https://example.com',
      allowedPaths: [],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: true 
    };

    const imageUrls = await scrapeImagesService.scrapeImages(url, robots);

    expect(imageUrls).toHaveLength(50); // Expecting only 50 images to be returned
  });

  // New Test: Handle Puppeteer newPage failure
  it('should handle puppeteer newPage failure', async () => {
    // Mock puppeteer to throw an error on newPage
    const puppeteer = require('puppeteer');
    puppeteer.launch.mockImplementation(() => Promise.resolve({
      newPage: jest.fn(() => {
        throw new Error('Failed to create new page');
      }),
      close: jest.fn(() => Promise.resolve()),
    }));

    const url = 'https://example.com';
    const robots: RobotsResponse = { 
      baseUrl: 'https://example.com',
      allowedPaths: [],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: true 
    };

    const imageUrls = await scrapeImagesService.scrapeImages(url, robots);

    expect(imageUrls).toEqual([]); // Expecting empty array due to newPage failure
  });

  // New Test: Handle page.evaluate failure
  it('should handle page.evaluate failure', async () => {
    // Mock puppeteer to throw an error on evaluate
    const puppeteer = require('puppeteer');
    puppeteer.launch.mockImplementation(() => Promise.resolve({
      newPage: jest.fn(() => Promise.resolve({
        goto: jest.fn(() => Promise.resolve()),
        evaluate: jest.fn(() => {
          throw new Error('Failed to evaluate page');
        }),
      })),
      close: jest.fn(() => Promise.resolve()),
    }));

    const url = 'https://example.com';
    const robots: RobotsResponse = { 
      baseUrl: 'https://example.com',
      allowedPaths: [],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: true 
    };

    const imageUrls = await scrapeImagesService.scrapeImages(url, robots);

    expect(imageUrls).toEqual([]); // Expecting empty array due to evaluate failure
  });
});
