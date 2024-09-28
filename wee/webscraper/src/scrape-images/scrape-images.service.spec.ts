/* eslint-disable @typescript-eslint/no-var-requires */
import { ScrapeImagesService } from './scrape-images.service';
import { RobotsResponse } from '../models/ServiceModels';
import * as puppeteer from 'puppeteer';

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

    const mockImages = ['/image1.jpg', '/image2.jpg'];

    const mockPage = {
      goto: jest.fn().mockResolvedValue(undefined),
      evaluate: jest.fn().mockResolvedValue(mockImages),
      authenticate: jest.fn(),
      close: jest.fn(),
    } as unknown as puppeteer.Page;

    const mockBrowser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn(),
    } as unknown as puppeteer.Browser;

    // Mock environment variables
    process.env.PROXY_USERNAME = 'username';
    process.env.PROXY_PASSWORD = 'password';

    const imageUrls = await scrapeImagesService.scrapeImages(url, robots, mockPage);

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

    const mockImages = ['/image1.jpg', '/image2.jpg'];

    const mockPage = {
      goto: jest.fn().mockResolvedValue(undefined),
      evaluate: jest.fn().mockResolvedValue(mockImages),
      authenticate: jest.fn(),
      close: jest.fn(),
    } as unknown as puppeteer.Page;

    const mockBrowser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn(),
    } as unknown as puppeteer.Browser;

    // Mock environment variables
    process.env.PROXY_USERNAME = 'username';
    process.env.PROXY_PASSWORD = 'password';

    const imageUrls = await scrapeImagesService.scrapeImages(url, robots, mockPage);

    expect(imageUrls).toEqual([]); // Expecting empty array as no scraping is allowed
  });

  it('should handle puppeteer launch failure', async () => {

    const url = 'https://example.com';
    const robots: RobotsResponse = { 
      baseUrl: 'https://example.com',
      allowedPaths: [],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: true 
    };

    const mockPage = {
      goto: jest.fn().mockResolvedValue(new Error('Failed to launch browser')),
      evaluate: jest.fn().mockResolvedValue([]),
      authenticate: jest.fn(),
      close: jest.fn(),
    } as unknown as puppeteer.Page;

    const mockBrowser = {
      newPage: jest.fn().mockRejectedValue(new Error('Failed to launch browser')),
      close: jest.fn(),
    } as unknown as puppeteer.Browser;

    // Mock environment variables
    process.env.PROXY_USERNAME = 'username';
    process.env.PROXY_PASSWORD = 'password';

    const imageUrls = await scrapeImagesService.scrapeImages(url, robots, mockPage);

    expect(imageUrls).toEqual([]); // Expecting empty array due to launch failure
  });

  it('should handle empty image array', async () => {
    const url = 'https://example.com';
    const robots: RobotsResponse = { 
      baseUrl: 'https://example.com',
      allowedPaths: [],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: true 
    };

    const mockImages = [];

    const mockPage = {
      goto: jest.fn().mockResolvedValue(undefined),
      evaluate: jest.fn().mockResolvedValue(mockImages),
      authenticate: jest.fn(),
      close: jest.fn(),
    } as unknown as puppeteer.Page;

    const mockBrowser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn(),
    } as unknown as puppeteer.Browser;

    // Mock environment variables
    process.env.PROXY_USERNAME = 'username';
    process.env.PROXY_PASSWORD = 'password';

    const imageUrls = await scrapeImagesService.scrapeImages(url, robots, mockPage);

    expect(imageUrls).toEqual([]); // Expecting empty array due to no images found
  });

  it('should handle URL navigation failure', async () => {

    const url = 'https://example.com';
    const robots: RobotsResponse = { 
      baseUrl: 'https://example.com',
      allowedPaths: [],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: true 
    };

    const mockPage = {
      goto: jest.fn().mockRejectedValue(new Error('Failed to navigate to URL')),
      close: jest.fn(),
    } as unknown as puppeteer.Page;

    const mockBrowser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn(),
    } as unknown as puppeteer.Browser;

    // Mock environment variables
    process.env.PROXY_USERNAME = 'username';
    process.env.PROXY_PASSWORD = 'password';

    const imageUrls = await scrapeImagesService.scrapeImages(url, robots, mockPage);

    expect(imageUrls).toEqual([]); // Expecting empty array due to navigation failure
  });

  it('should limit the number of images to 50', async () => {

    const url = 'https://example.com';
    const robots: RobotsResponse = { 
      baseUrl: 'https://example.com',
      allowedPaths: [],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: true 
    };

    const mockImages = Array(100).fill('/image.jpg');

    const mockPage = {
      goto: jest.fn().mockResolvedValue(undefined),
      evaluate: jest.fn().mockResolvedValue(mockImages),
      authenticate: jest.fn(),
      close: jest.fn(),
    } as unknown as puppeteer.Page;

    const mockBrowser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn(),
    } as unknown as puppeteer.Browser;

    // Mock environment variables
    process.env.PROXY_USERNAME = 'username';
    process.env.PROXY_PASSWORD = 'password';

    const imageUrls = await scrapeImagesService.scrapeImages(url, robots, mockPage);

    expect(imageUrls).toHaveLength(50); // Expecting only 50 images to be returned
  });

  // New Test: Handle Puppeteer newPage failure
  it('should handle puppeteer newPage failure', async () => {
    const url = 'https://example.com';
    const robots: RobotsResponse = { 
      baseUrl: 'https://example.com',
      allowedPaths: [],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: true 
    };

    const mockPage = {
      goto: jest.fn().mockResolvedValue(new Error('Failed to create new page')),
      evaluate: jest.fn().mockResolvedValue([]),
      authenticate: jest.fn(),
      close: jest.fn(),
    } as unknown as puppeteer.Page;

    const mockBrowser = {
      newPage: jest.fn().mockRejectedValue(new Error('Failed to create new page')),
      close: jest.fn(),
    } as unknown as puppeteer.Browser;

    // Mock environment variables
    process.env.PROXY_USERNAME = 'username';
    process.env.PROXY_PASSWORD = 'password';

    const imageUrls = await scrapeImagesService.scrapeImages(url, robots, mockPage);

    expect(imageUrls).toEqual([]); // Expecting empty array due to newPage failure
  });

  // New Test: Handle page.evaluate failure
  it('should handle page.evaluate failure', async () => {
    
    const url = 'https://example.com';
    const robots: RobotsResponse = { 
      baseUrl: 'https://example.com',
      allowedPaths: [],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: true 
    };

    const mockPage = {
      goto: jest.fn().mockResolvedValue(undefined),
      evaluate: jest.fn().mockRejectedValue(new Error('Failed to evaluate')),
      authenticate: jest.fn(),
      close: jest.fn(),
    } as unknown as puppeteer.Page;

    const mockBrowser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn(),
    } as unknown as puppeteer.Browser;

    // Mock environment variables
    process.env.PROXY_USERNAME = 'username';
    process.env.PROXY_PASSWORD = 'password';

    const imageUrls = await scrapeImagesService.scrapeImages(url, robots, mockPage);

    expect(imageUrls).toEqual([]); // Expecting empty array due to evaluate failure
  });
});
