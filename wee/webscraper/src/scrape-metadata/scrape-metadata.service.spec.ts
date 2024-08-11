import { Test, TestingModule } from '@nestjs/testing';
import { ScrapeMetadataService } from './scrape-metadata.service';
import * as puppeteer from 'puppeteer';
import { JSDOM } from 'jsdom';

jest.mock('axios');

describe('scrapeMetadata', () => {
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

  it('should return an error response if the root URL is not scrapable', async () => {
    const mockData = {
      baseUrl: 'http://example.com',
      allowedPaths: [],
      disallowedPaths: [],
      isBaseUrlAllowed: false,
      isUrlScrapable: false,
    };

    const result = await service.scrapeMetadata('http://example.com', mockData, null);
    expect(result).toEqual({
      errorStatus: 403,
      errorCode: '403 Forbidden',
      errorMessage: 'Not allowed to scrape root URL for metadata',
    });
  });

  it('should return metadata if crawling is allowed', async () => {
    const mockData = {
      baseUrl: 'http://example.com',
      allowedPaths: [],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: true,
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
        authenticate: jest.fn(),
        close: jest.fn(),
      }),
      close: jest.fn(),
    } as unknown as puppeteer.Browser;

    // Mock environment variables
    process.env.PROXY_USERNAME = 'username';
    process.env.PROXY_PASSWORD = 'password';

    const result = await service.scrapeMetadata('http://example.com', mockData, browser);
    expect(result).toEqual({
      title: 'Example Title',
      description: 'Example Description',
      keywords: 'example, keywords',
      ogTitle: 'OG Example Title',
      ogDescription: 'OG Example Description',
      ogImage: 'http://example.com/image.png',
    });
    expect(browser.newPage).toHaveBeenCalledTimes(1);
  });

  it('should return an error response if scraping fails', async () => {
    const mockData = {
      baseUrl: 'http://example.com',
      allowedPaths: [],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: false,
    };

    const browser = {
      newPage: jest.fn().mockResolvedValue({
        goto: jest.fn().mockImplementation(() => {
          throw new Error('Page not found');
        }),
        close: jest.fn(),
        authenticate: jest.fn(),
      }),
      close: jest.fn(),
    } as unknown as puppeteer.Browser;

    // Mock environment variables
    process.env.PROXY_USERNAME = 'username';
    process.env.PROXY_PASSWORD = 'password';

    const response = await service.scrapeMetadata('http://example.com', mockData, browser);
    expect(response).toEqual({
      errorStatus: 500,
      errorCode: '500 Internal Server Error',
      errorMessage: 'Error scraping metadata: Page not found',
    });
  });

  it('should handle missing metadata fields', async () => {
    const mockData = {
      baseUrl: 'http://example.com',
      allowedPaths: [],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: false,
    };

    const browser = {
      newPage: jest.fn().mockResolvedValue({
        goto: jest.fn(),
        evaluate: jest.fn().mockResolvedValue({
          title: 'Example Title',
          description: null,
          keywords: null,
          ogTitle: null,
          ogDescription: null,
          ogImage: null,
        }),
        close: jest.fn(),
        authenticate: jest.fn(),
      }),
      close: jest.fn(),
    } as unknown as puppeteer.Browser;

    // Mock environment variables
    process.env.PROXY_USERNAME = 'username';
    process.env.PROXY_PASSWORD = 'password';

    const result = await service.scrapeMetadata('http://example.com', mockData, browser);
    expect(result).toEqual({
      title: 'Example Title',
      description: null,
      keywords: null,
      ogTitle: null,
      ogDescription: null,
      ogImage: null,
    });
    expect(browser.newPage).toHaveBeenCalledTimes(1);
  });

  it('should handle empty response from page.evaluate', async () => {
    const mockData = {
      baseUrl: 'http://example.com',
      allowedPaths: [],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: false,
    };

    const browser = {
      newPage: jest.fn().mockResolvedValue({
        goto: jest.fn(),
        evaluate: jest.fn().mockResolvedValue(null),
        close: jest.fn(),
        authenticate: jest.fn(),
      }),
      close: jest.fn(),
    } as unknown as puppeteer.Browser;

    // Mock environment variables
    process.env.PROXY_USERNAME = 'username';
    process.env.PROXY_PASSWORD = 'password';

    const result = await service.scrapeMetadata('http://example.com', mockData, browser);
    expect(result).toEqual({
      title: null,
      description: null,
      keywords: null,
      ogTitle: null,
      ogDescription: null,
      ogImage: null,
    });
    expect(browser.newPage).toHaveBeenCalledTimes(1);
  });

  it('should handle failure to launch puppeteer', async () => {
    const mockData = {
      baseUrl: 'http://example.com',
      allowedPaths: [],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: false,
    };

    const browser = {
      newPage: jest.fn().mockRejectedValue(new Error('Failed to launch')),
      close: jest.fn(),
    } as unknown as puppeteer.Browser;

    // Mock environment variables
    process.env.PROXY_USERNAME = 'username';
    process.env.PROXY_PASSWORD = 'password';

    const response = await service.scrapeMetadata('http://example.com', mockData, browser);
    expect(response).toEqual({
      errorStatus: 500,
      errorCode: '500 Internal Server Error',
      errorMessage: 'Error scraping metadata: Failed to launch',
    });
  });
});

describe('getMetaTagContent', () => {
  let service: ScrapeMetadataService;
  let dom: JSDOM;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScrapeMetadataService],
    }).compile();

    service = module.get<ScrapeMetadataService>(ScrapeMetadataService);

    dom = new JSDOM(`<!DOCTYPE html><head></head><body></body></html>`);
    global.document = dom.window.document;
  });

  it('should return content of meta tag by name', () => {
    const meta = document.createElement('meta');
    meta.name = 'description';
    meta.content = 'Example Description';
    document.head.appendChild(meta);

    expect(service.getMetaTagContent('description')).toBe('Example Description');
  });

  it('should return content of meta tag by property', () => {
    const meta = document.createElement('meta');
    meta.setAttribute('property', 'og:title');
    meta.content = 'OG Example Title';
    document.head.appendChild(meta);

    expect(service.getMetaTagContent('title')).toBe('OG Example Title');
  });

  it('should return null if meta tag is not found', () => {
    expect(service.getMetaTagContent('nonexistent')).toBeNull();
  });


});
