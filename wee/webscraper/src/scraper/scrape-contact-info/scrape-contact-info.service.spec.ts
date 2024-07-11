import { Test, TestingModule } from '@nestjs/testing';
import { ScrapeContactInfoService } from './scrape-contact-info.service';
import { RobotsResponse } from '../models/ServiceModels';
import * as puppeteer from 'puppeteer';

jest.mock('puppeteer');
const mockedPuppeteer = puppeteer as jest.Mocked<typeof puppeteer>;

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

    // Mocking puppeteer launch to simulate an error
    mockedPuppeteer.launch.mockRejectedValue(new Error('Mocked error'));

    const result = await service.scrapeContactInfo(url, robots);
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

    const browser = {
      newPage: jest.fn().mockResolvedValue({
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
        close: jest.fn(),
      }),
      close: jest.fn(),
    };
    mockedPuppeteer.launch.mockResolvedValue(browser as any);

    const result = await service.scrapeContactInfo(url, robots);

    expect(result.emails).toContain('contact@example.com');
    expect(result.phones).toContain('+1-800-555-1234');
    expect(result.socialLinks).toContain('https://facebook.com/example');
    expect(result.socialLinks).toContain('https://twitter.com/example');
    expect(browser.newPage).toHaveBeenCalledTimes(1);
    expect(browser.close).toHaveBeenCalledTimes(1);
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

    const result = await service.scrapeContactInfo(url, robots);
    expect(result).toEqual({ emails: [], phones: [], socialLinks: [] });
  });
});
