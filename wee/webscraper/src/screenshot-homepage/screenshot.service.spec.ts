import { Test, TestingModule } from '@nestjs/testing';
import { ScreenshotService } from './screenshot.service';
import * as puppeteer from 'puppeteer';
import { RobotsResponse } from '../models/ServiceModels';

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

      const mockPage = {
        goto: jest.fn(),
        screenshot: jest.fn().mockResolvedValue(screenshotBuffer),
        authenticate: jest.fn(),
        close: jest.fn(),
      } as unknown as puppeteer.Page;

      const browser = {
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn(),
          screenshot: jest.fn().mockResolvedValue(screenshotBuffer),
          authenticate: jest.fn(),
          close: jest.fn(),
        }),
        close: jest.fn(),
      } as unknown as puppeteer.Browser;

      // Mock environment variables
      process.env.PROXY_USERNAME = 'username';
      process.env.PROXY_PASSWORD = 'password';

      const result = await service.captureScreenshot(mockUrl, mockRobotsAllow, mockPage);

      expect(result).toBeDefined();
      if ('screenshot' in result) {
        expect(Buffer.from(result.screenshot , 'base64')).toEqual(screenshotBuffer); // Compare buffers
      } else {
        throw new Error('Expected result to have a screenshot property');
      }
   });

    it('should return an eror response if URL is not scrapable', async () => {

      const mockPage = {
        goto: jest.fn(),
        screenshot: jest.fn(),
        authenticate: jest.fn(),
        close: jest.fn(),
      } as unknown as puppeteer.Page;
      
      const browser = {
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn(),
          screenshot: jest.fn(),
          authenticate: jest.fn(),
          close: jest.fn(),
        }),
        close: jest.fn(),
      } as unknown as puppeteer.Browser;

      // Mock environment variables
      process.env.PROXY_USERNAME = 'username';
      process.env.PROXY_PASSWORD = 'password';


      const result = await service.captureScreenshot(mockUrl, mockRobotsDisallow, mockPage);
      
      if ('errorMessage' in result) {
        expect(result.errorMessage).toBe('Not allowed to scrape this URL');
      } else {
        throw new Error('Expected result to have a message property');
      }
    });
  });
});
