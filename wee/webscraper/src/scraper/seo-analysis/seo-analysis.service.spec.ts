import { Test, TestingModule } from '@nestjs/testing';
import { SeoAnalysisService } from './seo-analysis.service';
import axios from 'axios';
import * as puppeteer from 'puppeteer';
import { RobotsResponse } from '../models/ServiceModels';

jest.mock('axios');
jest.mock('puppeteer');

describe('SeoAnalysisService', () => {
  let service: SeoAnalysisService;

  beforeEach(async () => {
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
});
