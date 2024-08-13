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

      const mockPage = {
        goto: jest.fn(),
        evaluate: jest.fn(),
        authenticate: jest.fn(),
        close: jest.fn(),
        setViewport: jest.fn(),
      } as unknown as puppeteer.Page;
  
      const mockBrowser = {
        newPage: jest.fn().mockResolvedValue(mockPage),
        close: jest.fn(),
      } as unknown as puppeteer.Browser;

      // Mock environment variables
      process.env.PROXY_USERNAME = 'username';
      process.env.PROXY_PASSWORD = 'password';

      const result = await service.seoAnalysis('http://example.com', robots, mockBrowser);

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
        isUrlWordsInDescription: false,
        recommendations: `The meta description is short at 16 characters. Consider adding more details to reach the optimal length of 120-160 characters. The words from the URL (example) aren't included in the meta description. Including these can help search engines better understand the relevance of your page.`,
      });
    });
    it('should handle an empty meta description', async () => {
      const htmlContent = '<html><head><meta name="description" content=""></head></html>';
      const url = 'http://example.com';
  
      const result = await service.analyzeMetaDescription(htmlContent, url);
  
      expect(result).toEqual({
        metaDescription: '',
        length: 0,
        isUrlWordsInDescription: false,
        recommendations: `The meta description is short at 0 characters. Consider adding more details to reach the optimal length of 120-160 characters. The words from the URL (example) aren't included in the meta description. Including these can help search engines better understand the relevance of your page.`,
      });
    });
  
    it('should handle missing meta description', async () => {
      const htmlContent = '<html><head></head></html>';
      const url = 'http://example.com';
  
      const result = await service.analyzeMetaDescription(htmlContent, url);
  
      expect(result).toEqual({
        metaDescription: '',
        length: 0,
        isUrlWordsInDescription: false,
        recommendations: `The meta description is short at 0 characters. Consider adding more details to reach the optimal length of 120-160 characters. The words from the URL (example) aren't included in the meta description. Including these can help search engines better understand the relevance of your page.`,
      });
    });
    it('should handle malformed HTML content', async () => {
      const htmlContent = '<html><head><meta name="description" content="Test description"></head>';
      const url = 'http://example.com';
  
      const result = await service.analyzeMetaDescription(htmlContent, url);
  
      expect(result).toEqual({
        metaDescription: 'Test description',
        length: 16,
        isUrlWordsInDescription: false,
        recommendations: `The meta description is short at 16 characters. Consider adding more details to reach the optimal length of 120-160 characters. The words from the URL (example) aren't included in the meta description. Including these can help search engines better understand the relevance of your page.`,
      });
    });
  
    it('should handle errors during meta description analysis', async () => {
      const htmlContent = '<html><head><meta name="description" content="Test description"></head>';
      const url = 'http://example.com';
  
      jest.spyOn(service, 'analyzeMetaDescription').mockRejectedValue(new Error('Unexpected error'));
  
      await expect(service.analyzeMetaDescription(htmlContent, url)).rejects.toThrow('Unexpected error');
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
    it('should handle errors when fetching HTML content', async () => {
      const url = 'http://nonexistenturl.com';
  
      // Mock axios to simulate a network error
      (axios.get as jest.Mock).mockRejectedValue(new Error('Network error'));
  
      await expect(service.fetchHtmlContent(url)).rejects.toThrow('Error fetching HTML from http://nonexistenturl.com: Network error');
    });
    it('should handle empty HTML content', async () => {
      const url = 'http://example.com';
      const htmlContent = '';
  
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
          authenticate: jest.fn(),
        }),
        close: jest.fn(),
      } as unknown as puppeteer.Browser;

      // Mock environment variables
      process.env.PROXY_USERNAME = 'username';
      process.env.PROXY_PASSWORD = 'password';

      jest.spyOn(puppeteer, 'launch').mockResolvedValue(browser as any);

      jest.spyOn(service, 'isImageOptimized').mockResolvedValue({
        optimized: true,
        reasons: [],
      });

      const result = await service.analyzeImageOptimization(url, browser);

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
  describe('isImageOptimized', () => {
    it('should handle unsupported image formats', async () => {
      const imageUrl = 'http://example.com/image.svg';

      (axios.get as jest.Mock).mockResolvedValue({
        headers: {
          'content-type': 'image/svg+xml',
        },
      });
  
      const result = await service.isImageOptimized(imageUrl);
  
      expect(result.optimized).toBe(true); 
      expect(result.reasons).toEqual([]); 
    });
  });
  
  describe('analyzeTitleTag', () => {
    it('should return title tag analysis', async () => {
      const htmlContent = '<html><head><title>Test Title</title></head></html>';
      const result = await service.analyzeTitleTag(htmlContent);

      expect(result).toEqual({
        titleTag: 'Test Title',
        length: 10,
        recommendations: 'Your title tag is too short (10 characters). For better visibility and SEO, it should ideally be between 50 and 60 characters.',
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
        recommendations: 'We found the following heading levels: H1, H2.',
      });
    });
    it('should handle pages with no headings', async () => {
      const htmlContent = '<html><body></body></html>';
      const result = await service.analyzeHeadings(htmlContent);
  
      expect(result.headings).toEqual([]);
      expect(result.count).toBe(0);
      expect(result.recommendations).toBe('No headings (H1-H6) found. Consider adding headings to improve content structure and SEO.');
    });
  });
  describe('analyzeContentQuality', () => {
    it('should return content quality analysis', async () => {
      const htmlContent = '<html><body>This is a test content. This is a test content.</body></html>';
      const result = await service.analyzeContentQuality(htmlContent);

      expect(result.textLength).toBe(8);
      expect(result.uniqueWordsPercentage).toBeCloseTo(50); 
      expect(result.repeatedWords.length).toBe(4);
      expect(result.recommendations).toBe('The content is currently 8 words long. For better engagement and SEO performance, consider expanding your content to be more than 500 words. This allows you to cover topics more comprehensively and improves your chances of ranking higher in search results.');
    });
  });
  describe('analyzeInternalLinks', () => {
    it('should return internal links analysis', async () => {
      const htmlContent = '<html><body><a href="/page1">Link 1</a><a href="/page2">Link 2</a></body></html>';
      const result = await service.analyzeInternalLinks(htmlContent);

      expect(result.totalLinks).toBe(2); 
      expect(result.uniqueLinks).toBe(2); 
      expect(result.recommendations).toBe('The site has 2 unique internal links. Consider adding more to improve navigation and help users discover more of the content.'); 
    });
    it('should handle pages with no internal links', async () => {
      const htmlContent = '<html><body></body></html>';
      const result = await service.analyzeInternalLinks(htmlContent);
  
      expect(result.totalLinks).toBe(0);
      expect(result.uniqueLinks).toBe(0);
      expect(result.recommendations).toBe('Internal linking is sparse. Consider adding more internal links to aid navigation and SEO.');
    });
  });
  describe('analyzeSiteSpeed', () => {
    it('should return site speed analysis with recommendations if load time is above 3 seconds', async () => {
        const url = 'http://example.com';

        const mockApiResponse = {
            lighthouseResult: {
                audits: {
                    'speed-index': {
                        numericValue: 4000 
                    }
                }
            }
        };

        (axios.get as jest.Mock).mockResolvedValue({ data: mockApiResponse });

        const result = await service.analyzeSiteSpeed(url);

        expect(result.loadTime).toBe(4); 
        expect(result.recommendations).toBe('Page load time is above 3 seconds. Consider optimizing resources to improve site speed.');
    });

    it('should return site speed analysis without recommendations if load time is 3 seconds or below', async () => {
        const url = 'http://example.com';

        const mockApiResponse = {
            lighthouseResult: {
                audits: {
                    'speed-index': {
                        numericValue: 3000 
                    }
                }
            }
        };


        (axios.get as jest.Mock).mockResolvedValue({ data: mockApiResponse });

        const result = await service.analyzeSiteSpeed(url);

        expect(result.loadTime).toBe(3); 
        expect(result.recommendations).toBe(''); // No recommendations for load time <= 3 seconds
    });

});

  describe('analyzeMobileFriendliness', () => {
    it('should return mobile friendliness analysis', async () => {
      const url = 'http://example.com';

      const mockPage = {
        goto: jest.fn(),
        evaluate: jest.fn(),
        authenticate: jest.fn(),
        close: jest.fn(),
        setViewport: jest.fn(),
      } as unknown as puppeteer.Page;
  
      const mockBrowser = {
        newPage: jest.fn().mockResolvedValue(mockPage),
        close: jest.fn(),
      } as unknown as puppeteer.Browser;

      // Mock environment variables
      process.env.PROXY_USERNAME = 'username';
      process.env.PROXY_PASSWORD = 'password';

      const result = await service.analyzeMobileFriendliness(url, mockBrowser);

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
  describe('analyzeStructuredData', () => {
    it('should return structured data analysis with structured data', async () => {
        const htmlContent = `
            <html>
                <head>
                    <script type="application/ld+json">
                        {
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            "url": "http://www.example.com",
                            "name": "Example"
                        }
                    </script>
                </head>
                <body></body>
            </html>
        `;
        const result = await service.analyzeStructuredData(htmlContent);

        expect(result).toEqual({
            count: 1,
            recommendations: '',
        });
    });

    it('should return structured data analysis without structured data', async () => {
        const htmlContent = '<html><head></head><body></body></html>';
        const result = await service.analyzeStructuredData(htmlContent);

        expect(result).toEqual({
            count: 0,
            recommendations: 'No structured data found. Add structured data to improve SEO.',
        });
    });

    it('should handle multiple structured data scripts', async () => {
        const htmlContent = `
            <html>
                <head>
                    <script type="application/ld+json">{"@context": "https://schema.org", "@type": "Organization", "url": "http://www.example.com", "name": "Example"}</script>
                    <script type="application/ld+json">{"@context": "https://schema.org", "@type": "WebSite", "url": "http://www.example.com", "name": "Example"}</script>
                </head>
                <body></body>
            </html>
        `;
        const result = await service.analyzeStructuredData(htmlContent);

        expect(result).toEqual({
            count: 2,
            recommendations: '',
        });
    });
  });
  describe('analyzeIndexability', () => {
    it('should return indexability analysis for indexable page', async () => {
        const htmlContent = '<html><head><meta name="robots" content="index, follow"></head><body></body></html>';
        const result = await service.analyzeIndexability(htmlContent);

        expect(result).toEqual({
            isIndexable: true,
            recommendations: '',
        });
    });

    it('should return indexability analysis for noindex page', async () => {
        const htmlContent = '<html><head><meta name="robots" content="noindex, nofollow"></head><body></body></html>';
        const result = await service.analyzeIndexability(htmlContent);

        expect(result).toEqual({
            isIndexable: false,
            recommendations: 'Page is marked as noindex. Remove the noindex directive to ensure it is indexed by search engines.',
        });
    });

    it('should return indexability analysis for page without meta robots tag', async () => {
        const htmlContent = '<html><head></head><body></body></html>';
        const result = await service.analyzeIndexability(htmlContent);

        expect(result).toEqual({
            isIndexable: true,
            recommendations: '',
        });
    });
  });
  describe('analyzeXmlSitemap', () => {
    it('should return valid analysis for accessible XML sitemap', async () => {
        const url = 'http://example.com';
        const sitemapUrl = new URL('/sitemap.xml', url).toString();

        // Mock axios to simulate successful response
        (axios.get as jest.Mock).mockResolvedValue({ status: 200 });

        const result = await service.analyzeXmlSitemap(url);

        expect(result).toEqual({
            isSitemapValid: true,
            recommendations: '',
        });
    });

    it('should return invalid analysis for inaccessible XML sitemap', async () => {
        const url = 'http://example.com';
        const sitemapUrl = new URL('/sitemap.xml', url).toString();

        (axios.get as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));

        const result = await service.analyzeXmlSitemap(url);

        expect(result).toEqual({
            isSitemapValid: false,
            recommendations: 'XML sitemap is missing or inaccessible. Ensure it is present and accessible.',
        });
    });
});
describe('analyzeCanonicalTags', () => {
  it('should return analysis for page with canonical tag', async () => {
      const htmlContent = '<html><head><link rel="canonical" href="http://example.com/canonical"></head><body></body></html>';

      const result = await service.analyzeCanonicalTags(htmlContent);

      expect(result).toEqual({
          canonicalTag: 'http://example.com/canonical',
          isCanonicalTagPresent: true,
          recommendations: '',
      });
  });

  it('should return analysis for page without canonical tag', async () => {
      const htmlContent = '<html><head></head><body></body></html>';

      const result = await service.analyzeCanonicalTags(htmlContent);

      expect(result).toEqual({
          canonicalTag: '',
          isCanonicalTagPresent: false,
          recommendations: 'Canonical tag is missing. Add a canonical tag to avoid duplicate content issues.',
      });
  });
});
describe('runLighthouse', () => {
  it('should return scores and diagnostics for a valid URL', async () => {
    const url = 'http://example.com';
    const lighthouseResponse = {
      data: {
        lighthouseResult: {
          categories: {
            performance: { score: 0.85 },
            accessibility: { score: 0.9 },
            'best-practices': { score: 0.8 },
          },
          audits: {
            'first-contentful-paint': {
              title: 'First Contentful Paint',
              description: 'Time to first contentful paint',
              score: 0.5,
              scoreDisplayMode: 'numeric',
              displayValue: '2.0s',
            },
            'interactive': {
              title: 'Time to Interactive',
              description: 'Time to interactive',
              score: 0.8,
              scoreDisplayMode: 'numeric',
              displayValue: '4.0s',
            },
          },
        },
      },
    };

    (axios.get as jest.Mock).mockResolvedValue(lighthouseResponse);

    const result = await service.runLighthouse(url);

    expect(result).toEqual({
      scores: {
        performance: 85,
        accessibility: 90,
        bestPractices: 80,
      },
      diagnostics: {
        recommendations: [
          {
            title: 'First Contentful Paint',
            description: 'Time to first contentful paint',
            score: 0.5,
            displayValue: '2.0s',
          },
          {
            title: 'Time to Interactive',
            description: 'Time to interactive',
            score: 0.8,
            displayValue: '4.0s',
          },
        ],
      },
    });
  });

  it('should handle missing category scores gracefully', async () => {
    const url = 'http://example.com';
    const lighthouseResponse = {
      data: {
        lighthouseResult: {
          categories: {
            performance: { score: 0.85 },
            accessibility: { score: null },
            'best-practices': { score: 0.8 },
          },
          audits: {},
        },
      },
    };

    (axios.get as jest.Mock).mockResolvedValue(lighthouseResponse);

    const result = await service.runLighthouse(url);

    expect(result).toEqual({
      scores: {
        performance: 85,
        accessibility: 0,
        bestPractices: 80,
      },
      diagnostics: {
        recommendations: [],
      },
    });
  });

  it('should handle missing audit scores gracefully', async () => {
    const url = 'http://example.com';
    const lighthouseResponse = {
      data: {
        lighthouseResult: {
          categories: {
            performance: { score: 0.85 },
            accessibility: { score: 0.9 },
            'best-practices': { score: 0.8 },
          },
          audits: {
            'first-contentful-paint': {
              title: 'First Contentful Paint',
              description: 'Time to first contentful paint',
              score: null,
              scoreDisplayMode: 'numeric',
              displayValue: '2.0s',
            },
          },
        },
      },
    };

    (axios.get as jest.Mock).mockResolvedValue(lighthouseResponse);

    const result = await service.runLighthouse(url);

    expect(result).toEqual({
      scores: {
        performance: 85,
        accessibility: 90,
        bestPractices: 80,
      },
      diagnostics: {
        recommendations: [],
      },
    });
  });
});
it('should handle missing category scores gracefully', async () => {
  const url = 'http://example.com';
  const lighthouseResponse = {
    data: {
      lighthouseResult: {
        categories: {
          performance: { score: 0.85 },
          accessibility: { score: null },
          'best-practices': { score: 0.8 },
        },
        audits: {},
      },
    },
  };

  (axios.get as jest.Mock).mockResolvedValue(lighthouseResponse);

  const result = await service.runLighthouse(url);

  expect(result).toEqual({
    scores: {
      performance: 85,
      accessibility: 0, // Ensure it handles null scores correctly
      bestPractices: 80,
    },
    diagnostics: {
      recommendations: [],
    },
  });
});

});
