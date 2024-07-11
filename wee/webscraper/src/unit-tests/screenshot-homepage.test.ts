import { ScreenshotService } from '../scraper/screenshot-homepage/screenshot.service';
import { RobotsResponse } from '../scraper/models/ServiceModels';
import puppeteer from 'puppeteer';

jest.mock('puppeteer');

describe('ScreenshotService', () => {
  let screenshotService: ScreenshotService;

  beforeEach(() => {
    screenshotService = new ScreenshotService();
  });

  it('should capture a screenshot', async () => {
    const url = 'https://example.com';
    const robots: RobotsResponse = {
      isUrlScrapable: true,
      baseUrl: '',
      allowedPaths: [],
      disallowedPaths: [],
      isBaseUrlAllowed: false
    };

    const mockScreenshot = 'mock-base64-screenshot';
    const screenshotBuffer = Buffer.from(mockScreenshot, 'base64');

    (puppeteer.launch as jest.Mock).mockResolvedValue({
      newPage: jest.fn().mockResolvedValue({
        goto: jest.fn().mockResolvedValue(undefined),
        screenshot: jest.fn().mockResolvedValue(screenshotBuffer),
      }),
      close: jest.fn().mockResolvedValue(undefined),
    });

    const result = await screenshotService.captureScreenshot(url, robots);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('screenshot');
    expect(typeof result.screenshot).toBe('string');
    expect(Buffer.from(result.screenshot, 'base64')).toEqual(screenshotBuffer);
  });

  it('should throw an error if URL is not scrapable', async () => {
    const url = 'https://example.com';
    const robots: RobotsResponse = {
      isUrlScrapable: false,
      baseUrl: '',
      allowedPaths: [],
      disallowedPaths: [],
      isBaseUrlAllowed: false
    };

    await expect(screenshotService.captureScreenshot(url, robots)).rejects.toThrow('Crawling not allowed for this URL');
  });


  it('should throw an error for network issues during navigation', async () => {
    const url = 'https://example.com';
    const robots: RobotsResponse = {
      isUrlScrapable: true,
      baseUrl: '',
      allowedPaths: [],
      disallowedPaths: [],
      isBaseUrlAllowed: false
    };

    (puppeteer.launch as jest.Mock).mockResolvedValue({
      newPage: jest.fn().mockResolvedValue({
        goto: jest.fn().mockRejectedValue(new Error('Network error')),
        screenshot: jest.fn().mockResolvedValue(Buffer.from('')),
      }),
      close: jest.fn().mockResolvedValue(undefined),
    });

    await expect(screenshotService.captureScreenshot(url, robots)).rejects.toThrow('Network error');
  });

});
