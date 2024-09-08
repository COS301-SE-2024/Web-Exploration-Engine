import { Test, TestingModule } from '@nestjs/testing';
import { ScrapeReviewsService } from './scrape-reviews.service';
import * as puppeteer from 'puppeteer';

jest.mock('puppeteer');

describe('ScrapeReviewsService', () => {
  let service: ScrapeReviewsService;
  let browser;
  let page;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScrapeReviewsService],
    }).compile();

    service = module.get<ScrapeReviewsService>(ScrapeReviewsService);
    page = {
      goto: jest.fn(),
      evaluate: jest.fn(),
      close: jest.fn(),
      waitForSelector: jest.fn(),
    };
    browser = {
      newPage: jest.fn().mockResolvedValue(page),
      close: jest.fn(),
    };
    (puppeteer.launch as jest.Mock).mockResolvedValue(browser);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('scrapeReviews', () => {
    it('should extract business name and call scrapeReviewsViaGoogle', async () => {
      const scrapeReviewsViaGoogleSpy = jest
        .spyOn(service as any, 'scrapeReviewsViaGoogle')
        .mockResolvedValue(['Review 1', 'Review 2']);
      
      const result = await service.scrapeReviews('https://example-business.com');
      
      expect(result).toEqual(['Review 1', 'Review 2']);
      expect(scrapeReviewsViaGoogleSpy).toHaveBeenCalledWith('example business');
    });

    it('should return an empty array if business name cannot be extracted', async () => {
      const result = await service.scrapeReviews('invalid-url');
      expect(result).toEqual([]);
    });
  });


  describe('scrapeReviewsFromHelloPeter', () => {
    it('should extract reviews from Hello Peter', async () => {
      page.evaluate.mockResolvedValue({
        rating: '4.5',
        reviewCount: '100',
        trustindexRating: '90',
        nps: '60',
        recommendationStatus: 'Recommended',
        reviewNumbers: ['5-star: 80', '4-star: 15', '3-star: 5'],
      });

      const reviews = await service['scrapeReviewsFromHelloPeter'](page);

      expect(reviews).toEqual([
        'Rating: 4.5',
        'Number of reviews: 100',
        'Trustindex rating: 90',
        'NPS: 60',
        'Recommendation status: Recommended',
        'Review breakdown: 5-star: 80; 4-star: 15; 3-star: 5',
      ]);
    });

    it('should handle errors during review extraction', async () => {
      page.evaluate.mockRejectedValue(new Error('Failed to load page'));

      await expect(service['scrapeReviewsFromHelloPeter'](page)).rejects.toThrow(
        'Failed to scrape reviews from Hello Peter: Failed to load page'
      );
    });
  });

  describe('extractBusinessNameFromUrl', () => {
    it('should correctly extract business name from valid URL', () => {
      const businessName = service['extractBusinessNameFromUrl']('https://www.example-business.com');
      expect(businessName).toBe('example business');
    });

    it('should return empty string for invalid URL', () => {
      const businessName = service['extractBusinessNameFromUrl']('invalid-url');
      expect(businessName).toBe('');
    });
  });
});
