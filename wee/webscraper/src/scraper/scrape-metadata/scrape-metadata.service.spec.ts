import { Test, TestingModule } from '@nestjs/testing';
import { ScrapeMetadataService } from './scrape-metadata.service';
import * as puppeteer from 'puppeteer';
import { HttpException, HttpStatus } from '@nestjs/common';

jest.mock('axios');


jest.mock('puppeteer');
const mockedPuppeteer = puppeteer as jest.Mocked<typeof puppeteer>;

describe('ScrapeMetadataService', () => {
  let service: ScrapeMetadataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScrapeMetadataService],
    }).compile();

    service = module.get<ScrapeMetadataService>(ScrapeMetadataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw an exception if crawling is not allowed', async () => {
    const mockData = {
      isBaseUrlAllowed: false,
      baseUrl: 'http://example.com',
      allowedPaths: []
    };


    await expect(service.scrapeMetadata('http://example.com', mockData)).rejects.toThrow(
      new HttpException('Crawling not allowed or robots.txt not accessible.', HttpStatus.FORBIDDEN),
    );
  });

  it('should return metadata if crawling is allowed', async () => {
    const mockData = {
      isBaseUrlAllowed: true,
      baseUrl: 'http://example.com',
      allowedPaths: []
    };

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

    const result = await service.scrapeMetadata('http://example.com', mockData);
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
    const mockData = {
      isBaseUrlAllowed: true,
      baseUrl: 'http://example.com',
      allowedPaths: []
    };

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

    await expect(service.scrapeMetadata('http://example.com', mockData)).rejects.toThrow(
      new HttpException('Failed to scrape metadata: Page not found', HttpStatus.INTERNAL_SERVER_ERROR),
    );  
  });

  it ('should throw an exception if robots.txt is not accessible', async () => {
    const mockData = {
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Error fetching robots.txt'
    };

    await expect(service.scrapeMetadata('http://example.com', mockData)).rejects.toThrow(
      new HttpException('Error fetching robots.txt', HttpStatus.INTERNAL_SERVER_ERROR),
    );
  });
});
