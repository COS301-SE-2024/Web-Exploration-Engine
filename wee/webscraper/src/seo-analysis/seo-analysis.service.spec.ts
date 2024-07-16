import { Test, TestingModule } from '@nestjs/testing';
import { SeoAnalysisService } from './seo-analysis.service';
import axios from 'axios';
import * as puppeteer from 'puppeteer';
import { RobotsResponse } from '../models/ServiceModels';

jest.mock('axios');
jest.mock('puppeteer');

describe('SeoAnalysisService', () => {
    let service: SeoAnalysisService;
    let mockBrowser: any;
    let mockPage: any;
  
    beforeEach(async () => {
      mockBrowser = {
        newPage: jest.fn().mockResolvedValue(mockPage),
        close: jest.fn(),
      };
      mockPage = {
        goto: jest.fn(),
        setViewport: jest.fn().mockResolvedValue(null), // Mock setViewport function
        evaluate: jest.fn(),
        close: jest.fn(),
      };
  
      jest.spyOn(puppeteer, 'launch').mockResolvedValue(mockBrowser);
  
      const module: TestingModule = await Test.createTestingModule({
        providers: [SeoAnalysisService],
      }).compile();
  
      service = module.get<SeoAnalysisService>(SeoAnalysisService);
    });

  describe('seoAnalysis', () => {
    it('should return an error if crawling is not allowed', async () => {
      const robots: RobotsResponse = {
        baseUrl: 'http://example.com',
        allowedPaths: [],
        disallowedPaths: [],
        isBaseUrlAllowed: false,
        isUrlScrapable: false,
      };

      const result = await service.seoAnalysis('http://example.com', robots);

      expect(result).toEqual({ error: 'Crawling not allowed for this URL' });
    });
});
  describe('analyzeMetaDescription', () => {
    it('should return meta description analysis', async () => {
      const htmlContent = '<html><head><meta name="description" content="Test description"></head></html>';
      const url = 'http://example.com';
      const result = await service.analyzeMetaDescription(htmlContent, url);

      expect(result).toEqual({
        metaDescription: 'Test description',
        length: 16,
        recommendations: 'Meta description length should be between 120 and 160 characters. Consider including words from the URL in the meta description: example.',
      });
    });
  });

  describe('fetchHtmlContent', () => {
    it('should fetch HTML content from a URL', async () => {
      const url = 'http://example.com';
      const htmlContent = '<html><body>Test</body></html>';

      (axios.get as jest.Mock).mockResolvedValue({ data: htmlContent });

      const result = await service.fetchHtmlContent(url);

      expect(result).toBe(htmlContent);
    });
  });

  describe('analyzeImageOptimization', () => {
    it('should analyze image optimization', async () => {
      const url = 'http://example.com';

      const browser = {
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn(),
          $$eval: jest.fn().mockResolvedValue([
            { src: 'http://example.com/image.jpg', alt: 'Test image' },
          ]),
          close: jest.fn(),
        }),
        close: jest.fn(),
      };

      jest.spyOn(puppeteer, 'launch').mockResolvedValue(browser as any);

      jest.spyOn(service, 'isImageOptimized').mockResolvedValue({
        optimized: true,
        reasons: [],
      });

      const result = await service.analyzeImageOptimization(url);

      expect(result).toEqual({
        totalImages: 1,
        missingAltTextCount: 0,
        nonOptimizedCount: 0,
        reasonsMap: {
          format: [],
          size: [],
          other: [],
        },
        recommendations: '',
        errorUrls: [],
      });
    });
  });
  describe('analyzeTitleTag', () => {
    it('should return title tag analysis', async () => {
      const htmlContent = '<html><head><title>Test Title</title></head></html>';
      const result = await service.analyzeTitleTag(htmlContent);

      expect(result).toEqual({
        titleTag: 'Test Title',
        length: 10,
        recommendations: 'Title tag length should be between 50 and 60 characters.',
      });
    });
});
describe('analyzeHeadings', () => {
    it('should return headings analysis', async () => {
      const htmlContent = '<html><body><h1>Heading 1</h1><h2>Heading 2</h2></body></html>';
      const result = await service.analyzeHeadings(htmlContent);

      expect(result).toEqual({
        headings: ['Heading 1', 'Heading 2'],
        count: 2,
        recommendations: '',
      });
    });
  });
  describe('analyzeContentQuality', () => {
    it('should return content quality analysis', async () => {
      const htmlContent = '<html><body>This is a test content. This is a test content.</body></html>';
      const result = await service.analyzeContentQuality(htmlContent);

      expect(result.textLength).toBe(8);
      expect(result.uniqueWordsPercentage).toBeCloseTo(50); 
      expect(result.repeatedWords.length).toBe(4);
      expect(result.recommendations).toBe('Content length should ideally be more than 500 characters.');
    });
  });
  describe('analyzeInternalLinks', () => {
    it('should return internal links analysis', async () => {
      const htmlContent = '<html><body><a href="/page1">Link 1</a><a href="/page2">Link 2</a></body></html>';
      const result = await service.analyzeInternalLinks(htmlContent);

      expect(result.totalLinks).toBe(2); 
      expect(result.uniqueLinks).toBe(2); 
      expect(result.recommendations).toBe('Internal linking is sparse. Consider adding more internal links to aid navigation and SEO.'); 
    });
  });
  describe('analyzeSiteSpeed', () => {
    it('should return site speed analysis', async () => {
      const url = 'http://example.com';
      const result = await service.analyzeSiteSpeed(url);

      expect(result.loadTime).toBeLessThanOrEqual(3); 
      expect(result.recommendations).toBe('');
    });
  });
  describe('analyzeMobileFriendliness', () => {
    it('should return mobile friendliness analysis', async () => {
      const url = 'http://example.com';
      const result = await service.analyzeMobileFriendliness(url);

      expect(result.isResponsive).toBe(undefined); 
      expect(result.recommendations).toBe('Site is not fully responsive. Ensure that the site provides a good user experience on mobile devices.'); 
    });
  });

  describe('analyzeHeadings', () => {
    it('should handle pages with no headings', async () => {
      const htmlContent = '<html><body></body></html>';
      const result = await service.analyzeHeadings(htmlContent);

      expect(result.headings).toEqual([]);
      expect(result.count).toBe(0);
      expect(result.recommendations).toBe('No headings (H1-H6) found. Add headings to improve structure.');
    });
  });
  describe('extractWordsFromUrl', () => {
    it('should extract words from a URL', () => {
      const url = 'https://example.com/path/to/page';
      const expectedWords = ['example'];

      const extractedWords = service.extractWordsFromUrl(url);

      expect(extractedWords).toEqual(expectedWords);
    });

    it('should handle URLs without protocol and www', () => {
      const url = 'example.com/path/to/page';
      const expectedWords = ['example'];

      const extractedWords = service.extractWordsFromUrl(url);

      expect(extractedWords).toEqual(expectedWords);
    });

    it('should handle URLs with hyphens and underscores', () => {
      const url = 'https://example-site.com/this_is_a_test-page';
      const expectedWords = ['example', 'site'];

      const extractedWords = service.extractWordsFromUrl(url);

      expect(extractedWords).toEqual(expectedWords);
    });
  });

  describe('areUrlWordsInDescription', () => {
    it('should return true if URL words are in meta description', () => {
      const urlWords = ['example', 'com'];
      const description = 'This is an example of a meta description for example.com';

      const result = service.areUrlWordsInDescription(urlWords, description);

      expect(result).toBe(true);
    });

    it('should return false if URL words are not in meta description', () => {
      const urlWords = ['example', 'com'];
      const description = 'This is a test meta description';

      const result = service.areUrlWordsInDescription(urlWords, description);

      expect(result).toBe(false);
    });

    it('should handle case insensitivity', () => {
      const urlWords = ['example', 'com'];
      const description = 'This is an Example of a Meta Description for Example.com';

      const result = service.areUrlWordsInDescription(urlWords, description);

      expect(result).toBe(true);
    });
  });
  describe('isImageOptimized', () => {
    it('should return optimized true for a valid optimized image with no content-length', async () => {
      const imageUrl = 'http://example.com/image.png';
  
      // Mock Axios response for image request with no content-length
      (axios.get as jest.Mock).mockResolvedValue({
        headers: {
          'content-type': 'image/png',
        },
      });
  
      const result = await service.isImageOptimized(imageUrl);
  
      expect(result.optimized).toBe(true);
      expect(result.reasons).toEqual([]);
    });
  
    it('should return optimized true for a valid optimized image with a large content-length', async () => {
      const imageUrl = 'http://example.com/large_image.jpg';
  
      // Mock Axios response for image request with a large content-length
      (axios.get as jest.Mock).mockResolvedValue({
        headers: {
          'content-type': 'image/jpeg',
          'content-length': '1000000',
        },
      });
  
      const result = await service.isImageOptimized(imageUrl);
  
      expect(result.optimized).toBe(false);
      expect(result.reasons).toEqual(["size"]);
    });
  
    it('should return optimized true for an unsupported image format with no content-length', async () => {
      const imageUrl = 'http://example.com/image.webp';
  
      // Mock Axios response for image request with an unsupported image format and no content-length
      (axios.get as jest.Mock).mockResolvedValue({
        headers: {
          'content-type': 'image/webp',
        },
      });
  
      const result = await service.isImageOptimized(imageUrl);
  
      expect(result.optimized).toBe(true);
      expect(result.reasons).toEqual([]);
    });
  
    it('should return optimized false and reasons for multiple optimization issues', async () => {
      const imageUrl = 'http://example.com/image.jpg';
  
      // Mock Axios response for image request with multiple optimization issues
      (axios.get as jest.Mock).mockResolvedValue({
        headers: {
          'content-type': 'text/html',
          'content-length': '600000', 
        },
      });
  
      const result = await service.isImageOptimized(imageUrl);
  
      expect(result.optimized).toBe(false);
      expect(result.reasons).toEqual(['format', 'size']);
    });
  
    it('should handle unexpected errors during image optimization check', async () => {
      const imageUrl = 'http://example.com/image.jpg';
  
      // Mock Axios to simulate an unexpected error
      (axios.get as jest.Mock).mockRejectedValue(new Error('Unexpected error fetching image'));
  
      const result = await service.isImageOptimized(imageUrl);
  
      expect(result.optimized).toBe(false);
      expect(result.reasons).toEqual([]);
    });
  });
  
});
