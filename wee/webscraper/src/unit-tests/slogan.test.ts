import { Test, TestingModule } from '@nestjs/testing';
import { SloganService } from '../slogan-app/slogan.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

jest.mock('../slogan-app/robot', () => ({
  isCrawlingAllowed: jest.fn(),
}));
import { isCrawlingAllowed } from '../slogan-app/robot';
const mockedIsCrawlingAllowed = isCrawlingAllowed as jest.MockedFunction<typeof isCrawlingAllowed>;

jest.mock('puppeteer');
const mockedPuppeteer = puppeteer as jest.Mocked<typeof puppeteer>;

describe('SloganService', () => {
  let service: SloganService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SloganService],
    }).compile();

    service = module.get<SloganService>(SloganService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw an exception if crawling is not allowed', async () => {
    mockedIsCrawlingAllowed.mockResolvedValueOnce(false);

    await expect(service.scrapeSlogans('http://example.com')).rejects.toThrow(
      new HttpException('Crawling not allowed or robots.txt not accessible.', HttpStatus.FORBIDDEN),
    );
  });

  it('should return slogans extracted from metadata', async () => {
    mockedIsCrawlingAllowed.mockResolvedValueOnce(true);
  
    const metadata = {
      title: 'Sample Title',
      description: 'Sample Description',
      keywords: 'sample, keywords',
    };
  
    const browser = {
      newPage: jest.fn().mockResolvedValue({
        goto: jest.fn(),
        evaluate: jest.fn().mockResolvedValue(metadata),
        close: jest.fn(),
      }),
      close: jest.fn(),
    };
    mockedPuppeteer.launch.mockResolvedValue(browser as any);
  
    const result = await service.scrapeSlogans('http://example.com');
    expect(result).toEqual(['Sample Title']);
    expect(browser.newPage).toHaveBeenCalledTimes(1);
    expect(browser.close).toHaveBeenCalledTimes(1);
  });
  

  it('should handle empty metadata', async () => {
    mockedIsCrawlingAllowed.mockResolvedValueOnce(true);

    const browser = {
      newPage: jest.fn().mockResolvedValue({
        goto: jest.fn(),
        evaluate: jest.fn().mockResolvedValue({}),
        close: jest.fn(),
      }),
      close: jest.fn(),
    };
    mockedPuppeteer.launch.mockResolvedValue(browser as any);

    const result = await service.scrapeSlogans('http://example.com');
    expect(result).toEqual([]);
    expect(browser.newPage).toHaveBeenCalledTimes(1);
    expect(browser.close).toHaveBeenCalledTimes(1);
  });

  it('should handle errors during scraping', async () => {
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

    await expect(service.scrapeSlogans('http://example.com')).rejects.toThrow(
      new HttpException('Failed to scrape slogans: Page not found', HttpStatus.INTERNAL_SERVER_ERROR),
    );
  });
  
});
