import { Test, TestingModule } from '@nestjs/testing';
import { ScrapingService } from '../images-app/scraping.service'; // Adjust the import path
import * as puppeteer from 'puppeteer';
import { HttpException, HttpStatus } from '@nestjs/common';

jest.mock('axios');


jest.mock('puppeteer');
const mockedPuppeteer = puppeteer as jest.Mocked<typeof puppeteer>;

jest.mock('../images-app/robot', () => ({
  isCrawlingAllowed: jest.fn(),
}));
import { isCrawlingAllowed } from '../images-app/robot'; // Adjust the import path
const mockedIsCrawlingAllowed = isCrawlingAllowed as jest.MockedFunction<typeof isCrawlingAllowed>;

describe('ScrapingService', () => {
  let service: ScrapingService;
  /**
   * Setup the testing module and initialize the ScrapingService before each test.
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScrapingService],
    }).compile();

    service = module.get<ScrapingService>(ScrapingService);
  });
  /**
   * Test if the ScrapingService is defined.
   */
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  /**
   * Test that an exception is thrown if crawling is not allowed.
   */
  it('should throw an exception if crawling is not allowed', async () => {
    mockedIsCrawlingAllowed.mockResolvedValueOnce(false);

    await expect(service.scrapeLogos('http://example.com')).rejects.toThrow(
      new HttpException('Crawling not allowed or robots.txt not accessible.', HttpStatus.FORBIDDEN),
    );
  });
  /**
   * Test that the ogImage is returned if it contains "logo".
   */
  it('should return ogImage if it contains "logo"', async () => {
    mockedIsCrawlingAllowed.mockResolvedValueOnce(true);

    const browser = {
      newPage: jest.fn().mockResolvedValue({
        goto: jest.fn(),
        evaluate: jest.fn().mockResolvedValue({ ogImage: 'http://example.com/logo.png' }),
        close: jest.fn(),
      }),
      close: jest.fn(),
    };
    mockedPuppeteer.launch.mockResolvedValue(browser as any);

    const result = await service.scrapeLogos('http://example.com');
    expect(result).toBe('http://example.com/logo.png');
    expect(browser.newPage).toHaveBeenCalledTimes(1);
    expect(browser.close).toHaveBeenCalledTimes(1);
  });
  /**
   * Test that the first image URL matching the pattern "logo" is returned.
   */
  it('should return first image URL that matches the pattern "logo"', async () => {
    mockedIsCrawlingAllowed.mockResolvedValueOnce(true);

    const browser = {
      newPage: jest.fn().mockResolvedValue({
        goto: jest.fn(),
        evaluate: jest.fn()
          .mockResolvedValueOnce({ ogImage: null })
          .mockResolvedValueOnce(['http://example.com/logo1.png', 'http://example.com/logo2.png']),
        close: jest.fn(),
      }),
      close: jest.fn(),
    };
    mockedPuppeteer.launch.mockResolvedValue(browser as any);

    const result = await service.scrapeLogos('http://example.com');
    expect(result).toBe('http://example.com/logo1.png');
    expect(browser.newPage).toHaveBeenCalledTimes(1);
    expect(browser.close).toHaveBeenCalledTimes(1);
  });
  /**
   * Test that null is returned if no logo is found.
   */
  it('should return null if no logo is found', async () => {
    mockedIsCrawlingAllowed.mockResolvedValueOnce(true);

    const browser = {
      newPage: jest.fn().mockResolvedValue({
        goto: jest.fn(),
        evaluate: jest.fn()
          .mockResolvedValueOnce({ ogImage: null })
          .mockResolvedValueOnce([]),
        close: jest.fn(),
      }),
      close: jest.fn(),
    };
    mockedPuppeteer.launch.mockResolvedValue(browser as any);

    const result = await service.scrapeLogos('http://example.com');
    expect(result).toBeNull();
    expect(browser.newPage).toHaveBeenCalledTimes(1);
    expect(browser.close).toHaveBeenCalledTimes(1);
  });
  /**
  * Test that an exception is thrown if scraping fails.
  */
  it('should throw an exception if scraping fails', async () => {
    mockedIsCrawlingAllowed.mockResolvedValueOnce(true);

    const browser = {
      newPage: jest.fn().mockResolvedValue({
        goto: jest.fn().mockImplementation(() => {
          throw new Error('Page not found');
        }),
        close: jest.fn(),
      }),
      close: jest.fn(),
    };
    mockedPuppeteer.launch.mockResolvedValue(browser as any);

    await expect(service.scrapeLogos('http://example.com')).rejects.toThrow(
      new HttpException('Failed to scrape logos: Page not found', HttpStatus.INTERNAL_SERVER_ERROR),
    );
  });
});
