import { Test, TestingModule } from '@nestjs/testing';
import { ScrapeContactInfoService } from './scrape-contact-info.service';
import { RobotsResponse } from '../models/ServiceModels';
import * as puppeteer from 'puppeteer';

jest.mock('puppeteer');

describe('ScrapeContactInfoService', () => {
  let service: ScrapeContactInfoService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [ScrapeContactInfoService],
    }).compile();

    service = module.get<ScrapeContactInfoService>(ScrapeContactInfoService);
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

    const mockPage = {
      goto: jest.fn().mockRejectedValue(new Error('Failed to navigate to page')),
      close: jest.fn(),
    } as unknown as puppeteer.Page;

    // Mock environment variables
    process.env.PROXY_USERNAME = 'username';
    process.env.PROXY_PASSWORD = 'password';

    const result = await service.scrapeContactInfo(url, robots, mockPage);
    expect(result).toEqual({ emails: [], phones: [], socialLinks: [] });
  });

  it('should scrape contact information from the page', async () => {
    const url = 'https://example.com';
    const robots: RobotsResponse = {
      baseUrl: 'http://example.com',
      allowedPaths: ['/'],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: true,
    };

    const pageContent = `
      Contact us at contact@example.com or call us at +1-800-555-1234.
      Follow us on Facebook and Twitter.
    `;
    const links = [
      'https://facebook.com/example',
      'https://twitter.com/example',
      'https://example.com/other'
    ];

    const mockEmails = ['contact@example.com'];
    const mockPhones = ['+1-800-555-1234'];
    const mockSocialLinks = [
      'https://facebook.com/example',
      'https://twitter.com/example'
    ];

    const mockPage = {
      goto: jest.fn(),
        evaluate: jest.fn()
          .mockImplementation((fn: () => any) => {
            if (fn.toString().includes('document.body.innerText')) {
              return Promise.resolve(pageContent);
            } else if (fn.toString().includes('Array.from(document.querySelectorAll')) {
              return Promise.resolve(links);
            }
            return Promise.resolve([]);
          }),
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

    const result = await service.scrapeContactInfo(url, robots, mockPage);

    expect(result.emails).toContain('contact@example.com');
    expect(result.phones).toContain('+1-800-555-1234');
    expect(result.socialLinks).toContain('https://facebook.com/example');
    expect(result.socialLinks).toContain('https://twitter.com/example');
  });

  it('should return empty arrays if URL is not scrapable', async () => {
    const url = 'https://example.com';
    const robots: RobotsResponse = {
      baseUrl: 'http://example.com',
      allowedPaths: ['/'],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: false,
    };

    const result = await service.scrapeContactInfo(url, robots, null);
    expect(result).toEqual({ emails: [], phones: [], socialLinks: [] });
  });
});
