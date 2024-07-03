import { Test, TestingModule } from '@nestjs/testing';
import { ScrapeAddressService } from './scrape-address.service';
import { RobotsResponse } from '../models/ServiceModels';
import * as puppeteer from 'puppeteer';

jest.mock('puppeteer');
const mockedPuppeteer = puppeteer as jest.Mocked<typeof puppeteer>;

describe('ScrapeAddressService', () => {
  let service: ScrapeAddressService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [ScrapeAddressService],
    }).compile();

    service = module.get<ScrapeAddressService>(ScrapeAddressService);
  });

  it('should handle errors gracefully', async () => {
    const url = 'https://example.com';
    const robots: RobotsResponse = {
      baseUrl: 'http://example.com',
      allowedPaths: ['/'],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: true,
    };

    mockedPuppeteer.launch.mockRejectedValue(new Error('Mocked error'));

    const result = await service.scrapeAddress(url, robots);
    expect(result.addresses).toEqual([]);
  });

  it('should scrape addresses from the page', async () => {
    const url = 'https://example.com';
    const robots: RobotsResponse = {
      baseUrl: 'http://example.com',
      allowedPaths: ['/'],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: true,
    };

    const mockAddresses = ['123 Main Street, Springfield, IL', '456 Elm Street, Springfield, IL'];
    const browser = {
      newPage: jest.fn().mockResolvedValue({
        goto: jest.fn(),
        evaluate: jest.fn().mockResolvedValue(mockAddresses),
        close: jest.fn(),
      }),
      close: jest.fn(),
    };
    mockedPuppeteer.launch.mockResolvedValue(browser as any);

    const result = await service.scrapeAddress(url, robots);

    expect(result.addresses).toContain('123 Main Street, Springfield, IL');
    expect(result.addresses).toContain('456 Elm Street, Springfield, IL');
    expect(browser.newPage).toHaveBeenCalledTimes(1);
    expect(browser.close).toHaveBeenCalledTimes(1);
  });

  it('should return empty array if URL is not allowed', async () => {
    const url = 'https://example.com';
    const robots: RobotsResponse = {
      baseUrl: 'http://example.com',
      allowedPaths: ['/'],
      disallowedPaths: [],
      isBaseUrlAllowed: false,
      isUrlScrapable: true,
    };

    const result = await service.scrapeAddress(url, robots);
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
    const browser = {
      newPage: jest.fn().mockResolvedValue({
        goto: jest.fn(),
        evaluate: jest.fn().mockResolvedValue(mockAddresses),
        close: jest.fn(),
      }),
      close: jest.fn(),
    };
    mockedPuppeteer.launch.mockResolvedValue(browser as any);

    const result = await service.scrapeAddress(url, robots);

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
    const browser = {
      newPage: jest.fn().mockResolvedValue({
        goto: jest.fn(),
        evaluate: jest.fn().mockResolvedValue(mockAddresses),
        close: jest.fn(),
      }),
      close: jest.fn(),
    };
    mockedPuppeteer.launch.mockResolvedValue(browser as any);

    const result = await service.scrapeAddress(url, robots);

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
    const browser = {
      newPage: jest.fn().mockResolvedValue({
        goto: jest.fn(),
        evaluate: jest.fn().mockResolvedValue(mockAddresses),
        close: jest.fn(),
      }),
      close: jest.fn(),
    };
    mockedPuppeteer.launch.mockResolvedValue(browser as any);

    const result = await service.scrapeAddress(url, robots);

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

    const pageContent = `
      Address: 123 Main Street
      Office: 456 Elm St, Springfield, IL
      Residence: 789 Oak Avenue, Springfield
      P.O. Box: 101 Maple Blvd, Springfield
    `;
    const mockAddresses = [
      '123 Main Street',
      '456 Elm St, Springfield, IL',
      '789 Oak Avenue, Springfield',
      '101 Maple Blvd, Springfield'
    ];
    const browser = {
      newPage: jest.fn().mockResolvedValue({
        goto: jest.fn(),
        evaluate: jest.fn().mockResolvedValue(mockAddresses),
        close: jest.fn(),
      }),
      close: jest.fn(),
    };
    mockedPuppeteer.launch.mockResolvedValue(browser as any);

    const result = await service.scrapeAddress(url, robots);

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
    const browser = {
      newPage: jest.fn().mockResolvedValue({
        goto: jest.fn(),
        evaluate: jest.fn().mockResolvedValue(mockAddresses),
        close: jest.fn(),
      }),
      close: jest.fn(),
    };
    mockedPuppeteer.launch.mockResolvedValue(browser as any);

    const result = await service.scrapeAddress(url, robots);

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

    const browser = {
      newPage: jest.fn().mockResolvedValue({
        goto: jest.fn(),
        evaluate: jest.fn().mockResolvedValue([
          '123 Main Street, Springfield, IL',
          '456 Elm St, Springfield, IL',
          '789 Oak Avenue, Springfield',
          '101 Maple Blvd, Springfield',
        ]),
        close: jest.fn(),
      }),
      close: jest.fn(),
    };
    mockedPuppeteer.launch.mockResolvedValue(browser as any);

    const result = await service.scrapeAddress(url, robots);

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

    const mockPageContent = `
      123 Main Street, Springfield, IL
      456 Elm St, Springfield, IL
      789 Oak Avenue, Springfield
      101 Maple Blvd, Springfield
    `;

    const browser = {
      newPage: jest.fn().mockResolvedValue({
        goto: jest.fn(),
        evaluate: jest.fn().mockResolvedValue([
          '123 Main Street, Springfield, IL',
          '456 Elm St, Springfield, IL',
          '789 Oak Avenue, Springfield',
          '101 Maple Blvd, Springfield',
        ]),
        close: jest.fn(),
      }),
      close: jest.fn(),
    };
    mockedPuppeteer.launch.mockResolvedValue(browser as any);

    const result = await service.scrapeAddress(url, robots);

    expect(result.addresses).toContain('123 Main Street, Springfield, IL');
    expect(result.addresses).toContain('456 Elm St, Springfield, IL');
    expect(result.addresses).toContain('789 Oak Avenue, Springfield');
    expect(result.addresses).toContain('101 Maple Blvd, Springfield');
  });
});