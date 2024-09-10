import { Test, TestingModule } from '@nestjs/testing';
import { ScrapeReviewsService } from './scrape-reviews.service';
import * as puppeteer from 'puppeteer';
import { ReviewData } from '../models/ServiceModels';

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
    page.evaluate.mockImplementation(async () => ({
        querySelector: (selector: string) => null,
        querySelectorAll: (selector: string) => []
      }));
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

    it('should return null if business name cannot be extracted', async () => {
      const result = await service.scrapeReviews('invalid-url');
      expect(result).toBeNull();
    });

    it('should log business name and review count on successful review scraping', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log');
      const scrapeReviewsViaGoogleSpy = jest
        .spyOn(service as any, 'scrapeReviewsViaGoogle')
        .mockResolvedValue(['Review 1', 'Review 2']);
  
      await service.scrapeReviews('https://example-business.com');
  
      expect(consoleLogSpy).toHaveBeenCalledWith('Starting review scraping for URL: https://example-business.com');
      expect(consoleLogSpy).toHaveBeenCalledWith('Extracted business name: example business');
      expect(scrapeReviewsViaGoogleSpy).toHaveBeenCalledWith('example business');
    });
  });

  describe('scrapeReviewsViaGoogle', () => {
    it('should extract reviews via Google search and scrape Hello Peter reviews', async () => {
      page.evaluate.mockResolvedValue(['https://www.hellopeter.com/review-page']);
      const scrapeReviewsFromHelloPeterSpy = jest
        .spyOn(service as any, 'scrapeReviewsFromHelloPeter')
        .mockResolvedValue(['Rating: 4.5', 'Number of reviews: 100']);
  
      const result = await service['scrapeReviewsViaGoogle']('example business');
  
      expect(result).toEqual(['Rating: 4.5', 'Number of reviews: 100']);
      expect(scrapeReviewsFromHelloPeterSpy).toHaveBeenCalledWith(page);
    });
  
    it('should return null if Google search fails', async () => {
      page.goto.mockRejectedValue(new Error('Network Error'));

      const result = await service['scrapeReviewsViaGoogle']('example business');

      expect(result).toBeNull();
    });

    it('should return null if no review URLs are found in Google search', async () => {
      page.evaluate.mockResolvedValue([]);
      const result = await service['scrapeReviewsViaGoogle']('example business');
      expect(result).toBeNull();
    });

    it('should handle errors when scraping individual review URLs', async () => {
      page.evaluate.mockResolvedValue(['https://www.hellopeter.com/review-page']);
      const scrapeReviewsFromHelloPeterSpy = jest
        .spyOn(service as any, 'scrapeReviewsFromHelloPeter')
        .mockRejectedValue(new Error('Page error'));
  
      const result = await service['scrapeReviewsViaGoogle']('example business');
  
      expect(result).toBeNull();
      expect(scrapeReviewsFromHelloPeterSpy).toHaveBeenCalledWith(page);
    });
  });

  describe('scrapeReviewsFromHelloPeter', () => {
    it('should handle errors during review extraction', async () => {
      page.evaluate.mockRejectedValue(new Error('Failed to load page'));

      await expect(service['scrapeReviewsFromHelloPeter'](page)).rejects.toThrow(
        'Failed to scrape reviews from Hello Peter: Failed to load page'
      );
    });

    it('should extract reviews from Hello Peter', async () => {
        page.evaluate.mockResolvedValue({
          rating: '4.5',
          reviewCount: '100',
          trustindexRating: '90',
          nps: '60',
          recommendationStatus: 'Recommended',
          reviewNumbers: ['80 Reviews', '15 Reviews', '5 Reviews'],
        });
  
        const reviews = await service['scrapeReviewsFromHelloPeter'](page);
        
        const expectedResults = {
          rating: 4.5,
          numberOfReviews: 100,
          trustIndex: 90,
          NPS: 60,
          recommendationStatus: 'Recommended',
          fiveStars: 80,
          fourStars: 15,
          threeStars: 5,
          twoStars: 0,
          oneStar: 0,
        } as ReviewData;
  
        expect(reviews).toEqual(expectedResults);
      });
  
      it('should handle errors during review extraction', async () => {
        page.evaluate.mockRejectedValue(new Error('Failed to load page'));
  
        await expect(service['scrapeReviewsFromHelloPeter'](page)).rejects.toThrow(
          'Failed to scrape reviews from Hello Peter: Failed to load page'
        );
      });
      
      it('should handle missing review elements when scraping Hello Peter', async () => {
          page.evaluate.mockResolvedValue({
            rating: '',
            reviewCount: '',
            trustindexRating: '',
            nps: '',
            recommendationStatus: '',
            reviewNumbers: []
          });
        
          const reviews = await service['scrapeReviewsFromHelloPeter'](page);

          const expectedResults = {
            rating: 0,
            numberOfReviews: 0,
            trustIndex: 0,
            NPS: 0,
            recommendationStatus: '',
            fiveStars: 0,
            fourStars: 0,
            threeStars: 0,
            twoStars: 0,
            oneStar: 0,
          } as ReviewData;
        
          expect(reviews).toEqual(expectedResults);
        });

        it('should return default values if Hello Peter HTML structure is invalid', async () => {
          page.evaluate.mockResolvedValue({
            rating: 'No rating found',
            reviewCount: 'No review count found',
            trustindexRating: 'No Trustindex rating found',
            nps: 'No NPS found',
            recommendationStatus: 'No recommendation status found',
            reviewNumbers: []
          });
        
          const reviews = await service['scrapeReviewsFromHelloPeter'](page);

          const expectedResults = {
            rating: 0,
            numberOfReviews: 0,
            trustIndex: 0,
            NPS: 0,
            recommendationStatus: 'No recommendation status found',
            fiveStars: 0,
            fourStars: 0,
            threeStars: 0,
            twoStars: 0,
            oneStar: 0,
          } as ReviewData;
        
          expect(reviews).toEqual(expectedResults);
        });
  });

  describe('extractBusinessNameFromUrl', () => {
    it('should correctly extract business name from valid URL', () => {
      const businessName = service['extractBusinessNameFromUrl']('https://www.example-business.com');
      expect(businessName).toBe('example business');
    });

    it('should return an empty string for an invalid URL', () => {
      const businessName = service['extractBusinessNameFromUrl']('invalid-url');
      expect(businessName).toBe('');
    });
  });
});
