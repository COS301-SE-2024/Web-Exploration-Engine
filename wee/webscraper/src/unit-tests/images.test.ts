import { Test, TestingModule } from '@nestjs/testing';
import { ScrapingService } from '../images-app/images.service'; 
import * as puppeteer from 'puppeteer';
import { HttpException, HttpStatus } from '@nestjs/common';

jest.mock('axios');

jest.mock('puppeteer');
const mockedPuppeteer = puppeteer as jest.Mocked<typeof puppeteer>;

jest.mock('../images-app/robot', () => ({
  isCrawlingAllowed: jest.fn(),
}));
import { isCrawlingAllowed } from '../images-app/robot'; 
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

    await expect(service.scrapeImages('http://example.com')).rejects.toThrow(
      new HttpException('Crawling not allowed or robots.txt not accessible.', HttpStatus.FORBIDDEN),
    );
  });
  /**
   * Test that an array of image URLs is returned when images are found.
   */
  it('should return an array of image URLs', async () => {
    mockedIsCrawlingAllowed.mockResolvedValueOnce(true);

    const browser = {
      newPage: jest.fn().mockResolvedValue({
        goto: jest.fn(),
        evaluate: jest.fn().mockResolvedValue(['http://example.com/image1.png', 'http://example.com/image2.png']),
        close: jest.fn(),
      }),
      close: jest.fn(),
    };
    mockedPuppeteer.launch.mockResolvedValue(browser as any);

    const result = await service.scrapeImages('http://example.com');
    expect(result).toEqual(['http://example.com/image1.png', 'http://example.com/image2.png']);
    expect(browser.newPage).toHaveBeenCalledTimes(1);
    expect(browser.close).toHaveBeenCalledTimes(1);
  });
  /**
   * Test that an empty array is returned if no images are found.
   */
  it('should return an empty array if no images are found', async () => {
    mockedIsCrawlingAllowed.mockResolvedValueOnce(true);

    const browser = {
      newPage: jest.fn().mockResolvedValue({
        goto: jest.fn(),
        evaluate: jest.fn().mockResolvedValue([]),
        close: jest.fn(),
      }),
      close: jest.fn(),
    };
    mockedPuppeteer.launch.mockResolvedValue(browser as any);

    const result = await service.scrapeImages('http://example.com');
    expect(result).toEqual([]);
    expect(browser.newPage).toHaveBeenCalledTimes(1);
    expect(browser.close).toHaveBeenCalledTimes(1);
  });
  /**
  *Test that an exception is thrown if scraping fails.
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

    await expect(service.scrapeImages('http://example.com')).rejects.toThrow(
      new HttpException('Failed to scrape images: Page not found', HttpStatus.INTERNAL_SERVER_ERROR),
    );
  });
});
