/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { ScrapeAddressService } from './scrape-address.service';
import { RobotsResponse } from '../models/ServiceModels';
import * as puppeteer from 'puppeteer';
import { mock } from 'node:test';

describe('ScrapeAddressService', () => {
  let service: ScrapeAddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScrapeAddressService],
    }).compile();

    service = module.get<ScrapeAddressService>(ScrapeAddressService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should scrape addresses from the page', async () => {
    const url = 'https://example.com';
    const robots = {
      baseUrl: 'http://example.com',
      allowedPaths: ['/'],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: true,
    };

    const mockAddresses = ['123 Main Street, Springfield, IL', '456 Elm Street, Springfield, IL'];

    const mockPage = {
      goto: jest.fn().mockResolvedValue(undefined),
      evaluate: jest.fn().mockResolvedValue(mockAddresses),
      authenticate: jest.fn(),
      close: jest.fn(),
    } as unknown as puppeteer.Page;

    const mockBrowser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn(),
    } as unknown as puppeteer.Browser;

    // Mock environment variables
    process.env.PROXY_USERNAME = 'username';
    process.env.PROXY_PASSWORD = 'password';

    const result = await service.scrapeAddress(url, robots, mockPage);

    expect(result.addresses).toContain('123 Main Street, Springfield, IL');
    expect(result.addresses).toContain('456 Elm Street, Springfield, IL');
  });

  it('should return empty addresses if crawling is not allowed', async () => {
    const url = 'https://example.com';
    const robots = {
      baseUrl: 'http://example.com',
      allowedPaths: ['/'],
      disallowedPaths: [],
      isBaseUrlAllowed: false,
      isUrlScrapable: true,
    };

    const result = await service.scrapeAddress(url, robots, {} as puppeteer.Page);

    expect(result.addresses).toEqual([]);
  });

  it('should return empty addresses if proxy credentials are missing', async () => {
    const url = 'https://example.com';
    const robots = {
      baseUrl: 'http://example.com',
      allowedPaths: ['/'],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: true,
    };

    delete process.env.PROXY_USERNAME;
    delete process.env.PROXY_PASSWORD;

    const mockPage = {} as puppeteer.Page;

    const result = await service.scrapeAddress(url, robots, mockPage);

    expect(result.addresses).toEqual([]);
  });

  it('should handle errors and return empty addresses', async () => {
    const url = 'https://example.com';
    const robots = {
      baseUrl: 'http://example.com',
      allowedPaths: ['/'],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: true,
    };

    const mockPage = {
      goto: jest.fn().mockRejectedValue(new Error('Page navigation error')),
      evaluate: jest.fn(),
      authenticate: jest.fn(),
      close: jest.fn(),
    } as unknown as puppeteer.Page;

    const mockBrowser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn(),
    } as unknown as puppeteer.Browser;

    const result = await service.scrapeAddress(url, robots, mockPage);

    expect(result.addresses).toEqual([]);
  });

    it('should filter out addresses containing blacklisted words', async () => {
    const url = 'https://example.com';
    const robots: RobotsResponse = {
      baseUrl: 'http://example.com',
      allowedPaths: ['/'],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: true,
    };

    const mockAddresses = ['123 Main Street, Springfield, IL', '456 Country Road, Springfield, IL'];
    // Mock browser and page
    const mockPage = {
      goto: jest.fn(),
      evaluate: jest.fn().mockResolvedValue(mockAddresses),
      authenticate: jest.fn(),
      close: jest.fn(),
    }as unknown as puppeteer.Page;

    const browser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn(),
    } as unknown as puppeteer.Browser;

    // Mock environment variables
    process.env.PROXY_USERNAME = 'username';
    process.env.PROXY_PASSWORD = 'password';

    const result = await service.scrapeAddress(url, robots, mockPage);
    expect(result.addresses).toContain('123 Main Street, Springfield, IL');
    expect(result.addresses).not.toContain('456 Country Road, Springfield, IL');
  });

  it('should remove newline characters from addresses', async () => {
    const url = 'https://example.com';
    const robots: RobotsResponse = {
      baseUrl: 'http://example.com',
      allowedPaths: ['/'],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: true,
    };

    const mockAddresses = ['123 Main Street, Springfield, IL'];

    const mockPage = {
      goto: jest.fn(),
      evaluate: jest.fn().mockResolvedValue(mockAddresses),
      authenticate: jest.fn(),
      close: jest.fn(),
    } as unknown as puppeteer.Page;
    const browser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn(),
    } as unknown as puppeteer.Browser;

    // Mock environment variables
    process.env.PROXY_USERNAME = 'username';
    process.env.PROXY_PASSWORD = 'password';

    const result = await service.scrapeAddress(url, robots, mockPage);

    expect(result.addresses).toContain('123 Main Street, Springfield, IL');
  });

  it('should return empty array if no addresses are found', async () => {
    const url = 'https://example.com';
    const robots: RobotsResponse = {
      baseUrl: 'http://example.com',
      allowedPaths: ['/'],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: true,
    };

    const mockAddresses = [];
    const mockPage = {
      goto: jest.fn(),
      evaluate: jest.fn().mockResolvedValue(mockAddresses),
      authenticate: jest.fn(),
      close: jest.fn(),
    } as unknown as puppeteer.Page;
    const browser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn(),
    } as unknown as puppeteer.Browser;

    // Mock environment variables
    process.env.PROXY_USERNAME = 'username';
    process.env.PROXY_PASSWORD = 'password';

    const result = await service.scrapeAddress(url, robots, mockPage);

    expect(result.addresses).toEqual([]);
  });

  it('should correctly match addresses with various formats', async () => {
    const url = 'https://example.com';
    const robots: RobotsResponse = {
      baseUrl: 'http://example.com',
      allowedPaths: ['/'],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: true,
    };

    const mockAddresses = [
      '123 Main Street',
      '456 Elm St, Springfield, IL',
      '789 Oak Avenue, Springfield',
      '101 Maple Blvd, Springfield'
    ];
    const mockPage = {
      goto: jest.fn(),
      evaluate: jest.fn().mockResolvedValue(mockAddresses),
      authenticate: jest.fn(),
      close: jest.fn(),
    } as unknown as puppeteer.Page;
    const browser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn(),
    } as unknown as puppeteer.Browser;

    // Mock environment variables
    process.env.PROXY_USERNAME = 'username';
    process.env.PROXY_PASSWORD = 'password';

    const result = await service.scrapeAddress(url, robots, mockPage);

    expect(result.addresses).toContain('123 Main Street');
    expect(result.addresses).toContain('456 Elm St, Springfield, IL');
    expect(result.addresses).toContain('789 Oak Avenue, Springfield');
    expect(result.addresses).toContain('101 Maple Blvd, Springfield');
  });

  it('should handle edge cases in address pattern matching', async () => {
    const url = 'https://example.com';
    const robots: RobotsResponse = {
      baseUrl: 'http://example.com',
      allowedPaths: ['/'],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: true,
    };
    const pageContent = `
      Address: 123
      Street: Main Street
      Address: 456-A Elm Street, Springfield, IL
      PO Box: 789
      Address: 101 Maple Boulevard, Springfield
    `;
    const mockAddresses = [
      '456-A Elm Street, Springfield, IL',
      '101 Maple Boulevard, Springfield'
    ];

    const mockPage = {
      goto: jest.fn(),
      evaluate: jest.fn().mockResolvedValue(mockAddresses),
      authenticate: jest.fn(),
      close: jest.fn(),
    } as unknown as puppeteer.Page;
    const browser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn(),
    } as unknown as puppeteer.Browser;

    // Mock environment variables
    process.env.PROXY_USERNAME = 'username';
    process.env.PROXY_PASSWORD = 'password';

    const result = await service.scrapeAddress(url, robots, mockPage);

    expect(result.addresses).toContain('456-A Elm Street, Springfield, IL');
    expect(result.addresses).toContain('101 Maple Boulevard, Springfield');
  });
  it('should extract and match addresses from page content', async () => {
    const url = 'https://example.com';
    const robots: RobotsResponse = {
      baseUrl: 'http://example.com',
      allowedPaths: ['/'],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: true,
    };

    const pageContent = `
      Here are some addresses:
      123 Main Street, Springfield, IL
      456 Elm St, Springfield, IL
      789 Oak Avenue, Springfield
      101 Maple Blvd, Springfield
    `;

    const mockAddresses = [
      '123 Main Street, Springfield, IL',
      '456 Elm St, Springfield, IL',
      '789 Oak Avenue, Springfield',
      '101 Maple Blvd, Springfield',
    ];

    const mockPage = {
      goto: jest.fn(),
      evaluate: jest.fn().mockResolvedValue(mockAddresses),
      authenticate: jest.fn(),
      close: jest.fn(),
    } as unknown as puppeteer.Page;
    const browser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn(),
    } as unknown as puppeteer.Browser;

    // Mock environment variables
    process.env.PROXY_USERNAME = 'username';
    process.env.PROXY_PASSWORD = 'password';

    const result = await service.scrapeAddress(url, robots, mockPage);

    expect(result.addresses).toContain('123 Main Street, Springfield, IL');
    expect(result.addresses).toContain('456 Elm St, Springfield, IL');
    expect(result.addresses).toContain('789 Oak Avenue, Springfield');
    expect(result.addresses).toContain('101 Maple Blvd, Springfield');
  });

  it('should handle address extraction with inner text correctly', async () => {
    const url = 'https://example.com';
    const robots: RobotsResponse = {
      baseUrl: 'http://example.com',
      allowedPaths: ['/'],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: true,
    };

    const mockPageContent = [
      '123 Main Street, Springfield, IL',
      '456 Elm St, Springfield, IL',
      '789 Oak Avenue, Springfield',
      '101 Maple Blvd, Springfield',
    ];

    const mockPage = {
      goto: jest.fn(),
      evaluate: jest.fn().mockResolvedValue(mockPageContent),
      authenticate: jest.fn(),
      close: jest.fn(),
    } as unknown as puppeteer.Page;

    const browser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn(),
    } as unknown as puppeteer.Browser;

    // Mock environment variables
    process.env.PROXY_USERNAME = 'username';
    process.env.PROXY_PASSWORD = 'password';

    const result = await service.scrapeAddress(url, robots, mockPage);

    expect(result.addresses).toContain('123 Main Street, Springfield, IL');
    expect(result.addresses).toContain('456 Elm St, Springfield, IL');
    expect(result.addresses).toContain('789 Oak Avenue, Springfield');
    expect(result.addresses).toContain('101 Maple Blvd, Springfield');
  });
});
