import { Test, TestingModule } from '@nestjs/testing';
import { ScreenshotService } from './screenshot.service';
import * as puppeteer from 'puppeteer';
import { RobotsResponse } from '../models/ServiceModels';

jest.mock('puppeteer');

describe('ScreenshotService', () => {
  let service: ScreenshotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScreenshotService],
    }).compile();

    service = module.get<ScreenshotService>(ScreenshotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('captureScreenshot', () => {
    const mockUrl = 'http://example.com';
    const mockRobotsAllow: RobotsResponse = {
      isUrlScrapable: true,
      baseUrl: '',
      allowedPaths: [],
      disallowedPaths: [],
      isBaseUrlAllowed: false
    };
    const mockRobotsDisallow: RobotsResponse = {
      isUrlScrapable: false,
      baseUrl: '',
      allowedPaths: [],
      disallowedPaths: [],
      isBaseUrlAllowed: false
    };

    it('should capture screenshot for a scrapable URL', async () => {
      const mockScreenshot = 'mock-base64-screenshot';
      const screenshotBuffer = Buffer.from(mockScreenshot, 'base64');

      // Mock puppeteer behavior
      (puppeteer.launch as jest.Mock).mockResolvedValue({
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn().mockResolvedValue(undefined),
          screenshot: jest.fn().mockResolvedValue(screenshotBuffer), // Return the Buffer directly
        }),
        close: jest.fn().mockResolvedValue(undefined),
      });

      const result = await service.captureScreenshot(mockUrl, mockRobotsAllow);

      expect(result).toBeDefined();
      expect(result.screenshot).toBe(mockScreenshot); // Compare base64 strings
    });


    it('should throw error for a non-scrapable URL', async () => {
      try {
        await service.captureScreenshot(mockUrl, mockRobotsDisallow);
        // If it doesn't throw an error, fail the test
        fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).toBe('Crawling not allowed for this URL');
      }
    });
  });
});
