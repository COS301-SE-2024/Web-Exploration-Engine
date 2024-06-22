import { Test, TestingModule } from '@nestjs/testing';
import { ImagesService } from '../images-app/images.service';
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

describe('ImagesService for images', () => {
  let service: ImagesService;

  /**
   * Setup the testing module and initialize the ScrapingService before each test.
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImagesService],
    }).compile();

    service = module.get<ImagesService>(ImagesService);
  });
  /**
   * Test if the ScrapingService is defined.
   */
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  /**
   * Test that an exception is thrown if crawling is not allowed.
   */
  it('should throw an exception if crawling is not allowed', async () => {
    mockedIsCrawlingAllowed.mockResolvedValueOnce(false);

    await expect(service.scrapeImages('http://example.com')).rejects.toThrow(
      new HttpException('Crawling not allowed or robots.txt not accessible.', HttpStatus.FORBIDDEN),
    );
  });
  /**
   * Test that an array of image URLs is returned when images are found.
   */
  it('should return an array of image URLs', async () => {
    mockedIsCrawlingAllowed.mockResolvedValueOnce(true);

    const browser = {
      newPage: jest.fn().mockResolvedValue({
        goto: jest.fn(),
        evaluate: jest.fn().mockResolvedValue(['http://example.com/image1.png', 'http://example.com/image2.png']),
        close: jest.fn(),
      }),
      close: jest.fn(),
    };
    mockedPuppeteer.launch.mockResolvedValue(browser as any);

    const result = await service.scrapeImages('http://example.com');
    expect(result).toEqual(['http://example.com/image1.png', 'http://example.com/image2.png']);
    expect(browser.newPage).toHaveBeenCalledTimes(1);
    expect(browser.close).toHaveBeenCalledTimes(1);
  });
  /**
   * Test that an empty array is returned if no images are found.
   */
  it('should return an empty array if no images are found', async () => {
    mockedIsCrawlingAllowed.mockResolvedValueOnce(true);

    const browser = {
      newPage: jest.fn().mockResolvedValue({
        goto: jest.fn(),
        evaluate: jest.fn().mockResolvedValue([]),
        close: jest.fn(),
      }),
      close: jest.fn(),
    };
    mockedPuppeteer.launch.mockResolvedValue(browser as any);

    const result = await service.scrapeImages('http://example.com');
    expect(result).toEqual([]);
    expect(browser.newPage).toHaveBeenCalledTimes(1);
    expect(browser.close).toHaveBeenCalledTimes(1);
  });
  /**
  *Test that an exception is thrown if scraping fails.
  */
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

    await expect(service.scrapeImages('http://example.com')).rejects.toThrow(
      new HttpException('Failed to scrape images: Page not found', HttpStatus.INTERNAL_SERVER_ERROR),
    );
  });
  it('should limit the number of image URLs to 50', async () => {
    mockedIsCrawlingAllowed.mockResolvedValueOnce(true);

    // Generate an array of more than 50 image URLs
    const imageUrls = Array.from({ length: 60 }, (_, index) => `http://example.com/image${index}.png`);

    const browser = {
      newPage: jest.fn().mockResolvedValue({
        goto: jest.fn(),
        evaluate: jest.fn().mockResolvedValue(imageUrls),
        close: jest.fn(),
      }),
      close: jest.fn(),
    };
    mockedPuppeteer.launch.mockResolvedValue(browser as any);

    const result = await service.scrapeImages('http://example.com');
    expect(result.length).toBe(50);
    expect(browser.newPage).toHaveBeenCalledTimes(1);
    expect(browser.close).toHaveBeenCalledTimes(1);
  });
  it('should return an empty array if no image URLs are found', async () => {
    mockedIsCrawlingAllowed.mockResolvedValueOnce(true);

    const browser = {
      newPage: jest.fn().mockResolvedValue({
        goto: jest.fn(),
        evaluate: jest.fn().mockResolvedValue([]),
        close: jest.fn(),
      }),
      close: jest.fn(),
    };
    mockedPuppeteer.launch.mockResolvedValue(browser as any);

    const result = await service.scrapeImages('http://example.com');
    expect(result).toEqual([]);
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

    await expect(service.scrapeImages('http://example.com')).rejects.toThrow(
      new HttpException('Failed to scrape images: Page not found', HttpStatus.INTERNAL_SERVER_ERROR),
    );
  });
  describe('scrapeImages', () => {
    it('should throw Forbidden exception if crawling is not allowed', async () => {
      mockedIsCrawlingAllowed.mockResolvedValueOnce(false);

      await expect(service.scrapeImages('http://example.com')).rejects.toThrow(
        new HttpException('Crawling not allowed or robots.txt not accessible.', HttpStatus.FORBIDDEN),
      );
    });

    it('should return an array of image URLs', async () => {
      mockedIsCrawlingAllowed.mockResolvedValueOnce(true);

      const mockBrowser = {
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn(),
          evaluate: jest.fn().mockResolvedValue(['http://example.com/image1.png', 'http://example.com/image2.png']),
          close: jest.fn(),
        }),
        close: jest.fn(),
      };
      mockedPuppeteer.launch.mockResolvedValue(mockBrowser as any);

      const result = await service.scrapeImages('http://example.com');
      expect(result).toEqual(['http://example.com/image1.png', 'http://example.com/image2.png']);
      expect(mockBrowser.newPage).toHaveBeenCalledTimes(1);
      expect(mockBrowser.close).toHaveBeenCalledTimes(1);
    });

    it('should throw Internal Server Error if scraping fails', async () => {
      mockedIsCrawlingAllowed.mockResolvedValueOnce(true);

      const mockBrowser = {
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn().mockImplementation(() => {
            throw new Error('Page not found');
          }),
          close: jest.fn(),
        }),
        close: jest.fn(),
      };
      mockedPuppeteer.launch.mockResolvedValue(mockBrowser as any);

      await expect(service.scrapeImages('http://example.com')).rejects.toThrow(
        new HttpException('Failed to scrape images: Page not found', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });

    it('should limit the number of image URLs to 50', async () => {
      mockedIsCrawlingAllowed.mockResolvedValueOnce(true);

      const imageUrls = Array.from({ length: 60 }, (_, index) => `http://example.com/image${index}.png`);

      const mockBrowser = {
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn(),
          evaluate: jest.fn().mockResolvedValue(imageUrls),
          close: jest.fn(),
        }),
        close: jest.fn(),
      };
      mockedPuppeteer.launch.mockResolvedValue(mockBrowser as any);

      const result = await service.scrapeImages('http://example.com');
      expect(result.length).toBe(50);
      expect(mockBrowser.newPage).toHaveBeenCalledTimes(1);
      expect(mockBrowser.close).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array if no image URLs are found', async () => {
      mockedIsCrawlingAllowed.mockResolvedValueOnce(true);

      const mockBrowser = {
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn(),
          evaluate: jest.fn().mockResolvedValue([]),
          close: jest.fn(),
        }),
        close: jest.fn(),
      };
      mockedPuppeteer.launch.mockResolvedValue(mockBrowser as any);

      const result = await service.scrapeImages('http://example.com');
      expect(result).toEqual([]);
      expect(mockBrowser.newPage).toHaveBeenCalledTimes(1);
      expect(mockBrowser.close).toHaveBeenCalledTimes(1);
    });
  });

  describe('scrapeLogos', () => {
    it('should throw Forbidden exception if crawling is not allowed', async () => {
      mockedIsCrawlingAllowed.mockResolvedValueOnce(false);

      await expect(service.scrapeLogos('http://example.com')).rejects.toThrow(
        new HttpException('Crawling not allowed or robots.txt not accessible.', HttpStatus.FORBIDDEN),
      );
    });

    it('should return the og:image URL if present', async () => {
      mockedIsCrawlingAllowed.mockResolvedValueOnce(true);

      const mockBrowser = {
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn(),
          evaluate: jest.fn().mockResolvedValue({
            ogImage: 'http://example.com/logo.png',
          }),
          close: jest.fn(),
        }),
        close: jest.fn(),
      };
      mockedPuppeteer.launch.mockResolvedValue(mockBrowser as any);

      const result = await service.scrapeLogos('http://example.com');
      expect(result).toEqual('http://example.com/logo.png');
      expect(mockBrowser.newPage).toHaveBeenCalledTimes(1);
      expect(mockBrowser.close).toHaveBeenCalledTimes(1);
    });

    it('should return the first logo URL if no og:image is found', async () => {
      mockedIsCrawlingAllowed.mockResolvedValueOnce(true);

      const mockBrowser = {
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn(),
          evaluate: jest.fn()
            .mockResolvedValueOnce({
              ogImage: null,
            })
            .mockResolvedValueOnce(['http://example.com/logo1.png']),
          close: jest.fn(),
        }),
        close: jest.fn(),
      };
      mockedPuppeteer.launch.mockResolvedValue(mockBrowser as any);

      const result = await service.scrapeLogos('http://example.com');
      expect(result).toEqual('http://example.com/logo1.png');
      expect(mockBrowser.newPage).toHaveBeenCalledTimes(1);
      expect(mockBrowser.close).toHaveBeenCalledTimes(1);
    });

    it('should return null if no logo is found', async () => {
      mockedIsCrawlingAllowed.mockResolvedValueOnce(true);

      const mockBrowser = {
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn(),
          evaluate: jest.fn()
            .mockResolvedValueOnce({
              ogImage: null,
            })
            .mockResolvedValueOnce([]),
          close: jest.fn(),
        }),
        close: jest.fn(),
      };
      mockedPuppeteer.launch.mockResolvedValue(mockBrowser as any);

      const result = await service.scrapeLogos('http://example.com');
      expect(result).toBeNull();
      expect(mockBrowser.newPage).toHaveBeenCalledTimes(1);
      expect(mockBrowser.close).toHaveBeenCalledTimes(1);
    });

    it('should throw Internal Server Error if scraping logos fails', async () => {
      mockedIsCrawlingAllowed.mockResolvedValueOnce(true);

      const mockBrowser = {
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn().mockImplementation(() => {
            throw new Error('Page not found');
          }),
          close: jest.fn(),
        }),
        close: jest.fn(),
      };
      mockedPuppeteer.launch.mockResolvedValue(mockBrowser as any);

      await expect(service.scrapeLogos('http://example.com')).rejects.toThrow(
        new HttpException('Failed to scrape logos: Page not found', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });

  describe('scrapeMetadata', () => {
    it('should throw Forbidden exception if crawling is not allowed', async () => {
      mockedIsCrawlingAllowed.mockResolvedValueOnce(false);

      await expect(service.scrapeMetadata('http://example.com')).rejects.toThrow(
        new HttpException('Crawling not allowed or robots.txt not accessible.', HttpStatus.FORBIDDEN),
      );
    });
  });


});
