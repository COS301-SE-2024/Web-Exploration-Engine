import { Test, TestingModule } from '@nestjs/testing';
import { KeywordAnalysisService } from './keyword-analysis.service';
import * as puppeteer from 'puppeteer';
import { url } from 'inspector';

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
        { link: 'http://example.com' },
        { link: 'http://example2.com' },
        { link: 'http://example3.com' },
        { link: 'http://example4.com' },
        { link: 'http://example5.com' },
        { link: 'http://example6.com' },
        { link: 'http://example7.com' },
        { link: 'http://example8.com' },
        { link: 'http://example9.com' },
        { link: 'http://example10.com' },
        { link: 'http://example11.com' },
      ];

      const mockPage = {
        goto: jest.fn().mockResolvedValueOnce(undefined),
        evaluate: jest.fn().mockResolvedValueOnce(mockResults),
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

      const result = await service.getKeywordRanking('http://example.com', 'test keyword', mockBrowser);

      expect(result).toEqual({
        keyword: 'test keyword',
        url: 'http://example.com',
        ranking: 1,
        topTen: [
          'example.com', 'example2.com', 'example3.com', 'example4.com', 'example5.com', 'example6.com', 'example7.com', 'example8.com', 'example9.com', 'example10.com'
        ],
        recommendation: 'The URL is ranked at position 1 for the keyword. Continue analyzing the content, backlinks, and SEO strategies to maintain your top ranking.',
      });
    });

    it('should return ranking and recommendations with URLs ranked higher', async () => {
      const mockResults = [
        { link: 'http://example.com' },
        { link: 'http://example2.com' },
        { link: 'http://example3.com' },
        { link: 'http://example4.com' },
        { link: 'http://example5.com' },
        { link: 'http://example6.com' },
        { link: 'http://example7.com' },
        { link: 'http://example8.com' },
        { link: 'http://example9.com' },
        { link: 'http://example10.com' },
        { link: 'http://example11.com' },
      ];

      const mockPage = {
        goto: jest.fn().mockResolvedValueOnce(undefined),
        evaluate: jest.fn().mockResolvedValueOnce(mockResults),
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

      const result = await service.getKeywordRanking('http://example2.com', 'test keyword', mockBrowser);

      expect(result).toEqual({
        keyword: 'test keyword',
        url: 'http://example2.com',
        ranking: 2,
        topTen: [
          'example.com', 'example2.com', 'example3.com', 'example4.com', 'example5.com', 'example6.com', 'example7.com', 'example8.com', 'example9.com', 'example10.com'
        ],
        recommendation: 'The URL is ranked at position 2 for the keyword. However, the following URLs are ranked higher: example.com. Consider analyzing the content, backlinks, and SEO strategies of these competitors to improve the ranking.',
      });
    });

    it('should return empty ranking if URL is not in results', async () => {
      const mockResults = [
        { link: 'http://example.com' },
        { link: 'http://example2.com' },
        { link: 'http://example3.com' },
        { link: 'http://example4.com' },
        { link: 'http://example5.com' },
        { link: 'http://example6.com' },
        { link: 'http://example7.com' },
        { link: 'http://example8.com' },
        { link: 'http://example9.com' },
        { link: 'http://example10.com' },
        { link: 'http://example11.com' },
      ];

      const mockPage = {
        goto: jest.fn().mockResolvedValueOnce(undefined),
        evaluate: jest.fn().mockResolvedValueOnce(mockResults),
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

      const result = await service.getKeywordRanking('http://nonexistenturl.com', 'test keyword', mockBrowser);

      expect(result).toEqual({
        keyword: 'test keyword',
        url: 'http://nonexistenturl.com',
        ranking: 'Not ranked in the top results',
        topTen: [
          'example.com', 'example2.com', 'example3.com', 'example4.com', 'example5.com', 'example6.com', 'example7.com', 'example8.com', 'example9.com', 'example10.com'
        ],
        recommendation:'The URL is not ranked in the top search results for the keyword. Consider optimizing the content, improving on-page SEO, and possibly targeting less competitive keywords. Here are the top 10 URLs for this keyword: example.com, example2.com, example3.com, example4.com, example5.com, example6.com, example7.com, example8.com, example9.com, example10.com.',
      });
    });

    it('should handle invalid URLs gracefully', async () => {
      const invalidUrl = 'invalid-url';
      await expect(service.getKeywordRanking(invalidUrl, 'test keyword', null)).rejects.toThrow('Invalid URL');
    });

    it('should handle edge cases with different URL formats', async () => {
      const mockResults = [
        { link: 'http://example.com' },
        { link: 'http://example.com/page' },
        { link: 'http://example2.com' },
        { link: 'http://example3.com' },
        { link: 'http://example4.com' },
        { link: 'http://example5.com' },
        { link: 'http://example6.com/home' },
        { link: 'http://example7.com' },
        { link: 'http://example8.com' },
        { link: 'http://example9.com/page' },
        { link: 'http://example10.com' },
        { link: 'http://example11.com' },
      ];

      const mockPage = {
        goto: jest.fn().mockResolvedValueOnce(undefined),
        evaluate: jest.fn().mockResolvedValueOnce(mockResults),
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

      const result = await service.getKeywordRanking('http://example.com', 'test keyword', mockBrowser);

      expect(result).toEqual({
        keyword: 'test keyword',
        url: 'http://example.com',  
        ranking: 1,
        topTen: [
          'example.com','example.com','example2.com', 'example3.com', 'example4.com', 'example5.com', 'example6.com', 'example7.com', 'example8.com', 'example9.com'
        ],
        recommendation: 'The URL is ranked at position 1 for the keyword. Continue analyzing the content, backlinks, and SEO strategies to maintain your top ranking.',
      });
    });
  });

  // describe('getKeywordDensity', () => {
  //   it('should return keyword density', async () => {

  //     (puppeteer.launch as jest.Mock).mockResolvedValueOnce({
  //       newPage: jest.fn().mockResolvedValueOnce({
  //         goto: jest.fn().mockResolvedValueOnce(undefined),
  //         evaluate: jest.fn().mockResolvedValueOnce({
  //           keywordCount: 3,
  //           totalWords: 100,
  //           density: '3.00',
  //         }),
  //         close: jest.fn(),
  //       }),
  //       close: jest.fn(),
  //     });

  //     const result = await service.getKeywordDensity('http://example.com', 'test keyword');

  //     expect(result).toEqual({
  //       keywordCount: 3,
  //       totalWords: 100,
  //       density: '3.00',
  //     });
  //   });
  //   it('should calculate keyword density correctly', async () => {
  //     const mockKeyword = 'test';
  //     const mockBodyText = 'This is a test text for testing keyword density. Test the test keyword density.';
  
  //     // Mock the Puppeteer methods
  //     (puppeteer.launch as jest.Mock).mockResolvedValueOnce({
  //       newPage: jest.fn().mockResolvedValueOnce({
  //         goto: jest.fn().mockResolvedValueOnce(undefined),
  //         evaluate: jest.fn().mockResolvedValueOnce(() => {
  //           const keywordCount = (mockBodyText.match(new RegExp(mockKeyword, 'gi')) || []).length;
  //           const totalWords = mockBodyText.split(/\s+/).length;
  //           const density = (keywordCount / totalWords) * 100;
  //           return {
  //             keywordCount,
  //             totalWords,
  //             density: density.toFixed(2),
  //           };
  //         }),
  //         close: jest.fn(),
  //       }),
  //       close: jest.fn(),
  //     });
  
  //     const result = await service.getKeywordDensity('http://example.com', mockKeyword);
  
  //     expect(result.keywordCount).toBe(undefined); 
  //     expect(result.totalWords).toBe(undefined); 
  //     expect(result.density).toBe(undefined); 
  
  //   });
  //   it('should handle cases with empty content', async () => {
  //     (puppeteer.launch as jest.Mock).mockResolvedValueOnce({
  //       newPage: jest.fn().mockResolvedValueOnce({
  //         goto: jest.fn().mockResolvedValueOnce(undefined),
  //         evaluate: jest.fn().mockResolvedValueOnce({
  //           keywordCount: 0,
  //           totalWords: 0,
  //           density: '0.00',
  //         }),
  //         close: jest.fn(),
  //       }),
  //       close: jest.fn(),
  //     });
  
  //     const result = await service.getKeywordDensity('http://example.com', 'test keyword');
  
  //     expect(result).toEqual({
  //       keywordCount: 0,
  //       totalWords: 0,
  //       density: '0.00',
  //     });
  //   });
  
  //   it('should handle large documents efficiently', async () => {
  //     const largeText = 'keyword '.repeat(1000) + 'some more text';
      
  //     (puppeteer.launch as jest.Mock).mockResolvedValueOnce({
  //       newPage: jest.fn().mockResolvedValueOnce({
  //         goto: jest.fn().mockResolvedValueOnce(undefined),
  //         evaluate: jest.fn().mockResolvedValueOnce({
  //           keywordCount: 1000,
  //           totalWords: 10000,
  //           density: '10.00',
  //         }),
  //         close: jest.fn(),
  //       }),
  //       close: jest.fn(),
  //     });
  
  //     const result = await service.getKeywordDensity('http://example.com', 'keyword');
  
  //     expect(result).toEqual({
  //       keywordCount: 1000,
  //       totalWords: 10000,
  //       density: '10.00',
  //     });
  //   });
  //   it('should handle cases with empty content', async () => {
  //     (puppeteer.launch as jest.Mock).mockResolvedValueOnce({
  //       newPage: jest.fn().mockResolvedValueOnce({
  //         goto: jest.fn().mockResolvedValueOnce(undefined),
  //         evaluate: jest.fn().mockResolvedValueOnce({
  //           keywordCount: 0,
  //           totalWords: 0,
  //           density: '0.00',
  //         }),
  //         close: jest.fn(),
  //       }),
  //       close: jest.fn(),
  //     });
  
  //     const result = await service.getKeywordDensity('http://example.com', 'test keyword');
  
  //     expect(result).toEqual({
  //       keywordCount: 0,
  //       totalWords: 0,
  //       density: '0.00',
  //     });
  //   });
  //   it('should handle cases with empty content', async () => {
  //     (puppeteer.launch as jest.Mock).mockResolvedValueOnce({
  //       newPage: jest.fn().mockResolvedValueOnce({
  //         goto: jest.fn().mockResolvedValueOnce(undefined),
  //         evaluate: jest.fn().mockResolvedValueOnce({
  //           keywordCount: 0,
  //           totalWords: 0,
  //           density: '0.00',
  //         }),
  //         close: jest.fn(),
  //       }),
  //       close: jest.fn(),
  //     });

  //     const result = await service.getKeywordDensity('http://example.com', 'test keyword');

  //     expect(result).toEqual({
  //       keywordCount: 0,
  //       totalWords: 0,
  //       density: '0.00',
  //     });
  //   });
  //   it('should return zero density if keyword is not present', async () => {

  //     (puppeteer.launch as jest.Mock).mockResolvedValueOnce({
  //       newPage: jest.fn().mockResolvedValueOnce({
  //         goto: jest.fn().mockResolvedValueOnce(undefined),
  //         evaluate: jest.fn().mockResolvedValueOnce({
  //           keywordCount: 0,
  //           totalWords: 100,
  //           density: '0.00',
  //         }),
  //         close: jest.fn(),
  //       }),
  //       close: jest.fn(),
  //     });


  //     const result = await service.getKeywordDensity('http://example.com', 'nonexistent keyword');


  //     expect(result).toEqual({
  //       keywordCount: 0,
  //       totalWords: 100,
  //       density: '0.00',
  //     });
  //   });
    
  // });

  // describe('getKeywordInAnchorTexts', () => {
  //   it('should return keyword presence in anchor texts', async () => {

  //     (puppeteer.launch as jest.Mock).mockResolvedValueOnce({
  //       newPage: jest.fn().mockResolvedValueOnce({
  //         goto: jest.fn().mockResolvedValueOnce(undefined),
  //         evaluate: jest.fn().mockResolvedValueOnce({
  //           keywordInAnchorsPercentage: '50.00',
  //           anchorDetails: [
  //             { text: 'Test Anchor', href: 'http://example.com', containsKeyword: true },
  //           ],
  //         }),
  //         close: jest.fn(),
  //       }),
  //       close: jest.fn(),
  //     });


  //     const result = await service.getKeywordInAnchorTexts('http://example.com', 'test keyword');


  //     expect(result).toEqual({
  //       keywordInAnchorsPercentage: '50.00',
  //       anchorDetails: [
  //         { text: 'Test Anchor', href: 'http://example.com', containsKeyword: true },
  //       ],
  //     });
  //   });
  //   it('should analyze keyword in anchor texts correctly', async () => {
  //     const mockKeyword = 'test';
  //     const mockAnchors = [
  //       { innerText: 'This is a test link', href: 'http://example.com/test' },
  //       { innerText: 'Another link', href: 'http://example.com/another' },
  //       { innerText: 'Test again', href: 'http://example.com/test-again' },
  //       { innerText: 'No keyword here', href: 'http://example.com/no-keyword' }
  //     ];
  
  //     // Mock the Puppeteer methods
  //     (puppeteer.launch as jest.Mock).mockResolvedValueOnce({
  //       newPage: jest.fn().mockResolvedValueOnce({
  //         goto: jest.fn().mockResolvedValueOnce(undefined),
  //         evaluate: jest.fn().mockResolvedValueOnce(() => {
  //           const anchorDetails = mockAnchors.map(anchor => {
  //             const text = anchor.innerText;
  //             const href = anchor.href;
  //             const containsKeyword = text.includes(mockKeyword) || href.includes(mockKeyword);
              
  //             return {
  //               text,
  //               href,
  //               containsKeyword
  //             };
  //           });
  
  //           const keywordInAnchorsCount = anchorDetails.filter(anchor => anchor.containsKeyword).length;
  //           const totalAnchors = anchorDetails.length;
  //           const keywordInAnchorsPercentage = totalAnchors > 0 ? (keywordInAnchorsCount / totalAnchors) * 100 : 0;
            
  //           return { 
  //             keywordInAnchorsPercentage: keywordInAnchorsPercentage.toFixed(2), 
  //             anchorDetails 
  //           };
  //         }),
  //         close: jest.fn(),
  //       }),
  //       close: jest.fn(),
  //     });
  
  //     const result = await service.getKeywordInAnchorTexts('http://example.com', mockKeyword);
  
  //     expect(result.keywordInAnchorsPercentage).toBe(undefined); 
  //     expect(result.anchorDetails).toEqual(undefined);

  //   });
  //   it('should handle cases with no anchor tags', async () => {
  //     (puppeteer.launch as jest.Mock).mockResolvedValueOnce({
  //       newPage: jest.fn().mockResolvedValueOnce({
  //         goto: jest.fn().mockResolvedValueOnce(undefined),
  //         evaluate: jest.fn().mockResolvedValueOnce({
  //           keywordInAnchorsPercentage: '0.00',
  //           anchorDetails: [],
  //         }),
  //         close: jest.fn(),
  //       }),
  //       close: jest.fn(),
  //     });
  
  //     const result = await service.getKeywordInAnchorTexts('http://example.com', 'test keyword');
  
  //     expect(result).toEqual({
  //       keywordInAnchorsPercentage: '0.00',
  //       anchorDetails: [],
  //     });
  //   });
  //   it('should handle images with keyword only in src attributes', async () => {
  //     (puppeteer.launch as jest.Mock).mockResolvedValueOnce({
  //       newPage: jest.fn().mockResolvedValueOnce({
  //         goto: jest.fn().mockResolvedValueOnce(undefined),
  //         evaluate: jest.fn().mockResolvedValueOnce({
  //           totalImages: 3,
  //           keywordInAltsCount: 0,
  //           keywordInSrcCount: 2,
  //           percentageInAlts: '0.00',
  //           percentageInSrcs: '66.67',
  //           imageDetails: [
  //             { alt: '', src: 'http://example.com/keyword1.jpg', containsKeywordInAlt: false, containsKeywordInSrc: true },
  //             { alt: '', src: 'http://example.com/keyword2.jpg', containsKeywordInAlt: false, containsKeywordInSrc: true },
  //             { alt: '', src: 'http://example.com/image3.jpg', containsKeywordInAlt: false, containsKeywordInSrc: false },
  //           ],
  //         }),
  //         close: jest.fn(),
  //       }),
  //       close: jest.fn(),
  //     });

  //     const result = await service.getKeywordInImageAlts('http://example.com', 'keyword');

  //     expect(result).toEqual({
  //       totalImages: 3,
  //       keywordInAltsCount: 0,
  //       keywordInSrcCount: 2,
  //       percentageInAlts: '0.00',
  //       percentageInSrcs: '66.67',
  //       imageDetails: [
  //         { alt: '', src: 'http://example.com/keyword1.jpg', containsKeywordInAlt: false, containsKeywordInSrc: true },
  //         { alt: '', src: 'http://example.com/keyword2.jpg', containsKeywordInAlt: false, containsKeywordInSrc: true },
  //         { alt: '', src: 'http://example.com/image3.jpg', containsKeywordInAlt: false, containsKeywordInSrc: false },
  //       ],
  //     });
  //   });
  //   it('should handle cases with empty anchor text', async () => {
  //     (puppeteer.launch as jest.Mock).mockResolvedValueOnce({
  //       newPage: jest.fn().mockResolvedValueOnce({
  //         goto: jest.fn().mockResolvedValueOnce(undefined),
  //         evaluate: jest.fn().mockResolvedValueOnce({
  //           keywordInAnchorsPercentage: '0.00',
  //           anchorDetails: [
  //             { text: '', href: 'http://example.com', containsKeyword: false },
  //           ],
  //         }),
  //         close: jest.fn(),
  //       }),
  //       close: jest.fn(),
  //     });
  
  //     const result = await service.getKeywordInAnchorTexts('http://example.com', 'test keyword');
  
  //     expect(result).toEqual({
  //       keywordInAnchorsPercentage: '0.00',
  //       anchorDetails: [
  //         { text: '', href: 'http://example.com', containsKeyword: false },
  //       ],
  //     });
  //   }); 
  //   it('should handle empty anchor texts gracefully', async () => {
  
  //     (puppeteer.launch as jest.Mock).mockResolvedValueOnce({
  //       newPage: jest.fn().mockResolvedValueOnce({
  //         goto: jest.fn().mockResolvedValueOnce(undefined),
  //         evaluate: jest.fn().mockResolvedValueOnce({
  //           keywordInAnchorsPercentage: '0.00',
  //           anchorDetails: [],
  //         }),
  //         close: jest.fn(),
  //       }),
  //       close: jest.fn(),
  //     });

  //     const result = await service.getKeywordInAnchorTexts('http://example.com', 'test keyword');

     
  //     expect(result).toEqual({
  //       keywordInAnchorsPercentage: '0.00',
  //       anchorDetails: [],
  //     });
  //   });
    
  // });

  // describe('getKeywordInImageAlts', () => {
  //   it('should return keyword presence in image alts and srcs', async () => {
  //     (puppeteer.launch as jest.Mock).mockResolvedValueOnce({
  //       newPage: jest.fn().mockResolvedValueOnce({
  //         goto: jest.fn().mockResolvedValueOnce(undefined),
  //         evaluate: jest.fn().mockResolvedValueOnce({
  //           totalImages: 10,
  //           keywordInAltsCount: 5,
  //           keywordInSrcCount: 3,
  //           percentageInAlts: '50.00',
  //           percentageInSrcs: '30.00',
  //           imageDetails: [
  //             { alt: 'Test Alt', src: 'http://example.com/image.jpg', containsKeywordInAlt: true, containsKeywordInSrc: false },
  //           ],
  //         }),
  //         close: jest.fn(),
  //       }),
  //       close: jest.fn(),
  //     });


  //     const result = await service.getKeywordInImageAlts('http://example.com', 'test keyword');


  //     expect(result).toEqual({
  //       totalImages: 10,
  //       keywordInAltsCount: 5,
  //       keywordInSrcCount: 3,
  //       percentageInAlts: '50.00',
  //       percentageInSrcs: '30.00',
  //       imageDetails: [
  //         { alt: 'Test Alt', src: 'http://example.com/image.jpg', containsKeywordInAlt: true, containsKeywordInSrc: false },
  //       ],
  //     });
  //   });
    

  //   it('should handle cases with no images', async () => {
  //     (puppeteer.launch as jest.Mock).mockResolvedValueOnce({
  //       newPage: jest.fn().mockResolvedValueOnce({
  //         goto: jest.fn().mockResolvedValueOnce(undefined),
  //         evaluate: jest.fn().mockResolvedValueOnce({
  //           totalImages: 0,
  //           keywordInAltsCount: 0,
  //           keywordInSrcCount: 0,
  //           percentageInAlts: '0.00',
  //           percentageInSrcs: '0.00',
  //           imageDetails: [],
  //         }),
  //         close: jest.fn(),
  //       }),
  //       close: jest.fn(),
  //     });
  
  //     const result = await service.getKeywordInImageAlts('http://example.com', 'Keyword');
  
  //     expect(result).toEqual({
  //       totalImages: 0,
  //       keywordInAltsCount: 0,
  //       keywordInSrcCount: 0,
  //       percentageInAlts: '0.00',
  //       percentageInSrcs: '0.00',
  //       imageDetails: [],
  //     });
  //   });

  //   it('should handle cases with no alt attributes', async () => {
  //     (puppeteer.launch as jest.Mock).mockResolvedValueOnce({
  //       newPage: jest.fn().mockResolvedValueOnce({
  //         goto: jest.fn().mockResolvedValueOnce(undefined),
  //         evaluate: jest.fn().mockResolvedValueOnce({
  //           totalImages: 2,
  //           keywordInAltsCount: 0,
  //           keywordInSrcCount: 1,
  //           percentageInAlts: '0.00',
  //           percentageInSrcs: '50.00',
  //           imageDetails: [
  //             { alt: '', src: 'http://example.com/image1.jpg', containsKeywordInAlt: false, containsKeywordInSrc: true },
  //             { alt: '', src: 'http://example.com/image2.jpg', containsKeywordInAlt: false, containsKeywordInSrc: false },
  //           ],
  //         }),
  //         close: jest.fn(),
  //       }),
  //       close: jest.fn(),
  //     });
  
  //     const result = await service.getKeywordInImageAlts('http://example.com', 'Keyword');
  
  //     expect(result).toEqual({
  //       totalImages: 2,
  //       keywordInAltsCount: 0,
  //       keywordInSrcCount: 1,
  //       percentageInAlts: '0.00',
  //       percentageInSrcs: '50.00',
  //       imageDetails: [
  //         { alt: '', src: 'http://example.com/image1.jpg', containsKeywordInAlt: false, containsKeywordInSrc: true },
  //         { alt: '', src: 'http://example.com/image2.jpg', containsKeywordInAlt: false, containsKeywordInSrc: false },
  //       ],
  //     });
  //   });

  //   it('should handle images with keyword only in src attributes', async () => {
  //     (puppeteer.launch as jest.Mock).mockResolvedValueOnce({
  //       newPage: jest.fn().mockResolvedValueOnce({
  //         goto: jest.fn().mockResolvedValueOnce(undefined),
  //         evaluate: jest.fn().mockResolvedValueOnce({
  //           totalImages: 3,
  //           keywordInAltsCount: 0,
  //           keywordInSrcCount: 2,
  //           percentageInAlts: '0.00',
  //           percentageInSrcs: '66.67',
  //           imageDetails: [
  //             { alt: '', src: 'http://example.com/keyword1.jpg', containsKeywordInAlt: false, containsKeywordInSrc: true },
  //             { alt: '', src: 'http://example.com/keyword2.jpg', containsKeywordInAlt: false, containsKeywordInSrc: true },
  //             { alt: '', src: 'http://example.com/image3.jpg', containsKeywordInAlt: false, containsKeywordInSrc: false },
  //           ],
  //         }),
  //         close: jest.fn(),
  //       }),
  //       close: jest.fn(),
  //     });
  
  //     const result = await service.getKeywordInImageAlts('http://example.com', 'keyword');
  
  //     expect(result).toEqual({
  //       totalImages: 3,
  //       keywordInAltsCount: 0,
  //       keywordInSrcCount: 2,
  //       percentageInAlts: '0.00',
  //       percentageInSrcs: '66.67',
  //       imageDetails: [
  //         { alt: '', src: 'http://example.com/keyword1.jpg', containsKeywordInAlt: false, containsKeywordInSrc: true },
  //         { alt: '', src: 'http://example.com/keyword2.jpg', containsKeywordInAlt: false, containsKeywordInSrc: true },
  //         { alt: '', src: 'http://example.com/image3.jpg', containsKeywordInAlt: false, containsKeywordInSrc: false },
  //       ],
  //     });
  //   });
  //   it('should correctly count and calculate keyword presence in image alts and srcs', async () => {
  //     (puppeteer.launch as jest.Mock).mockResolvedValueOnce({
  //       newPage: jest.fn().mockResolvedValueOnce({
  //         goto: jest.fn().mockResolvedValueOnce(undefined),
  //         evaluate: jest.fn().mockResolvedValueOnce({
  //           totalImages: 3,
  //           keywordInAltsCount: 2,
  //           keywordInSrcCount: 1,
  //           percentageInAlts: '66.67',
  //           percentageInSrcs: '33.33',
  //           imageDetails: [
  //             { alt: 'Keyword in alt', src: 'http://example.com/image1.jpg', containsKeywordInAlt: true, containsKeywordInSrc: false },
  //             { alt: 'Another alt', src: 'http://example.com/image2.jpg', containsKeywordInAlt: false, containsKeywordInSrc: true },
  //             { alt: '', src: 'http://example.com/image3.jpg', containsKeywordInAlt: false, containsKeywordInSrc: false },
  //           ],
  //         }),
  //         close: jest.fn(),
  //       }),
  //       close: jest.fn(),
  //     });
  
  //     const result = await service.getKeywordInImageAlts('http://example.com', 'Keyword');
  
  //     expect(result).toEqual({
  //       totalImages: 3,
  //       keywordInAltsCount: 2,
  //       keywordInSrcCount: 1,
  //       percentageInAlts: '66.67',
  //       percentageInSrcs: '33.33',
  //       imageDetails: [
  //         { alt: 'Keyword in alt', src: 'http://example.com/image1.jpg', containsKeywordInAlt: true, containsKeywordInSrc: false },
  //         { alt: 'Another alt', src: 'http://example.com/image2.jpg', containsKeywordInAlt: false, containsKeywordInSrc: true },
  //         { alt: '', src: 'http://example.com/image3.jpg', containsKeywordInAlt: false, containsKeywordInSrc: false },
  //       ],
  //     });
  //   });
  
  //   it('should handle cases where image alts and srcs do not contain the keyword', async () => {
  //     (puppeteer.launch as jest.Mock).mockResolvedValueOnce({
  //       newPage: jest.fn().mockResolvedValueOnce({
  //         goto: jest.fn().mockResolvedValueOnce(undefined),
  //         evaluate: jest.fn().mockResolvedValueOnce({
  //           totalImages: 2,
  //           keywordInAltsCount: 0,
  //           keywordInSrcCount: 0,
  //           percentageInAlts: '0.00',
  //           percentageInSrcs: '0.00',
  //           imageDetails: [
  //             { alt: 'Alt text', src: 'http://example.com/image1.jpg', containsKeywordInAlt: false, containsKeywordInSrc: false },
  //             { alt: 'Another alt text', src: 'http://example.com/image2.jpg', containsKeywordInAlt: false, containsKeywordInSrc: false },
  //           ],
  //         }),
  //         close: jest.fn(),
  //       }),
  //       close: jest.fn(),
  //     });
  
  //     const result = await service.getKeywordInImageAlts('http://example.com', 'Keyword');
  
  //     expect(result).toEqual({
  //       totalImages: 2,
  //       keywordInAltsCount: 0,
  //       keywordInSrcCount: 0,
  //       percentageInAlts: '0.00',
  //       percentageInSrcs: '0.00',
  //       imageDetails: [
  //         { alt: 'Alt text', src: 'http://example.com/image1.jpg', containsKeywordInAlt: false, containsKeywordInSrc: false },
  //         { alt: 'Another alt text', src: 'http://example.com/image2.jpg', containsKeywordInAlt: false, containsKeywordInSrc: false },
  //       ],
  //     });
  //   });
  
  //   it('should handle images with empty alt and src attributes', async () => {
  //     (puppeteer.launch as jest.Mock).mockResolvedValueOnce({
  //       newPage: jest.fn().mockResolvedValueOnce({
  //         goto: jest.fn().mockResolvedValueOnce(undefined),
  //         evaluate: jest.fn().mockResolvedValueOnce({
  //           totalImages: 3,
  //           keywordInAltsCount: 0,
  //           keywordInSrcCount: 0,
  //           percentageInAlts: '0.00',
  //           percentageInSrcs: '0.00',
  //           imageDetails: [
  //             { alt: '', src: '', containsKeywordInAlt: false, containsKeywordInSrc: false },
  //             { alt: '', src: '', containsKeywordInAlt: false, containsKeywordInSrc: false },
  //             { alt: '', src: '', containsKeywordInAlt: false, containsKeywordInSrc: false },
  //           ],
  //         }),
  //         close: jest.fn(),
  //       }),
  //       close: jest.fn(),
  //     });
  
  //     const result = await service.getKeywordInImageAlts('http://example.com', 'Keyword');
  
  //     expect(result).toEqual({
  //       totalImages: 3,
  //       keywordInAltsCount: 0,
  //       keywordInSrcCount: 0,
  //       percentageInAlts: '0.00',
  //       percentageInSrcs: '0.00',
  //       imageDetails: [
  //         { alt: '', src: '', containsKeywordInAlt: false, containsKeywordInSrc: false },
  //         { alt: '', src: '', containsKeywordInAlt: false, containsKeywordInSrc: false },
  //         { alt: '', src: '', containsKeywordInAlt: false, containsKeywordInSrc: false },
  //       ],
  //     });
  //   });
  
  //   it('should return correct results when there are no images on the page', async () => {
  //     (puppeteer.launch as jest.Mock).mockResolvedValueOnce({
  //       newPage: jest.fn().mockResolvedValueOnce({
  //         goto: jest.fn().mockResolvedValueOnce(undefined),
  //         evaluate: jest.fn().mockResolvedValueOnce({
  //           totalImages: 0,
  //           keywordInAltsCount: 0,
  //           keywordInSrcCount: 0,
  //           percentageInAlts: '0.00',
  //           percentageInSrcs: '0.00',
  //           imageDetails: [],
  //         }),
  //         close: jest.fn(),
  //       }),
  //       close: jest.fn(),
  //     });
  
  //     const result = await service.getKeywordInImageAlts('http://example.com', 'Keyword');
  
  //     expect(result).toEqual({
  //       totalImages: 0,
  //       keywordInAltsCount: 0,
  //       keywordInSrcCount: 0,
  //       percentageInAlts: '0.00',
  //       percentageInSrcs: '0.00',
  //       imageDetails: [],
  //     });
  //   });
  
  //   it('should handle errors during Puppeteer interactions gracefully', async () => {
  //     (puppeteer.launch as jest.Mock).mockRejectedValueOnce(new Error('Puppeteer error'));
  
  //     try {
  //       await service.getKeywordInImageAlts('http://example.com', 'Keyword');
  //     } catch (e) {
  //       expect(e).toEqual(new Error('Puppeteer error'));
  //     }
  //   });
  //   it('should handle cases with missing image alt attributes', async () => {
  //     (puppeteer.launch as jest.Mock).mockResolvedValueOnce({
  //       newPage: jest.fn().mockResolvedValueOnce({
  //         goto: jest.fn().mockResolvedValueOnce(undefined),
  //         evaluate: jest.fn().mockResolvedValueOnce({
  //           totalImages: 3,
  //           keywordInAltsCount: 0,
  //           keywordInSrcCount: 2,
  //           percentageInAlts: '0.00',
  //           percentageInSrcs: '66.67',
  //           imageDetails: [
  //             { alt: '', src: 'http://example.com/image1.jpg', containsKeywordInAlt: false, containsKeywordInSrc: true },
  //             { alt: '', src: 'http://example.com/image2.jpg', containsKeywordInAlt: false, containsKeywordInSrc: true },
  //             { alt: '', src: 'http://example.com/image3.jpg', containsKeywordInAlt: false, containsKeywordInSrc: false },
  //           ],
  //         }),
  //         close: jest.fn(),
  //       }),
  //       close: jest.fn(),
  //     });
  
  //     const result = await service.getKeywordInImageAlts('http://example.com', 'test keyword');
  
  //     expect(result).toEqual({
  //       totalImages: 3,
  //       keywordInAltsCount: 0,
  //       keywordInSrcCount: 2,
  //       percentageInAlts: '0.00',
  //       percentageInSrcs: '66.67',
  //       imageDetails: [
  //         { alt: '', src: 'http://example.com/image1.jpg', containsKeywordInAlt: false, containsKeywordInSrc: true },
  //         { alt: '', src: 'http://example.com/image2.jpg', containsKeywordInAlt: false, containsKeywordInSrc: true },
  //         { alt: '', src: 'http://example.com/image3.jpg', containsKeywordInAlt: false, containsKeywordInSrc: false },
  //       ],
  //     });
  //   });
  //   it('should handle cases where images have no alt text or src attributes', async () => {
  //     // Arrange
  //     (puppeteer.launch as jest.Mock).mockResolvedValueOnce({
  //       newPage: jest.fn().mockResolvedValueOnce({
  //         goto: jest.fn().mockResolvedValueOnce(undefined),
  //         evaluate: jest.fn().mockResolvedValueOnce({
  //           totalImages: 5,
  //           keywordInAltsCount: 0,
  //           keywordInSrcCount: 0,
  //           percentageInAlts: '0.00',
  //           percentageInSrcs: '0.00',
  //           imageDetails: [
  //             { alt: '', src: '', containsKeywordInAlt: false, containsKeywordInSrc: false },
  //           ],
  //         }),
  //         close: jest.fn(),
  //       }),
  //       close: jest.fn(),
  //     });

  //     const result = await service.getKeywordInImageAlts('http://example.com', 'test keyword');

  //     expect(result).toEqual({
  //       totalImages: 5,
  //       keywordInAltsCount: 0,
  //       keywordInSrcCount: 0,
  //       percentageInAlts: '0.00',
  //       percentageInSrcs: '0.00',
  //       imageDetails: [
  //         { alt: '', src: '', containsKeywordInAlt: false, containsKeywordInSrc: false },
  //       ],
  //     });
  //   });
  //   it('should handle no images on the page', async () => {

  //     (puppeteer.launch as jest.Mock).mockResolvedValueOnce({
  //       newPage: jest.fn().mockResolvedValueOnce({
  //         goto: jest.fn().mockResolvedValueOnce(undefined),
  //         evaluate: jest.fn().mockResolvedValueOnce({
  //           totalImages: 0,
  //           keywordInAltsCount: 0,
  //           keywordInSrcCount: 0,
  //           percentageInAlts: '0.00',
  //           percentageInSrcs: '0.00',
  //           imageDetails: [],
  //         }),
  //         close: jest.fn(),
  //       }),
  //       close: jest.fn(),
  //     });

  //     const result = await service.getKeywordInImageAlts('http://example.com', 'test keyword');

  //     expect(result).toEqual({
  //       totalImages: 0,
  //       keywordInAltsCount: 0,
  //       keywordInSrcCount: 0,
  //       percentageInAlts: '0.00',
  //       percentageInSrcs: '0.00',
  //       imageDetails: [],
  //     });
  //   });

  //   it('should handle errors during Puppeteer interactions', async () => {
  //     (puppeteer.launch as jest.Mock).mockRejectedValueOnce(new Error('Puppeteer error'));

  //     try {
  //       await service.getKeywordInImageAlts('http://example.com', 'test keyword');
  //     } catch (e) {
  //       expect(e).toEqual(new Error('Puppeteer error'));
  //     }
  //   });
  // });
  
});

