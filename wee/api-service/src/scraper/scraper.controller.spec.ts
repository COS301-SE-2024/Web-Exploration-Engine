import { Test, TestingModule } from '@nestjs/testing';
import { ScraperController } from './scraper.controller';
import { PubSubService } from '../pub-sub/pub_sub.service';
import { Cache } from 'cache-manager';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ScraperController', () => {
  let scraperController: ScraperController;
  let pubSubService: PubSubService;
  let cacheManager: Cache;

  beforeAll(() => {
    // Mocking GOOGLE_CLOUD_TOPIC environment variable
    process.env.GOOGLE_CLOUD_TOPIC = 'test-topic';
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScraperController],
      providers: [
        {
          provide: PubSubService,
          useValue: {
            publishMessage: jest.fn(),
          },
        },
        {
          provide: 'CACHE_MANAGER',
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    scraperController = module.get<ScraperController>(ScraperController);
    pubSubService = module.get<PubSubService>(PubSubService);
    cacheManager = module.get<Cache>('CACHE_MANAGER');
  });

  describe('scrape', () => {
    it('should publish a scraping task when the URL is valid', async () => {
      const url = 'https://example.com';
      const result = await scraperController.scrape(url);
      expect(pubSubService.publishMessage).toHaveBeenCalledWith(
        process.env.GOOGLE_CLOUD_TOPIC,
        { type: 'scrape', data: { url } },
      );
      expect(result).toEqual({
        message: 'Scraping task published',
        status: 'processing',
        pollingUrl: `/status?type=scrape&url=${encodeURIComponent(url)}`,
      });
    });

    it('should throw BAD_REQUEST when no URL is provided', async () => {
      await expect(scraperController.scrape('')).rejects.toThrow(
        new HttpException('URL is required', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw BAD_REQUEST when an invalid URL is provided', async () => {
      await expect(scraperController.scrape('invalid-url')).rejects.toThrow(
        new HttpException('Invalid URL format', HttpStatus.BAD_REQUEST),
      );
    });

    it('should handle internal server error', async () => {
      jest
        .spyOn(pubSubService, 'publishMessage')
        .mockImplementation(() => Promise.reject(new Error('Server Error')));
      await expect(
        scraperController.scrape('https://example.com'),
      ).rejects.toThrow(
        new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('readRobotsFile', () => {
    it('should publish a read-robots task when the URL is valid', async () => {
      const url = 'https://example.com';
      const result = await scraperController.readRobotsFile(url);
      expect(pubSubService.publishMessage).toHaveBeenCalledWith(
        expect.any(String),
        { type: 'read-robots', data: { url } },
      );
      expect(result).toEqual({
        message: 'Read robots task published',
        status: 'processing',
        pollingUrl: `/status/read-robots/${encodeURIComponent(url)}`,
      });
    });

    it('should throw BAD_REQUEST when no URL is provided', async () => {
      await expect(scraperController.readRobotsFile('')).rejects.toThrow(
        new HttpException('URL is required', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw BAD_REQUEST when an invalid URL is provided', async () => {
      await expect(scraperController.readRobotsFile('invalid-url')).rejects.toThrow(
        new HttpException('Invalid URL format', HttpStatus.BAD_REQUEST),
      );
    });

    it('should handle internal server error', async () => {
      jest
        .spyOn(pubSubService, 'publishMessage')
        .mockImplementation(() => Promise.reject(new Error('Server Error')));
      await expect(
        scraperController.readRobotsFile('https://example.com'),
      ).rejects.toThrow(
        new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('scrapeMetadata', () => {
    it('should publish a scrape-metadata task when the URL is valid', async () => {
      const url = 'https://example.com';
      const result = await scraperController.scrapeMetadata(url);
      expect(pubSubService.publishMessage).toHaveBeenCalledWith(
        expect.any(String),
        { type: 'scrape-metadata', data: { url } },
      );
      expect(result).toEqual({
        message: 'Scrape metadata task published',
        status: 'processing',
        pollingUrl: `/status/scrape-metadata/${encodeURIComponent(url)}`,
      });
    });

    it('should throw BAD_REQUEST when no URL is provided', async () => {
      await expect(scraperController.scrapeMetadata('')).rejects.toThrow(
        new HttpException('URL is required', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw BAD_REQUEST when an invalid URL is provided', async () => {
      await expect(scraperController.scrapeMetadata('invalid-url')).rejects.toThrow(
        new HttpException('Invalid URL format', HttpStatus.BAD_REQUEST),
      );
    });

    it('should handle internal server error', async () => {
      jest
        .spyOn(pubSubService, 'publishMessage')
        .mockImplementation(() => Promise.reject(new Error('Server Error')));
      await expect(
        scraperController.scrapeMetadata('https://example.com'),
      ).rejects.toThrow(
        new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
  describe('scrapeAddresses', () => {
    it('should publish a scrape-addresses task when the URL is valid', async () => {
      const url = 'https://example.com';
      const result = await scraperController.scrapeAddresses(url);
      expect(pubSubService.publishMessage).toHaveBeenCalledWith(
        expect.any(String),
        { type: 'scrape-addresses', data: { url } },
      );
      expect(result).toEqual({
        message: 'Scrape addresses task published',
        status: 'processing',
        pollingUrl: `/status/scrape-addresses/${encodeURIComponent(url)}`,
      });
    });
  
    it('should throw BAD_REQUEST when no URL is provided', async () => {
      await expect(scraperController.scrapeAddresses('')).rejects.toThrow(
        new HttpException('URL is required', HttpStatus.BAD_REQUEST),
      );
    });
  
    it('should throw BAD_REQUEST when an invalid URL is provided', async () => {
      await expect(scraperController.scrapeAddresses('invalid-url')).rejects.toThrow(
        new HttpException('Invalid URL format', HttpStatus.BAD_REQUEST),
      );
    });
  
    it('should handle internal server error', async () => {
      jest
        .spyOn(pubSubService, 'publishMessage')
        .mockImplementation(() => Promise.reject(new Error('Server Error')));
      await expect(
        scraperController.scrapeAddresses('https://example.com'),
      ).rejects.toThrow(
        new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
  describe('scrapeStatus', () => {
    it('should publish a scrape-status task when the URL is valid', async () => {
      const url = 'https://example.com';
      const result = await scraperController.scrapeStatus(url);
      expect(pubSubService.publishMessage).toHaveBeenCalledWith(
        expect.any(String),
        { type: 'scrape-status', data: { url } },
      );
      expect(result).toEqual({
        message: 'Scrape metadata task published',
        status: 'processing',
        pollingUrl: `/status/scrape-status/${encodeURIComponent(url)}`,
      });
    });
  
    it('should throw BAD_REQUEST when no URL is provided', async () => {
      await expect(scraperController.scrapeStatus('')).rejects.toThrow(
        new HttpException('URL is required', HttpStatus.BAD_REQUEST),
      );
    });
  
    it('should throw BAD_REQUEST when an invalid URL is provided', async () => {
      await expect(scraperController.scrapeStatus('invalid-url')).rejects.toThrow(
        new HttpException('Invalid URL format', HttpStatus.BAD_REQUEST),
      );
    });
  
    it('should handle internal server error', async () => {
      jest
        .spyOn(pubSubService, 'publishMessage')
        .mockImplementation(() => Promise.reject(new Error('Server Error')));
      await expect(
        scraperController.scrapeStatus('https://example.com'),
      ).rejects.toThrow(
        new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
  describe('classifyIndustry', () => {
    it('should publish a classify-industry task when the URL is valid', async () => {
      const url = 'https://example.com';
      const result = await scraperController.classifyIndustry(url);
      expect(pubSubService.publishMessage).toHaveBeenCalledWith(
        expect.any(String),
        { type: 'classify-industry', data: { url } },
      );
      expect(result).toEqual({
        message: 'Classify industry task published',
        status: 'processing',
        pollingUrl: `/status/classify-industry/${encodeURIComponent(url)}`,
      });
    });
  
    it('should throw BAD_REQUEST when no URL is provided', async () => {
      await expect(scraperController.classifyIndustry('')).rejects.toThrow(
        new HttpException('URL is required', HttpStatus.BAD_REQUEST),
      );
    });
  
    it('should throw BAD_REQUEST when an invalid URL is provided', async () => {
      await expect(scraperController.classifyIndustry('invalid-url')).rejects.toThrow(
        new HttpException('Invalid URL format', HttpStatus.BAD_REQUEST),
      );
    });
  
    it('should handle internal server error', async () => {
      jest
        .spyOn(pubSubService, 'publishMessage')
        .mockImplementation(() => Promise.reject(new Error('Server Error')));
      await expect(
        scraperController.classifyIndustry('https://example.com'),
      ).rejects.toThrow(
        new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
  describe('scrapeImages', () => {
    it('should publish a scrape-images task when the URL is valid', async () => {
      const url = 'https://example.com';
      const result = await scraperController.scrapeImages(url);
      expect(pubSubService.publishMessage).toHaveBeenCalledWith(
        expect.any(String),
        { type: 'scrape-images', data: { url } },
      );
      expect(result).toEqual({
        message: 'Scrape images task published',
        status: 'processing',
        pollingUrl: `/status/scrape-images/${encodeURIComponent(url)}`,
      });
    });
  
    it('should throw BAD_REQUEST when no URL is provided', async () => {
      await expect(scraperController.scrapeImages('')).rejects.toThrow(
        new HttpException('URL is required', HttpStatus.BAD_REQUEST),
      );
    });
  
    it('should throw BAD_REQUEST when an invalid URL is provided', async () => {
      await expect(scraperController.scrapeImages('invalid-url')).rejects.toThrow(
        new HttpException('Invalid URL format', HttpStatus.BAD_REQUEST),
      );
    });
  
    it('should handle internal server error', async () => {
      jest
        .spyOn(pubSubService, 'publishMessage')
        .mockImplementation(() => Promise.reject(new Error('Server Error')));
      await expect(
        scraperController.scrapeImages('https://example.com'),
      ).rejects.toThrow(
        new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
  describe('scrapeLogo', () => {
    it('should publish a scrape-logo task when the URL is valid', async () => {
      const url = 'https://example.com';
      const result = await scraperController.scrapeLogo(url);
      expect(pubSubService.publishMessage).toHaveBeenCalledWith(
        expect.any(String),
        { type: 'scrape-logo', data: { url } },
      );
      expect(result).toEqual({
        message: 'Scrape logo task published',
        status: 'processing',
        pollingUrl: `/status/scrape-logo/${encodeURIComponent(url)}`,
      });
    });
  
    it('should throw BAD_REQUEST when no URL is provided', async () => {
      await expect(scraperController.scrapeLogo('')).rejects.toThrow(
        new HttpException('URL is required', HttpStatus.BAD_REQUEST),
      );
    });
  
    it('should throw BAD_REQUEST when an invalid URL is provided', async () => {
      await expect(scraperController.scrapeLogo('invalid-url')).rejects.toThrow(
        new HttpException('Invalid URL format', HttpStatus.BAD_REQUEST),
      );
    });
  
    it('should handle internal server error', async () => {
      jest
        .spyOn(pubSubService, 'publishMessage')
        .mockImplementation(() => Promise.reject(new Error('Server Error')));
      await expect(
        scraperController.scrapeLogo('https://example.com'),
      ).rejects.toThrow(
        new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
  describe('getScreenshot', () => {
    it('should publish a screenshot task when the URL is valid', async () => {
      const url = 'https://example.com';
      const result = await scraperController.getScreenshot(url);
      expect(pubSubService.publishMessage).toHaveBeenCalledWith(
        expect.any(String),
        { type: 'screenshot', data: { url } },
      );
      expect(result).toEqual({
        message: 'Screenshot task published',
        status: 'processing',
        pollingUrl: `/status/screenshot/${encodeURIComponent(url)}`,
      });
    });
  
    it('should throw BAD_REQUEST when no URL is provided', async () => {
      await expect(scraperController.getScreenshot('')).rejects.toThrow(
        new HttpException('URL is required', HttpStatus.BAD_REQUEST),
      );
    });
  
    it('should throw BAD_REQUEST when an invalid URL is provided', async () => {
      await expect(scraperController.getScreenshot('invalid-url')).rejects.toThrow(
        new HttpException('Invalid URL format', HttpStatus.BAD_REQUEST),
      );
    });
  
    it('should handle internal server error', async () => {
      jest
        .spyOn(pubSubService, 'publishMessage')
        .mockImplementation(() => Promise.reject(new Error('Server Error')));
      await expect(
        scraperController.getScreenshot('https://example.com'),
      ).rejects.toThrow(
        new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
  describe('scrapeContactInfo', () => {
    it('should publish a scrape-contact-info task when the URL is valid', async () => {
      const url = 'https://example.com';
      const result = await scraperController.scrapeContactInfo(url);
      expect(pubSubService.publishMessage).toHaveBeenCalledWith(
        expect.any(String),
        { type: 'scrape-contact-info', data: { url } },
      );
      expect(result).toEqual({
        message: 'Scrape contact info task published',
        status: 'processing',
        pollingUrl: `/status/scrape-contact-info/${encodeURIComponent(url)}`,
      });
    });
  
    it('should throw BAD_REQUEST when no URL is provided', async () => {
      await expect(scraperController.scrapeContactInfo('')).rejects.toThrow(
        new HttpException('URL is required', HttpStatus.BAD_REQUEST),
      );
    });
  
    it('should throw BAD_REQUEST when an invalid URL is provided', async () => {
      await expect(scraperController.scrapeContactInfo('invalid-url')).rejects.toThrow(
        new HttpException('Invalid URL format', HttpStatus.BAD_REQUEST),
      );
    });
  
    it('should handle internal server error', async () => {
      jest
        .spyOn(pubSubService, 'publishMessage')
        .mockImplementation(() => Promise.reject(new Error('Server Error')));
      await expect(
        scraperController.scrapeContactInfo('https://example.com'),
      ).rejects.toThrow(
        new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
  describe('seoAnalysis', () => {
    it('should publish an SEO analysis task when the URL is valid', async () => {
      const url = 'https://example.com';
      const result = await scraperController.seoAnalysis(url);
      expect(pubSubService.publishMessage).toHaveBeenCalledWith(
        expect.any(String),
        { type: 'seo-analysis', data: { url } },
      );
      expect(result).toEqual({
        message: 'SEO analysis task published',
        status: 'processing',
        pollingUrl: `/status/seo-analysis/${encodeURIComponent(url)}`,
      });
    });
  
    it('should throw BAD_REQUEST when no URL is provided', async () => {
      await expect(scraperController.seoAnalysis('')).rejects.toThrow(
        new HttpException('URL is required', HttpStatus.BAD_REQUEST),
      );
    });
  
    it('should throw BAD_REQUEST when an invalid URL is provided', async () => {
      await expect(scraperController.seoAnalysis('invalid-url')).rejects.toThrow(
        new HttpException('Invalid URL format', HttpStatus.BAD_REQUEST),
      );
    });
  
    it('should handle internal server error', async () => {
      jest
        .spyOn(pubSubService, 'publishMessage')
        .mockImplementation(() => Promise.reject(new Error('Server Error')));
      await expect(
        scraperController.seoAnalysis('https://example.com'),
      ).rejects.toThrow(
        new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
  describe('keywordAnalysis', () => {
    it('should publish a keyword analysis task when the URL and keyword are valid', async () => {
      const url = 'https://example.com';
      const keyword = 'test';
      const result = await scraperController.keywordAnalysis(url, keyword);
      expect(pubSubService.publishMessage).toHaveBeenCalledWith(
        expect.any(String),
        { type: 'keyword-analysis', data: { url, keyword } },
      );
      expect(result).toEqual({
        message: 'Keyword analysis task published',
        status: 'processing',
        pollingUrl: `/status/keyword-analysis/${encodeURIComponent(url)}`,
      });
    });
  
    it('should throw BAD_REQUEST when no URL is provided', async () => {
      await expect(scraperController.keywordAnalysis('', 'test')).rejects.toThrow(
        new HttpException('URL and keyword is required', HttpStatus.BAD_REQUEST),
      );
    });
  
    it('should throw BAD_REQUEST when no keyword is provided', async () => {
      await expect(scraperController.keywordAnalysis('https://example.com', '')).rejects.toThrow(
        new HttpException('URL and keyword is required', HttpStatus.BAD_REQUEST),
      );
    });
  
    it('should throw BAD_REQUEST when an invalid URL is provided', async () => {
      await expect(scraperController.keywordAnalysis('invalid-url', 'test')).rejects.toThrow(
        new HttpException('Invalid URL format', HttpStatus.BAD_REQUEST),
      );
    });
  
    it('should handle internal server error', async () => {
      jest
        .spyOn(pubSubService, 'publishMessage')
        .mockImplementation(() => Promise.reject(new Error('Server Error')));
      await expect(
        scraperController.keywordAnalysis('https://example.com', 'test'),
      ).rejects.toThrow(
        new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
  describe('scrapeNews', () => {
    it('should publish a scrape news task when the URL is valid', async () => {
      const url = 'https://example.com';
      const result = await scraperController.scrapeNews(url);
      expect(pubSubService.publishMessage).toHaveBeenCalledWith(
        expect.any(String),
        { type: 'scrape-news', data: { url } },
      );
      expect(result).toEqual({
        message: 'Scrape news task published',
        status: 'processing',
        pollingUrl: `/status/scrape-news/${encodeURIComponent(url)}`,
      });
    });
  
    it('should throw BAD_REQUEST when no URL is provided', async () => {
      await expect(scraperController.scrapeNews('')).rejects.toThrow(
        new HttpException('URL is required', HttpStatus.BAD_REQUEST),
      );
    });
  
    it('should throw BAD_REQUEST when an invalid URL is provided', async () => {
      await expect(scraperController.scrapeNews('invalid-url')).rejects.toThrow(
        new HttpException('Invalid URL format', HttpStatus.BAD_REQUEST),
      );
    });
  
    it('should handle internal server error', async () => {
      jest
        .spyOn(pubSubService, 'publishMessage')
        .mockImplementation(() => Promise.reject(new Error('Server Error')));
      await expect(
        scraperController.scrapeNews('https://example.com'),
      ).rejects.toThrow(
        new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
  describe('socialAnalytics', () => {
    it('should publish a social analytics task for shareCount when the URL is valid', async () => {
      const url = 'https://example.com';
      const result = await scraperController.socialAnalytics(url);
      expect(pubSubService.publishMessage).toHaveBeenCalledWith(
        expect.any(String),
        { type: 'shareCount', data: { url } },
      );
      expect(result).toEqual({
        message: 'shareCount analytics task published',
        status: 'processing',
        pollingUrl: `/status/shareCount/${encodeURIComponent(url)}`,
      });
    });
  
    it('should throw BAD_REQUEST when no URL is provided', async () => {
      await expect(scraperController.socialAnalytics('')).rejects.toThrow(
        new HttpException('URL is required', HttpStatus.BAD_REQUEST),
      );
    });
  
    it('should throw BAD_REQUEST when an invalid URL is provided', async () => {
      await expect(scraperController.socialAnalytics('invalid-url')).rejects.toThrow(
        new HttpException('Invalid URL format', HttpStatus.BAD_REQUEST),
      );
    });
  
    it('should handle internal server error', async () => {
      jest
        .spyOn(pubSubService, 'publishMessage')
        .mockImplementation(() => Promise.reject(new Error('Server Error')));
      await expect(
        scraperController.socialAnalytics('https://example.com'),
      ).rejects.toThrow(
        new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
  describe('scrapeReviews', () => {
    it('should publish a scrape reviews task when the URL is valid', async () => {
      const url = 'https://example.com';
      const result = await scraperController.scrapeReviews(url);
      expect(pubSubService.publishMessage).toHaveBeenCalledWith(
        expect.any(String),
        { type: 'scrape-reviews', data: { url } },
      );
      expect(result).toEqual({
        message: 'Scrape reviews task published',
        status: 'processing',
        pollingUrl: `/status/scrape-reviews/${encodeURIComponent(url)}`,
      });
    });
  
    it('should throw BAD_REQUEST when no URL is provided', async () => {
      await expect(scraperController.scrapeReviews('')).rejects.toThrow(
        new HttpException('URL is required', HttpStatus.BAD_REQUEST),
      );
    });
  
    it('should throw BAD_REQUEST when an invalid URL is provided', async () => {
      await expect(scraperController.scrapeReviews('invalid-url')).rejects.toThrow(
        new HttpException('Invalid URL format', HttpStatus.BAD_REQUEST),
      );
    });
  
    it('should handle internal server error', async () => {
      jest
        .spyOn(pubSubService, 'publishMessage')
        .mockImplementation(() => Promise.reject(new Error('Server Error')));
      await expect(
        scraperController.scrapeReviews('https://example.com'),
      ).rejects.toThrow(
        new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
  describe('getJobStatus', () => {
    const url = 'https://example.com';
    
    it('should return job status from cache when type is valid and job exists', async () => {
      const type = 'scrape-images';
      const jobData = JSON.stringify({ status: 'completed', result: 'data' });
      jest.spyOn(cacheManager, 'get').mockResolvedValue(jobData);
  
      const result = await scraperController.getJobStatus(type, url);
      
      expect(cacheManager.get).toHaveBeenCalledWith(`${url}-${type}`);
      expect(result).toEqual(JSON.parse(jobData));
    });
  
    it('should return job not found when job data does not exist in cache', async () => {
      const type = 'scrape-images';
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
  
      const result = await scraperController.getJobStatus(type, url);
      
      expect(cacheManager.get).toHaveBeenCalledWith(`${url}-${type}`);
      expect(result).toEqual({
        url,
        message: 'Job not found',
        data: null,
      });
    });
  
    it('should throw BAD_REQUEST for invalid type', async () => {
      const type = 'invalid-type';
      await expect(scraperController.getJobStatus(type, url)).rejects.toThrow(
        new HttpException('Invalid type', HttpStatus.BAD_REQUEST),
      );
    });
  
    it('should handle internal server error', async () => {
      const type = 'scrape-images';
      jest.spyOn(cacheManager, 'get').mockRejectedValue(new Error('Server Error'));
  
      await expect(scraperController.getJobStatus(type, url)).rejects.toThrow(
        new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });
  describe('getKeyWordAnalysis', () => {
    const url = 'https://example.com';
    const keyword = 'test-keyword';

    it('should return job status from cache when job exists', async () => {
      const cacheKey = `${url}-keyword-${keyword}`;
      const jobData = JSON.stringify({ status: 'completed', result: 'data' });
      jest.spyOn(cacheManager, 'get').mockResolvedValue(jobData);

      const result = await scraperController.getKeyWordAnalysis(url, keyword);

      expect(cacheManager.get).toHaveBeenCalledWith(cacheKey);
      expect(result).toEqual(JSON.parse(jobData));
    });

    it('should return job not found when job data does not exist in cache', async () => {
      const cacheKey = `${url}-keyword-${keyword}`;
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);

      const result = await scraperController.getKeyWordAnalysis(url, keyword);

      expect(cacheManager.get).toHaveBeenCalledWith(cacheKey);
      expect(result).toEqual({
        url,
        keyword,
        message: 'Job not found',
        data: null,
      });
    });

    it('should handle errors gracefully', async () => {
      const cacheKey = `${url}-keyword-${keyword}`;
      jest.spyOn(cacheManager, 'get').mockRejectedValue(new Error('Server Error'));

      try {
        await scraperController.getKeyWordAnalysis(url, keyword);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Server Error');
      }
    });
  });
  
    
});
