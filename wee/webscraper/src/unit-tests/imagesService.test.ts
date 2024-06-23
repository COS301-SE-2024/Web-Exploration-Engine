import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { ImagesService } from '../images-app/images.service';
import * as robotModule from '../images-app/robot';

jest.mock('puppeteer');

describe('ImagesService', () => {
  let service: ImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImagesService],
    }).compile();

    service = module.get<ImagesService>(ImagesService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('scrapeImages', () => {
    it('should scrape images from a URL', async () => {
      const mockUrl = 'http://example.com';
      const mockImageUrls = [
        'http://example.com/image1.jpg',
        'http://example.com/image2.jpg',
      ];

      jest.spyOn(robotModule, 'isCrawlingAllowed').mockResolvedValue(true);

      (puppeteer.launch as jest.Mock).mockResolvedValue({
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn().mockResolvedValue(true),
          evaluate: jest.fn().mockResolvedValue(mockImageUrls),
          close: jest.fn().mockResolvedValue(true),
        }),
        close: jest.fn().mockResolvedValue(true),
      });

      const result = await service.scrapeImages(mockUrl);

      expect(result).toEqual(mockImageUrls.slice(0, 50));
    });

    it('should throw Forbidden exception if crawling is not allowed', async () => {
      const mockUrl = 'http://example.com';

      jest.spyOn(robotModule, 'isCrawlingAllowed').mockResolvedValue(false);

      await expect(service.scrapeImages(mockUrl)).rejects.toThrow(
        HttpException
      );
      await expect(service.scrapeImages(mockUrl)).rejects.toThrow(
        'Crawling not allowed or robots.txt not accessible.'
      );
      await expect(service.scrapeImages(mockUrl)).rejects.toMatchObject({
        status: HttpStatus.FORBIDDEN,
      });
    });
    it('should scrape images from a URL', async () => {
      const mockUrl = 'http://example.com';
      const mockImageUrls = [
        'http://example.com/image1.jpg',
        'http://example.com/image2.jpg',
      ];

      jest.spyOn(robotModule, 'isCrawlingAllowed').mockResolvedValue(true);

      (puppeteer.launch as jest.Mock).mockResolvedValue({
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn().mockResolvedValue(true),
          evaluate: jest.fn().mockResolvedValue(mockImageUrls),
          close: jest.fn().mockResolvedValue(true),
        }),
        close: jest.fn().mockResolvedValue(true),
      });

      const result = await service.scrapeImages(mockUrl);

      expect(result).toEqual(mockImageUrls.slice(0, 50));
    });
    
    it('should throw Forbidden exception if crawling is not allowed', async () => {
      const mockUrl = 'http://example.com';

      jest.spyOn(robotModule, 'isCrawlingAllowed').mockResolvedValue(false);

      await expect(service.scrapeImages(mockUrl)).rejects.toThrow(
        HttpException
      );
      await expect(service.scrapeImages(mockUrl)).rejects.toThrow(
        'Crawling not allowed or robots.txt not accessible.'
      );
      await expect(service.scrapeImages(mockUrl)).rejects.toMatchObject({
        status: HttpStatus.FORBIDDEN,
      });
    });

    it('should handle errors during image scraping', async () => {
      const mockUrl = 'http://example.com';

      jest.spyOn(robotModule, 'isCrawlingAllowed').mockResolvedValue(true);

      (puppeteer.launch as jest.Mock).mockResolvedValue({
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn().mockResolvedValue(true),
          evaluate: jest.fn().mockRejectedValue(new Error('Test error')),
          close: jest.fn().mockResolvedValue(true),
        }),
        close: jest.fn().mockResolvedValue(true),
      });

      await expect(service.scrapeImages(mockUrl)).rejects.toThrow(
        HttpException
      );
      await expect(service.scrapeImages(mockUrl)).rejects.toThrow(
        'Failed to scrape images: Test error'
      );
      await expect(service.scrapeImages(mockUrl)).rejects.toMatchObject({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    });

    it('should handle errors thrown by puppeteer', async () => {
      const mockUrl = 'http://example.com';

      jest.spyOn(robotModule, 'isCrawlingAllowed').mockResolvedValue(true);

      (puppeteer.launch as jest.Mock).mockRejectedValue(
        new Error('Test error')
      );

      await expect(service.scrapeImages(mockUrl)).rejects.toThrow(
        HttpException
      );
      await expect(service.scrapeImages(mockUrl)).rejects.toThrow(
        'Failed to scrape images: Test error'
      );
      await expect(service.scrapeImages(mockUrl)).rejects.toMatchObject({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    });

    it('should handle errors during image scraping', async () => {
      const mockUrl = 'http://example.com';

      jest.spyOn(robotModule, 'isCrawlingAllowed').mockResolvedValue(true);

      (puppeteer.launch as jest.Mock).mockResolvedValue({
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn().mockResolvedValue(true),
          evaluate: jest.fn().mockRejectedValue(new Error('Test error')), // Simulate error during evaluate
          close: jest.fn().mockResolvedValue(true),
        }),
        close: jest.fn().mockResolvedValue(true),
      });

      await expect(service.scrapeImages(mockUrl)).rejects.toThrow(
        HttpException
      );
      await expect(service.scrapeImages(mockUrl)).rejects.toThrow(
        'Failed to scrape images: Test error'
      );
      await expect(service.scrapeImages(mockUrl)).rejects.toMatchObject({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    });
  });

  describe('scrapeLogos', () => {
    it('should scrape logo from a URL', async () => {
      const mockUrl = 'http://example.com';
      const mockLogoUrl = 'http://example.com/logo.png';

      jest.spyOn(robotModule, 'isCrawlingAllowed').mockResolvedValue(true);

      (puppeteer.launch as jest.Mock).mockResolvedValue({
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn().mockResolvedValue(true),
          evaluate: jest.fn().mockResolvedValue({ ogImage: mockLogoUrl }),
          close: jest.fn().mockResolvedValue(true),
        }),
        close: jest.fn().mockResolvedValue(true),
      });

      const result = await service.scrapeLogos(mockUrl);

      expect(result).toEqual(mockLogoUrl);
    });

    it('should return null if no logo is found', async () => {
      const mockUrl = 'http://example.com';

      jest.spyOn(robotModule, 'isCrawlingAllowed').mockResolvedValue(true);

      (puppeteer.launch as jest.Mock).mockResolvedValue({
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn().mockResolvedValue(true),
          evaluate: jest.fn().mockResolvedValue({ ogImage: null }),
          close: jest.fn().mockResolvedValue(true),
        }),
        close: jest.fn().mockResolvedValue(true),
      });

      const result = await service.scrapeLogos(mockUrl);

      expect(result).toBeNull();
    });

    it('should handle errors thrown by puppeteer', async () => {
      const mockUrl = 'http://example.com';

      jest.spyOn(robotModule, 'isCrawlingAllowed').mockResolvedValue(true);

      (puppeteer.launch as jest.Mock).mockRejectedValue(
        new Error('Test error')
      );

      await expect(service.scrapeLogos(mockUrl)).rejects.toThrow(HttpException);
      await expect(service.scrapeLogos(mockUrl)).rejects.toThrow(
        'Failed to scrape logos: Test error'
      );
      await expect(service.scrapeLogos(mockUrl)).rejects.toMatchObject({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    });

    it('should scrape logo from a URL', async () => {
      const mockUrl = 'http://example.com';
      const mockLogoUrl = 'http://example.com/logo.png';

      jest.spyOn(robotModule, 'isCrawlingAllowed').mockResolvedValue(true);

      (puppeteer.launch as jest.Mock).mockResolvedValue({
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn().mockResolvedValue(true),
          evaluate: jest.fn().mockResolvedValue({ ogImage: mockLogoUrl }),
          close: jest.fn().mockResolvedValue(true),
        }),
        close: jest.fn().mockResolvedValue(true),
      });

      const result = await service.scrapeLogos(mockUrl);

      expect(result).toEqual(mockLogoUrl);
    });

    it('should return null if no logo is found', async () => {
      const mockUrl = 'http://example.com';

      jest.spyOn(robotModule, 'isCrawlingAllowed').mockResolvedValue(true);

      (puppeteer.launch as jest.Mock).mockResolvedValue({
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn().mockResolvedValue(true),
          evaluate: jest.fn().mockResolvedValue({ ogImage: null }), // Simulate no logo found
          close: jest.fn().mockResolvedValue(true),
        }),
        close: jest.fn().mockResolvedValue(true),
      });

      const result = await service.scrapeLogos(mockUrl);

      expect(result).toBeNull();
    });

    it('should handle errors during logo scraping', async () => {
      const mockUrl = 'http://example.com';

      jest.spyOn(robotModule, 'isCrawlingAllowed').mockResolvedValue(true);

      (puppeteer.launch as jest.Mock).mockRejectedValue(
        new Error('Test error')
      );

      await expect(service.scrapeLogos(mockUrl)).rejects.toThrow(HttpException);
      await expect(service.scrapeLogos(mockUrl)).rejects.toThrow(
        'Failed to scrape logos: Test error'
      );
      await expect(service.scrapeLogos(mockUrl)).rejects.toMatchObject({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    });

    it('should handle no logo found scenario', async () => {
      const mockUrl = 'http://example.com';

      jest.spyOn(robotModule, 'isCrawlingAllowed').mockResolvedValue(true);

      (puppeteer.launch as jest.Mock).mockResolvedValue({
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn().mockResolvedValue(true),
          evaluate: jest.fn().mockResolvedValue({ ogImage: null }), // Simulate no logo found
          close: jest.fn().mockResolvedValue(true),
        }),
        close: jest.fn().mockResolvedValue(true),
      });

      const result = await service.scrapeLogos(mockUrl);

      expect(result).toBeNull();
    });

    it('should handle errors during logo scraping', async () => {
      const mockUrl = 'http://example.com';

      jest.spyOn(robotModule, 'isCrawlingAllowed').mockResolvedValue(true);

      (puppeteer.launch as jest.Mock).mockRejectedValue(
        new Error('Test error')
      );

      await expect(service.scrapeLogos(mockUrl)).rejects.toThrow(HttpException);
      await expect(service.scrapeLogos(mockUrl)).rejects.toThrow(
        'Failed to scrape logos: Test error'
      );
      await expect(service.scrapeLogos(mockUrl)).rejects.toMatchObject({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    });
  });

  describe('scrapeMetadata', () => {
    it('should scrape metadata from a URL', async () => {
      const mockUrl = 'http://example.com';
      const mockMetadata = {
        title: 'Example Website',
        description: 'An example website description',
        keywords: 'example, website, keywords',
        ogTitle: 'Example OG Title',
        ogDescription: 'An example OG description',
        ogImage: 'http://example.com/image.png',
      };

      jest.spyOn(robotModule, 'isCrawlingAllowed').mockResolvedValue(true);

      (puppeteer.launch as jest.Mock).mockResolvedValue({
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn().mockResolvedValue(true),
          evaluate: jest.fn().mockResolvedValue(mockMetadata),
          close: jest.fn().mockResolvedValue(true),
        }),
        close: jest.fn().mockResolvedValue(true),
      });

      const result = await service.scrapeMetadata(mockUrl);

      expect(result).toEqual(mockMetadata);
    });

    it('should handle errors thrown by puppeteer', async () => {
      const mockUrl = 'http://example.com';

      jest.spyOn(robotModule, 'isCrawlingAllowed').mockResolvedValue(true);

      (puppeteer.launch as jest.Mock).mockRejectedValue(
        new Error('Test error')
      );

      await expect(service.scrapeMetadata(mockUrl)).rejects.toThrow(
        HttpException
      );
      await expect(service.scrapeMetadata(mockUrl)).rejects.toThrow(
        'Failed to scrape metadata: Test error'
      );
      await expect(service.scrapeMetadata(mockUrl)).rejects.toMatchObject({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    });
    it('should handle errors during metadata scraping', async () => {
      const mockUrl = 'http://example.com';

      jest.spyOn(robotModule, 'isCrawlingAllowed').mockResolvedValue(true);

      (puppeteer.launch as jest.Mock).mockResolvedValue({
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn().mockResolvedValue(true),
          evaluate: jest.fn().mockRejectedValue(new Error('Test error')), // Simulate error during evaluate
          close: jest.fn().mockResolvedValue(true),
        }),
        close: jest.fn().mockResolvedValue(true),
      });

      await expect(service.scrapeMetadata(mockUrl)).rejects.toThrow(
        HttpException
      );
      await expect(service.scrapeMetadata(mockUrl)).rejects.toThrow(
        'Failed to scrape metadata: Test error'
      );
      await expect(service.scrapeMetadata(mockUrl)).rejects.toMatchObject({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    });
    it('should handle errors during metadata scraping', async () => {
      const mockUrl = 'http://example.com';

      jest.spyOn(robotModule, 'isCrawlingAllowed').mockResolvedValue(true);

      (puppeteer.launch as jest.Mock).mockResolvedValue({
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn().mockResolvedValue(true),
          evaluate: jest.fn().mockRejectedValue(new Error('Test error')),
          close: jest.fn().mockResolvedValue(true),
        }),
        close: jest.fn().mockResolvedValue(true),
      });

      await expect(service.scrapeMetadata(mockUrl)).rejects.toThrow(
        HttpException
      );
      await expect(service.scrapeMetadata(mockUrl)).rejects.toThrow(
        'Failed to scrape metadata: Test error'
      );
      await expect(service.scrapeMetadata(mockUrl)).rejects.toMatchObject({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    });
  });
});
