import { IndustryService } from '../industry-classification-app/industry.service';
import puppeteer from 'puppeteer';
import axios from 'axios';
import { extractAllowedPaths } from '../robots-app/robots';

jest.mock('puppeteer');
jest.mock('axios');
jest.mock('../robots-app/robots');

describe('IndustryService', () => {
  let service: IndustryService;

  beforeEach(() => {
    service = new IndustryService();
    process.env.access_Token = '';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('scrapeMetadata', () => {
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
      expect(mockPage.goto).toHaveBeenCalledWith(mockUrl, { waitUntil: 'domcontentloaded' });
      expect(mockBrowser.close).toHaveBeenCalled();
    });

    it('should throw an error if URL is not allowed to scrape', async () => {
      const mockUrl = 'https://example.com';
      (extractAllowedPaths as jest.Mock).mockResolvedValue(new Set(['/not-allowed']));

      await expect(service.scrapeMetadata(mockUrl)).rejects.toThrow('URL IS NOT ALLOWED TO SCRAPE');
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

      await expect(service.scrapeMetadata(mockUrl)).rejects.toThrow('Error scraping metadata');
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

      expect(result).toBe('Internet & Direct Marketing Retail');
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
      (extractAllowedPaths as jest.Mock).mockResolvedValue(new Set(['/allowed-path']));
      const result = await IndustryService.checkAllowed(mockUrl);
      expect(result).toBe(true);
    });

    it('should return false if path is not allowed', async () => {
      const mockUrl = 'https://example.com/not-allowed';
      (extractAllowedPaths as jest.Mock).mockResolvedValue(new Set(['/allowed-path']));
      const result = await IndustryService.checkAllowed(mockUrl);
      expect(result).toBe(false);
    });

    it('should return true if wildcard path is allowed', async () => {
      const mockUrl = 'https://example.com/allowed-path/subpath';
      (extractAllowedPaths as jest.Mock).mockResolvedValue(new Set(['/allowed-path/*']));
      const result = await IndustryService.checkAllowed(mockUrl);
      expect(result).toBe(true);
    });
  });
});
