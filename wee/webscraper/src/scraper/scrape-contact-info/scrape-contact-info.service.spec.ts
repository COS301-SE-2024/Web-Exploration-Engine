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

    try {
      await service.scrapeContactInfo(url, robots);
    } catch (error) {
      expect(error.message).toBe('Mocked error');
    }
  });

  it('should scrape emails and phones when URL is scrapable', async () => {
    const url = 'https://example.com';
    const robots: RobotsResponse = {
      baseUrl: 'http://example.com',
      allowedPaths: ['/'],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: true,
    };
  
    const pageContent = `
      Contact us:
      Email: test@example.com
      Phone: 123-456-7890
    `;
    const browser = {
      newPage: jest.fn().mockResolvedValue({
        goto: jest.fn(),
        evaluate: jest.fn().mockResolvedValue(pageContent),
        close: jest.fn(),
      }),
      close: jest.fn(),
    };
    mockedPuppeteer.launch.mockResolvedValue(browser as any);
  
    const result = await service.scrapeContactInfo(url, robots);
  
    expect(result.emails).toContain('test@example.com');
    expect(result.phones).toContain('123-456-7890');
    expect(browser.newPage).toHaveBeenCalledTimes(1);
    expect(browser.close).toHaveBeenCalledTimes(1);
  });
  
});
