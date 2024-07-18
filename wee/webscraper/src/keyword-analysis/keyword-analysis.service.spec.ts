import { Test, TestingModule } from '@nestjs/testing';
import { KeywordAnalysisService } from './keyword-analysis.service';
import puppeteer from 'puppeteer';

jest.mock('puppeteer');

describe('KeywordAnalysisService', () => {
  let service: KeywordAnalysisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KeywordAnalysisService],
    }).compile();

    service = module.get<KeywordAnalysisService>(KeywordAnalysisService);
  });

  describe('getKeywordRanking', () => {
    it('should return keyword ranking and results', async () => {
      const mockResults = [
        { title: 'Test Title 1', link: 'http://example.com' },
        { title: 'Test Title 2', link: 'http://example2.com' },
      ];
      (puppeteer.launch as jest.Mock).mockResolvedValueOnce({
        newPage: jest.fn().mockResolvedValueOnce({
          goto: jest.fn().mockResolvedValueOnce(undefined),
          evaluate: jest.fn().mockResolvedValueOnce(mockResults),
          close: jest.fn(),
        }),
        close: jest.fn(),
      });

      const result = await service.getKeywordRanking('http://example.com', 'test keyword');

      expect(result).toEqual({
        ranking: 1,
        results: mockResults,
      });
    });

    it('should return empty ranking if URL not found', async () => {

      const mockResults = [
        { title: 'Test Title 1', link: 'http://example.com' },
      ];
      (puppeteer.launch as jest.Mock).mockResolvedValueOnce({
        newPage: jest.fn().mockResolvedValueOnce({
          goto: jest.fn().mockResolvedValueOnce(undefined),
          evaluate: jest.fn().mockResolvedValueOnce(mockResults),
          close: jest.fn(),
        }),
        close: jest.fn(),
      });

   
      const result = await service.getKeywordRanking('http://nonexistent.com', 'test keyword');

      expect(result).toEqual({
        ranking: '',
        results: mockResults,
      });
    });

    it('should handle errors during Puppeteer interactions', async () => {
 
      (puppeteer.launch as jest.Mock).mockRejectedValueOnce(new Error('Puppeteer error'));


      try {
        await service.getKeywordRanking('http://example.com', 'test keyword');
      } catch (e) {

        expect(e).toEqual(new Error('Puppeteer error'));
      }
    });

    it('should return correct ranking when URL is in different positions', async () => {

      const mockResults = [
        { title: 'Test Title 1', link: 'http://example2.com' },
        { title: 'Test Title 2', link: 'http://example.com' },
        { title: 'Test Title 3', link: 'http://example3.com' },
      ];
      (puppeteer.launch as jest.Mock).mockResolvedValueOnce({
        newPage: jest.fn().mockResolvedValueOnce({
          goto: jest.fn().mockResolvedValueOnce(undefined),
          evaluate: jest.fn().mockResolvedValueOnce(mockResults),
          close: jest.fn(),
        }),
        close: jest.fn(),
      });


      const result = await service.getKeywordRanking('http://example.com', 'test keyword');


      expect(result).toEqual({
        ranking: 2,
        results: mockResults,
      });
    });
  });

  describe('getKeywordDensity', () => {
    it('should return keyword density', async () => {

      (puppeteer.launch as jest.Mock).mockResolvedValueOnce({
        newPage: jest.fn().mockResolvedValueOnce({
          goto: jest.fn().mockResolvedValueOnce(undefined),
          evaluate: jest.fn().mockResolvedValueOnce({
            keywordCount: 3,
            totalWords: 100,
            density: '3.00',
          }),
          close: jest.fn(),
        }),
        close: jest.fn(),
      });

      const result = await service.getKeywordDensity('http://example.com', 'test keyword');

      expect(result).toEqual({
        keywordCount: 3,
        totalWords: 100,
        density: '3.00',
      });
    });

    it('should return zero density if keyword is not present', async () => {

      (puppeteer.launch as jest.Mock).mockResolvedValueOnce({
        newPage: jest.fn().mockResolvedValueOnce({
          goto: jest.fn().mockResolvedValueOnce(undefined),
          evaluate: jest.fn().mockResolvedValueOnce({
            keywordCount: 0,
            totalWords: 100,
            density: '0.00',
          }),
          close: jest.fn(),
        }),
        close: jest.fn(),
      });


      const result = await service.getKeywordDensity('http://example.com', 'nonexistent keyword');


      expect(result).toEqual({
        keywordCount: 0,
        totalWords: 100,
        density: '0.00',
      });
    });
  });

  describe('getKeywordInAnchorTexts', () => {
    it('should return keyword presence in anchor texts', async () => {

      (puppeteer.launch as jest.Mock).mockResolvedValueOnce({
        newPage: jest.fn().mockResolvedValueOnce({
          goto: jest.fn().mockResolvedValueOnce(undefined),
          evaluate: jest.fn().mockResolvedValueOnce({
            keywordInAnchorsPercentage: '50.00',
            anchorDetails: [
              { text: 'Test Anchor', href: 'http://example.com', containsKeyword: true },
            ],
          }),
          close: jest.fn(),
        }),
        close: jest.fn(),
      });


      const result = await service.getKeywordInAnchorTexts('http://example.com', 'test keyword');


      expect(result).toEqual({
        keywordInAnchorsPercentage: '50.00',
        anchorDetails: [
          { text: 'Test Anchor', href: 'http://example.com', containsKeyword: true },
        ],
      });
    });

    it('should handle empty anchor texts gracefully', async () => {
  
      (puppeteer.launch as jest.Mock).mockResolvedValueOnce({
        newPage: jest.fn().mockResolvedValueOnce({
          goto: jest.fn().mockResolvedValueOnce(undefined),
          evaluate: jest.fn().mockResolvedValueOnce({
            keywordInAnchorsPercentage: '0.00',
            anchorDetails: [],
          }),
          close: jest.fn(),
        }),
        close: jest.fn(),
      });

      const result = await service.getKeywordInAnchorTexts('http://example.com', 'test keyword');

     
      expect(result).toEqual({
        keywordInAnchorsPercentage: '0.00',
        anchorDetails: [],
      });
    });
  });

  describe('getKeywordInImageAlts', () => {
    it('should return keyword presence in image alts and srcs', async () => {
      (puppeteer.launch as jest.Mock).mockResolvedValueOnce({
        newPage: jest.fn().mockResolvedValueOnce({
          goto: jest.fn().mockResolvedValueOnce(undefined),
          evaluate: jest.fn().mockResolvedValueOnce({
            totalImages: 10,
            keywordInAltsCount: 5,
            keywordInSrcCount: 3,
            percentageInAlts: '50.00',
            percentageInSrcs: '30.00',
            imageDetails: [
              { alt: 'Test Alt', src: 'http://example.com/image.jpg', containsKeywordInAlt: true, containsKeywordInSrc: false },
            ],
          }),
          close: jest.fn(),
        }),
        close: jest.fn(),
      });


      const result = await service.getKeywordInImageAlts('http://example.com', 'test keyword');


      expect(result).toEqual({
        totalImages: 10,
        keywordInAltsCount: 5,
        keywordInSrcCount: 3,
        percentageInAlts: '50.00',
        percentageInSrcs: '30.00',
        imageDetails: [
          { alt: 'Test Alt', src: 'http://example.com/image.jpg', containsKeywordInAlt: true, containsKeywordInSrc: false },
        ],
      });
    });

    it('should handle no images on the page', async () => {

      (puppeteer.launch as jest.Mock).mockResolvedValueOnce({
        newPage: jest.fn().mockResolvedValueOnce({
          goto: jest.fn().mockResolvedValueOnce(undefined),
          evaluate: jest.fn().mockResolvedValueOnce({
            totalImages: 0,
            keywordInAltsCount: 0,
            keywordInSrcCount: 0,
            percentageInAlts: '0.00',
            percentageInSrcs: '0.00',
            imageDetails: [],
          }),
          close: jest.fn(),
        }),
        close: jest.fn(),
      });

      const result = await service.getKeywordInImageAlts('http://example.com', 'test keyword');

      expect(result).toEqual({
        totalImages: 0,
        keywordInAltsCount: 0,
        keywordInSrcCount: 0,
        percentageInAlts: '0.00',
        percentageInSrcs: '0.00',
        imageDetails: [],
      });
    });

    it('should handle errors during Puppeteer interactions', async () => {
      (puppeteer.launch as jest.Mock).mockRejectedValueOnce(new Error('Puppeteer error'));

      try {
        await service.getKeywordInImageAlts('http://example.com', 'test keyword');
      } catch (e) {
        expect(e).toEqual(new Error('Puppeteer error'));
      }
    });
  });
});

