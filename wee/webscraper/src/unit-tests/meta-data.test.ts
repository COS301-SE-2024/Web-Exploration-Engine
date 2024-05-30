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

    await expect(service.scrapeMetadata('http://example.com')).rejects.toThrow(
      new HttpException('Crawling not allowed or robots.txt not accessible.', HttpStatus.FORBIDDEN),
    );
  });

  it('should return metadata if crawling is allowed', async () => {
    mockedIsCrawlingAllowed.mockResolvedValueOnce(true);

    const browser = {
      newPage: jest.fn().mockResolvedValue({
        goto: jest.fn(),
        evaluate: jest.fn().mockResolvedValue({
          title: 'Example Title',
          description: 'Example Description',
          keywords: 'example, keywords',
          ogTitle: 'OG Example Title',
          ogDescription: 'OG Example Description',
          ogImage: 'http://example.com/image.png',
        }),
        close: jest.fn(),
      }),
      close: jest.fn(),
    };
    mockedPuppeteer.launch.mockResolvedValue(browser as any);

    const result = await service.scrapeMetadata('http://example.com');
    expect(result).toEqual({
      title: 'Example Title',
      description: 'Example Description',
      keywords: 'example, keywords',
      ogTitle: 'OG Example Title',
      ogDescription: 'OG Example Description',
      ogImage: 'http://example.com/image.png',
    });
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

    await expect(service.scrapeMetadata('http://example.com')).rejects.toThrow(
      new HttpException('Failed to scrape metadata: Page not found', HttpStatus.INTERNAL_SERVER_ERROR),
    );
  });
});
