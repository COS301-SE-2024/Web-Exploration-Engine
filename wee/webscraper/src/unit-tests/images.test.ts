import { Test, TestingModule } from '@nestjs/testing';
import { ScrapingService } from '../images-app/scraping.service'; 
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScrapingService],
    }).compile();

    service = module.get<ScrapingService>(ScrapingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw an exception if crawling is not allowed', async () => {
    mockedIsCrawlingAllowed.mockResolvedValueOnce(false);

    await expect(service.scrapeImages('http://example.com')).rejects.toThrow(
      new HttpException('Crawling not allowed or robots.txt not accessible.', HttpStatus.FORBIDDEN),
    );
  });

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
