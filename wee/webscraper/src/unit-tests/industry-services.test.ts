import { IndustryService } from '../industry-classification-app/industry.service';
import puppeteer from 'puppeteer';
import axios from 'axios';
import { extractAllowedPaths } from '../robots-app/robots';


interface Metadata {
  title: string | null;
  description: string | null;
  keywords: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
}

jest.mock('puppeteer');
jest.mock('axios');
jest.mock('../robots-app/robots');

describe('IndustryService', () => {
  let service: IndustryService;

  beforeEach(() => {
    service = new IndustryService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('scrapeMetadata', () => {
    it('should throw "Method not implemented" error', async () => {
      // Mock the URL to be passed to the scrapeMetadata method
      const mockUrl = 'https://example.com';

      // Test whether calling scrapeMetadata throws an error with the expected message
      expect(() => IndustryService.scrapeMetadata(mockUrl)).toThrow(
        'Method not implemented.'
      );
    });

    it('should scrape metadata and classify industry successfully', async () => {
      jest.setTimeout(60000);
      const mockUrl = 'https://www.takealot.co.za';
      const mockMetadata = {
        title: "Takealot.com: Online Shopping | SA's leading online store",
        description:
          "South Africa's leading online store. Fast, reliable delivery to your door. Many ways to pay. Shop anything you can imagine: TVs, laptops, cellphones, kitchen appliances, toys, books, beauty & more. Shop the mobile app anytime, anywhere.",
        keywords: null,
        ogTitle: "Takealot.com: Online Shopping | SA's leading online store",
        ogDescription:
          "South Africa's leading online store. Fast, reliable delivery to your door. Many ways to pay. Shop anything you can imagine: TVs, laptops, cellphones, kitchen appliances, toys, books, beauty & more. Shop the mobile app anytime, anywhere.",
        ogImage: 'https://www.takealot.com/static/images/logo_transparent.png',
      };

      (extractAllowedPaths as jest.Mock).mockResolvedValue(new Set(['/']));

      const mockPage = {
        goto: jest.fn(),
        evaluate: jest.fn().mockResolvedValue(mockMetadata),
      };

      const mockBrowser = {
        newPage: jest.fn().mockResolvedValue(mockPage),
        close: jest.fn(),
      };

      (puppeteer.launch as jest.Mock).mockResolvedValue(mockBrowser);

      (axios.post as jest.Mock).mockResolvedValue({
        data: [[{ label: 'Internet & Direct Marketing Retail' }]],
      });

      const result = await service.scrapeMetadata(mockUrl);

      expect(result.metadata).toEqual(mockMetadata);
      expect(result.industry).toBe('Internet & Direct Marketing Retail');
      expect(mockPage.goto).toHaveBeenCalledWith(mockUrl, {
        waitUntil: 'domcontentloaded',
      });
      expect(mockBrowser.close).toHaveBeenCalled();
    });

    it('should throw an error if URL is not allowed to scrape', async () => {
      const mockUrl = 'https://example.com';
      (extractAllowedPaths as jest.Mock).mockResolvedValue(
        new Set(['/not-allowed'])
      );

      await expect(service.scrapeMetadata(mockUrl)).rejects.toThrow(
        'URL IS NOT ALLOWED TO SCRAPE'
      );
    });

    it('should handle errors during scraping', async () => {
      const mockUrl = 'https://example.com';
      (extractAllowedPaths as jest.Mock).mockResolvedValue(new Set(['/']));

      const mockPage = {
        goto: jest.fn().mockRejectedValue(new Error('Page error')),
      };
      const mockBrowser = {
        newPage: jest.fn().mockResolvedValue(mockPage),
        close: jest.fn(),
      };
      (puppeteer.launch as jest.Mock).mockResolvedValue(mockBrowser);

      await expect(service.scrapeMetadata(mockUrl)).rejects.toThrow(
        'Error scraping metadata'
      );
      expect(mockBrowser.close).toHaveBeenCalled();
    });
  });

  describe('classifyIndustry', () => {
    it('should classify industry successfully', async () => {
      const mockMetadata = {
        title: "Takealot.com: Online Shopping | SA's leading online store",
        description:
          "South Africa's leading online store. Fast, reliable delivery to your door. Many ways to pay. Shop anything you can imagine: TVs, laptops, cellphones, kitchen appliances, toys, books, beauty & more. Shop the mobile app anytime, anywhere.",
        keywords: null,
        ogTitle: "Takealot.com: Online Shopping | SA's leading online store",
        ogDescription:
          "South Africa's leading online store. Fast, reliable delivery to your door. Many ways to pay. Shop anything you can imagine: TVs, laptops, cellphones, kitchen appliances, toys, books, beauty & more. Shop the mobile app anytime, anywhere.",
        ogImage: 'https://www.takealot.com/static/images/logo_transparent.png',
      };

      const mockResponse = {
        data: [[{ label: 'Internet & Direct Marketing Retail' }]],
      };

      (axios.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service['classifyIndustry'](mockMetadata);

      expect(result.label).toBe('Internet & Direct Marketing Retail');
      expect(axios.post).toHaveBeenCalledWith(
        service['HUGGING_FACE_API_URL'],
        { inputs: expect.stringContaining('Takealot') },
        { headers: { Authorization: `Bearer ${process.env.access_Token}` } }
      );
    });
  });

  describe('checkAllowed', () => {
    it('should return true if path is allowed', async () => {
      const mockUrl = 'https://example.com/allowed-path';
      (extractAllowedPaths as jest.Mock).mockResolvedValue(
        new Set(['/allowed-path'])
      );
      const result = await IndustryService.checkAllowed(mockUrl);
      expect(result).toBe(true);
    });

    it('should return false if path is not allowed', async () => {
      const mockUrl = 'https://example.com/not-allowed';
      (extractAllowedPaths as jest.Mock).mockResolvedValue(
        new Set(['/allowed-path'])
      );
      const result = await IndustryService.checkAllowed(mockUrl);
      expect(result).toBe(false);
    });

    it('should return true if wildcard path is allowed', async () => {
      const mockUrl = 'https://example.com/allowed-path/subpath';
      (extractAllowedPaths as jest.Mock).mockResolvedValue(
        new Set(['/allowed-path/*'])
      );
      const result = await IndustryService.checkAllowed(mockUrl);
      expect(result).toBe(true);
    });
  });


  describe('tryClassifyIndustry', () => {
    it('should classify industry successfully on first attempt', async () => {
      const mockMetadata: Metadata = {
        title: 'Mock Title',
        description: 'Mock Description',
        keywords: 'Mock Keywords',
        ogTitle: null,
        ogDescription: null,
        ogImage: null,
      };
      const expectedIndustry = 'Some Industry';

      // Mock the classifyIndustry function to succeed
      const service = new IndustryService();
      service['classifyIndustry'] = jest.fn().mockResolvedValueOnce(expectedIndustry);

      const result = await service['tryClassifyIndustry'](mockMetadata);

      expect(result).toBe(expectedIndustry);
    });

    it('should retry and classify industry successfully after one failed attempt', async () => {
      const mockMetadata: Metadata = {
        title: 'Mock Title',
        description: 'Mock Description',
        keywords: 'Mock Keywords',
        ogTitle: null,
        ogDescription: null,
        ogImage: null,
      };
      const expectedIndustry = 'Some Industry';

      // Mock the classifyIndustry function to fail once and then succeed
      const service = new IndustryService();
      service['classifyIndustry'] = jest.fn()
        .mockRejectedValueOnce(new Error('Error on first attempt'))
        .mockResolvedValueOnce(expectedIndustry);

      const result = await service['tryClassifyIndustry'](mockMetadata);

      expect(result).toBe(expectedIndustry);
    });

    it('should return "No classification" after two failed attempts', async () => {
      const mockMetadata: Metadata = {
        title: 'Mock Title',
        description: 'Mock Description',
        keywords: 'Mock Keywords',
        ogTitle: null,
        ogDescription: null,
        ogImage: null,
      };


      // Mock the classifyIndustry function to fail twice
      const service = new IndustryService();
      service['classifyIndustry'] = jest.fn().mockRejectedValue(new Error('Error on every attempt'));

      const result = await service['tryClassifyIndustry'](mockMetadata);

      expect(result.label).toBe(' ');

    });
  });
  describe('calculateIndustryPercentages', () => {
    it('should calculate industry percentages correctly', async () => {
      const mockUrls = 'https://example1.com,https://example2.com,https://example3.com';
      const mockData = [
        { success: true, metadata: { industry: 'Technology' } },
        { success: true, metadata: { industry: 'Finance' } },
        { success: true, metadata: { industry: 'Technology' } },
      ];

      (axios.get as jest.Mock).mockResolvedValue({ data: mockData });

      const result = await service.calculateIndustryPercentages(mockUrls);

      expect(result.industryPercentages).toEqual([
        { industry: 'Technology', percentage: '66.67' },
        { industry: 'Finance', percentage: '33.33' },
      ]);
      expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/api/scrapeIndustry', { params: { urls: mockUrls } });
    });

    it('should handle no classification cases correctly', async () => {
      const mockUrls = 'https://example1.com,https://example2.com,https://example3.com';
      const mockData = [
        { success: true, metadata: { industry: 'Technology' } },
        { success: true, metadata: { industry: 'Finance' } },
        { success: false, metadata: null },
      ];

      (axios.get as jest.Mock).mockResolvedValue({ data: mockData });

      const result = await service.calculateIndustryPercentages(mockUrls);

      expect(result.industryPercentages).toEqual([
        { industry: 'Technology', percentage: '33.33' },
        { industry: 'Finance', percentage: '33.33' },
        { industry: 'No classification', percentage: '33.33' },
      ]);
      expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/api/scrapeIndustry', { params: { urls: mockUrls } });
    });

    it('should return "No classification" if all classifications fail', async () => {
      const mockUrls = 'https://example1.com,https://example2.com,https://example3.com';
      const mockData = [
        { success: false, metadata: null },
        { success: false, metadata: null },
        { success: false, metadata: null },
      ];

      (axios.get as jest.Mock).mockResolvedValue({ data: mockData });

      const result = await service.calculateIndustryPercentages(mockUrls);

      expect(result.industryPercentages).toEqual([
        { industry: 'No classification', percentage: '100.00' },
      ]);
      expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/api/scrapeIndustry', { params: { urls: mockUrls } });
    });

    it('should throw an error if axios request fails', async () => {
      const mockUrls = 'https://example1.com,https://example2.com,https://example3.com';
      (axios.get as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(service.calculateIndustryPercentages(mockUrls)).rejects.toThrow('Error calculating industry percentages');
      expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/api/scrapeIndustry', { params: { urls: mockUrls } });
    });
  });
  describe('domainMatch', () => {
    it('should classify industry based on the URL successfully', async () => {
      const mockUrl = 'https://example.com';
      const expectedLabelScore = {
        label: 'Technology',
        score: 0.95,
      };

      (axios.post as jest.Mock).mockResolvedValue({
        data: [[{ label: 'Technology', score: 0.95 }]],
      });

      const result = await service.domainMatch(mockUrl);

      expect(result).toEqual(expectedLabelScore);
      expect(axios.post).toHaveBeenCalledWith(
        service['HUGGING_FACE_API_URL'],
        { inputs: mockUrl },
        {
          headers: {
            Authorization: `Bearer ${process.env.access_Token}`,
          },
        }
      );
    });

    it('should throw an error if classification fails', async () => {
      const mockUrl = 'https://example.com';

      (axios.post as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(service.domainMatch(mockUrl)).rejects.toThrow(
        'Error classifying industry based on URL'
      );
    });
  });

  describe('compareIndustries', () => {
    it('should compare industry classifications from scrapeMetadata and domainMatch', async () => {
      const mockUrls = 'https://example1.com,https://example2.com';
      const mockScrapeMetadata = {
        metadata: {
          title: 'Example 1',
          description: 'Description 1',
          keywords: 'Keywords 1',
          ogTitle: 'OG Title 1',
          ogDescription: 'OG Description 1',
          ogImage: 'OG Image 1',
        },
        industry: 'Technology',
        score: 0.9,
      };
      const mockDomainMatch = {
        label: 'Technology',
        score: 0.95,
      };

      jest
        .spyOn(service, 'scrapeMetadata')
        .mockResolvedValueOnce(mockScrapeMetadata)
        .mockResolvedValueOnce(mockScrapeMetadata);
      jest.spyOn(service, 'domainMatch').mockResolvedValueOnce(mockDomainMatch).mockResolvedValueOnce(mockDomainMatch);

      const result = await service.compareIndustries(mockUrls);

      expect(result.comparisons).toEqual([
        {
          url: 'https://example1.com',
          scrapeMetadata: {
            scrapeIndustry: 'Technology',
            scrapeScore: 0.9,
          },
          domainMatchIndustry: mockDomainMatch,
          match: true,
        },
        {
          url: 'https://example2.com',
          scrapeMetadata: {
            scrapeIndustry: 'Technology',
            scrapeScore: 0.9,
          },
          domainMatchIndustry: mockDomainMatch,
          match: true,
        },
      ]);
    });

    it('should handle different classifications between scrapeMetadata and domainMatch', async () => {
      const mockUrls = 'https://example1.com,https://example2.com';
      const mockScrapeMetadata1 = {
        metadata: {
          title: 'Example 1',
          description: 'Description 1',
          keywords: 'Keywords 1',
          ogTitle: 'OG Title 1',
          ogDescription: 'OG Description 1',
          ogImage: 'OG Image 1',
        },
        industry: 'Technology',
        score: 0.9,
      };
      const mockScrapeMetadata2 = {
        metadata: {
          title: 'Example 2',
          description: 'Description 2',
          keywords: 'Keywords 2',
          ogTitle: 'OG Title 2',
          ogDescription: 'OG Description 2',
          ogImage: 'OG Image 2',
        },
        industry: 'Finance',
        score: 0.8,
      };
      const mockDomainMatch1 = {
        label: 'Technology',
        score: 0.95,
      };
      const mockDomainMatch2 = {
        label: 'Healthcare',
        score: 0.85,
      };

      jest
        .spyOn(service, 'scrapeMetadata')
        .mockResolvedValueOnce(mockScrapeMetadata1)
        .mockResolvedValueOnce(mockScrapeMetadata2);
      jest
        .spyOn(service, 'domainMatch')
        .mockResolvedValueOnce(mockDomainMatch1)
        .mockResolvedValueOnce(mockDomainMatch2);

      const result = await service.compareIndustries(mockUrls);

      expect(result.comparisons).toEqual([
        {
          url: 'https://example1.com',
          scrapeMetadata: {
            scrapeIndustry: 'Technology',
            scrapeScore: 0.9,
          },
          domainMatchIndustry: mockDomainMatch1,
          match: true,
        },
        {
          url: 'https://example2.com',
          scrapeMetadata: {
            scrapeIndustry: 'Finance',
            scrapeScore: 0.8,
          },
          domainMatchIndustry: mockDomainMatch2,
          match: false,
        },
      ]);
    });

    it('should throw an error if comparison fails', async () => {
      const mockUrls = 'https://example1.com,https://example2.com';

      jest.spyOn(service, 'scrapeMetadata').mockRejectedValue(new Error('Error comparing industry classifications'));
      jest.spyOn(service, 'domainMatch').mockRejectedValue(new Error('Domain match error'));

      await expect(service.compareIndustries(mockUrls)).rejects.toThrow(
        'Error comparing industry classifications'
      );
    });
  });

  describe('countTrueDomainMatches', () => {
    it('should count true domain matches correctly', async () => {
      const mockUrls = 'https://example1.com,https://example2.com,https://example3.com';
      const mockScrapeResults = [
        { industry: 'Technology' },
        { industry: 'Finance' },
        { industry: 'Technology' },
      ];
      const mockDomainMatches = [
        { label: 'Technology' },
        { label: 'Technology' },
        { label: 'Finance' },
      ];

      jest.spyOn(service, 'scrapeMetadata').mockImplementation(async (url) => {
        const index = mockUrls.split(',').indexOf(url);
        return {
          metadata: {
            title: 'Mock Title',
            description: 'Mock Description',
            keywords: 'Mock Keywords',
            ogTitle: null,
            ogDescription: null,
            ogImage: null,
          },
          industry: mockScrapeResults[index].industry,
          score: 0.9,
        };
      });
      

      jest.spyOn(service, 'domainMatch').mockImplementation(async (url) => {
        const index = mockUrls.split(',').indexOf(url);
        return {
          label: mockDomainMatches[index].label,
          score: 0.8, 
        };
      });
      

      const result = await service.countTrueDomainMatches(mockUrls);

      expect(result).toBe(33.33333333333333); // 1 matches out of three URLs
    });

    it('should handle error gracefully', async () => {
      const mockUrls = 'https://example1.com,https://example2.com,https://example3.com';

      jest.spyOn(service, 'scrapeMetadata').mockRejectedValue(new Error('Scrape metadata error'));

      await expect(service.countTrueDomainMatches(mockUrls)).rejects.toThrow(
        'Error processing URL: https://example1.com'
      );
    });
  });
});
