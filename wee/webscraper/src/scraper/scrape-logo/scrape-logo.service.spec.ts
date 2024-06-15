import { Test, TestingModule } from '@nestjs/testing';
import { ScrapeLogoService } from './scrape-logo.service';
import { Metadata, RobotsResponse } from '../models/ServiceModels';
import * as puppeteer from 'puppeteer';

jest.mock('axios');

jest.mock('puppeteer');
const mockedPuppeteer = puppeteer as jest.Mocked<typeof puppeteer>;

describe('ScrapeLogoService', () => {
  let service: ScrapeLogoService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [ScrapeLogoService],
    }).compile();

    service = module.get<ScrapeLogoService>(ScrapeLogoService);
  });

  it('should return ogImage if available in metadata', async () => {
    const url = 'https://example.com';
    const metadata: Metadata = {
      title: 'Test Title',
      description: 'Test Description',
      keywords: 'Test Keywords',
      ogTitle: 'Test OG Title',
      ogDescription: 'Test OG Description',
      ogImage: 'http://test.com/image.png',
    };
    const robots: RobotsResponse = {
      baseUrl: 'http://example.com',
      allowedPaths: [],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: true,
    };
    const result = await service.scrapeLogo(url, metadata, robots);
    expect(result).toBe(metadata.ogImage);
  });

  it('should return empty string if ogImage is not available and URL is not scrapable', async () => {
    const url = 'https://example.com';
    const metadata: Metadata = {
      title: 'Test Title',
      description: 'Test Description',
      keywords: 'Test Keywords',
      ogTitle: 'Test OG Title',
      ogDescription: 'Test OG Description',
      ogImage: '',
    };
    const robots: RobotsResponse = {
      baseUrl: 'http://example.com',
      allowedPaths: [],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: false, // URL not scrapable
    };
    const result = await service.scrapeLogo(url, metadata, robots);
    expect(result).toBe('');
  });

  it('should return empty string if no images with "logo" found on the page', async () => {
    const url = 'https://example.com';
    const metadata: Metadata = {
      title: 'Test Title',
      description: 'Test Description',
      keywords: 'Test Keywords',
      ogTitle: 'Test OG Title',
      ogDescription: 'Test OG Description',
      ogImage: '',
    };
    const robots: RobotsResponse = {
      baseUrl: 'http://example.com',
      allowedPaths: [],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: true,
    };
    const result = await service.scrapeLogo(url, metadata, robots);
    expect(result).toBe('');
  });

  // it('should return first image URL that matches the pattern "logo"', async () => {

  //   const browser = {
  //     newPage: jest.fn().mockResolvedValue({
  //       goto: jest.fn(),
  //       evaluate: jest.fn()
  //         .mockResolvedValueOnce({ ogImage: '' })
  //         .mockResolvedValueOnce(['http://example.com/logo1.png', 'http://example.com/logo2.png']),
  //       close: jest.fn(),
  //     }),
  //     close: jest.fn(),
  //   };
  //   mockedPuppeteer.launch.mockResolvedValue(browser as any);

  //   const metadata: Metadata = {
  //     title: 'Test Title',
  //     description: 'Test Description',
  //     keywords: 'Test Keywords',
  //     ogTitle: 'Test OG Title',
  //     ogDescription: 'Test OG Description',
  //     ogImage: '',
  //   };
  //   const robots: RobotsResponse = {
  //     baseUrl: 'http://example.com',
  //     allowedPaths: [],
  //     disallowedPaths: [],
  //     isBaseUrlAllowed: true,
  //     isUrlScrapable: true,
  //   };

  //   const result = await service.scrapeLogo('http://example.com', metadata, robots);
  //   expect(result).toBe('http://example.com/logo1.png');
  //   expect(browser.newPage).toHaveBeenCalledTimes(1);
  //   expect(browser.close).toHaveBeenCalledTimes(1);
  // });

  it('should return empty string if no logo is found', async () => {

    const browser = {
      newPage: jest.fn().mockResolvedValue({
        goto: jest.fn(),
        evaluate: jest.fn()
          .mockResolvedValueOnce({ ogImage: null })
          .mockResolvedValueOnce([]),
        close: jest.fn(),
      }),
      close: jest.fn(),
    };
    mockedPuppeteer.launch.mockResolvedValue(browser as any);

    const metadata: Metadata = {
      title: 'Test Title',
      description: 'Test Description',
      keywords: 'Test Keywords',
      ogTitle: 'Test OG Title',
      ogDescription: 'Test OG Description',
      ogImage: '',
    };
    const robots: RobotsResponse = {
      baseUrl: 'http://example.com',
      allowedPaths: [],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: true,
    };

    const result = await service.scrapeLogo('http://example.com', metadata, robots);
    expect(result).toEqual("");
    expect(browser.newPage).toHaveBeenCalledTimes(1);
    expect(browser.close).toHaveBeenCalledTimes(1);
  });
});
