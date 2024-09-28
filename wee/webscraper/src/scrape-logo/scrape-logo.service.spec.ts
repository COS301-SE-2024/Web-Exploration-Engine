import { Test, TestingModule } from '@nestjs/testing';
import { ScrapeLogoService } from './scrape-logo.service';
import { Metadata, RobotsResponse } from '../models/ServiceModels';
import * as puppeteer from 'puppeteer';

jest.mock('axios');

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

    const mockPage = {
      goto: jest.fn(),
      evaluate: jest.fn(),
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

    const result = await service.scrapeLogo(url, metadata, robots, mockPage);
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

    const mockPage = {
      goto: jest.fn(),
      evaluate: jest.fn(),
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

    const result = await service.scrapeLogo(url, metadata, robots, mockPage);
    expect(result).toBe('');
  });

  // it('should return empty string if no images with "logo" found on the page', async () => {
  //   const url = 'https://example.com';
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

  //   const mockImageUrls = ['http://example.com/image1.png', 'http://example.com/image2.png'];

  //   const mockPage = {
  //     goto: jest.fn().mockResolvedValue(undefined),
  //     evaluate: jest.fn().mockResolvedValue(mockImageUrls),
  //     authenticate: jest.fn(),
  //     close: jest.fn(),
  //   } as unknown as puppeteer.Page;

  //   const mockBrowser = {
  //     newPage: jest.fn().mockResolvedValue(mockPage),
  //     close: jest.fn(),
  //   } as unknown as puppeteer.Browser;

  //   // Mock environment variables
  //   process.env.PROXY_USERNAME = 'username';
  //   process.env.PROXY_PASSWORD = 'password';
  //   const result = await service.scrapeLogo(url, metadata, robots, mockBrowser);
  //   expect(result).toBe('');
  // });

  it('should return empty string if no logo is found', async () => {

    const mockPage = {
      goto: jest.fn(),
      evaluate: jest.fn(),
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

    const result = await service.scrapeLogo('http://example.com', metadata, robots, mockPage);
    expect(result).toEqual("");
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

    const mockPage = {
      goto: jest.fn().mockResolvedValue(undefined),
      evaluate: jest.fn().mockResolvedValue([]),
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

    const result = await service.scrapeLogo(url, metadata, robots, mockPage);
    expect(result).toBe('');
  });

  it('should return first image URL that matches the pattern "logo"', async () => {
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

    const mockImages = ['http://example.com/logo1.png', 'http://example.com/logo2.png', 'http://example.com/logo3.png'];

    const mockPage = {
      goto: jest.fn().mockResolvedValue(undefined),
      evaluate: jest.fn().mockResolvedValue(mockImages),
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

    const result = await service.scrapeLogo(url, metadata, robots, mockPage);
    expect(result).toBe('http://example.com/logo1.png');
  });

  it('should return first image URL when multiple "logo" images are found', async () => {
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

    const mockImages = ['http://example.com/logo1.png', 'http://example.com/logo2.png', 'http://example.com/logo3.png'];

    const mockPage = {
      goto: jest.fn().mockResolvedValue(undefined),
      evaluate: jest.fn().mockResolvedValue(mockImages),
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

    const result = await service.scrapeLogo(url, metadata, robots, mockPage);
    expect(result).toBe('http://example.com/logo1.png');
  });

  it('should return empty string if an exception is thrown while scraping', async () => {
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

    const mockPage = {
      goto: jest.fn().mockResolvedValue(undefined),
      evaluate: jest.fn().mockRejectedValue(new Error('Scraping failed')),
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

    const result = await service.scrapeLogo(url, metadata, robots, mockPage);
    expect(result).toBe('');
  });

  it('should handle puppeteer launch failure gracefully', async () => {
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

    const mockPage = {
      goto: jest.fn().mockRejectedValue(new Error('Failed to launch browser')),
      evaluate: jest.fn(),
      authenticate: jest.fn(),
      close: jest.fn(),
    } as unknown as puppeteer.Page;

    const mockBrowser = {
      newPage: jest.fn().mockRejectedValue(new Error('Failed to launch browser')),
      close: jest.fn(),
    } as unknown as puppeteer.Browser;

    // Mock environment variables
    process.env.PROXY_USERNAME = 'username';
    process.env.PROXY_PASSWORD = 'password';

    const result = await service.scrapeLogo(url, metadata, robots, mockPage);
    expect(result).toBe('');
  });

});
