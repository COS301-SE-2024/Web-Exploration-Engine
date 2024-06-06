import { IndustryService } from '../industry-classification-app/industry.service';
import * as robots from '../robots-app/robots';
import * as puppeteer from 'puppeteer';


// metadata.interface.ts
export interface Metadata {
  title: string | null;
  description: string | null;
  keywords: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
}

jest.mock('puppeteer');
const mockedPuppeteer = puppeteer as jest.Mocked<typeof puppeteer>;

jest.mock('../industry-classification-app/industry.service', () => ({
  ...jest.requireActual('../industry-classification-app/industry.service'),
  checkAllowed: jest.fn(),
}));

jest.mock('../robots-app/robots', () => ({
  extractAllowedPaths: jest.fn(),
}));
describe('IndustryService', () => {
  let industryService: IndustryService;
  let mockedCheckAllowed: jest.SpyInstance;

  beforeEach(() => {
    industryService = new IndustryService();
    mockedCheckAllowed = jest.spyOn(industryService, 'checkAllowed').mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(industryService).toBeDefined();
  });

  it('should throw an exception if crawling is not allowed', async () => {
    mockedCheckAllowed.mockResolvedValueOnce(false);

    await expect(industryService.scrapeMetadata('http://example.com')).rejects.toThrow(
      'cannot scrape this website'
    );
  });

  it('should throw an exception if scraping fails', async () => {
    mockedCheckAllowed.mockResolvedValueOnce(true);

    const page = {
      goto: jest.fn().mockImplementation(() => {
        throw new Error('cannot scrape this website');
      }),
      close: jest.fn(),
    };
    const browser = {
      newPage: jest.fn().mockResolvedValue(page),
      close: jest.fn(),
    };

    (puppeteer.launch as jest.Mock).mockResolvedValue(browser as any);

    await expect(industryService.scrapeMetadata('http://example.com')).rejects.toThrow(
      'Error scraping metadata'
    );
  });

  describe('scrapeMetadata', () => {
    it('should throw an error if website scraping is not allowed', async () => {
      // Mock extractAllowedPaths to return empty paths
      (robots.extractAllowedPaths as jest.Mock).mockResolvedValue(new Set());

      await expect(industryService.scrapeMetadata('https://www.amazon.com')).rejects.toThrowError(
        'Error scraping metadata'
      );
    });
  });

  describe('checkAllowed', () => {
    it('should return true if path is allowed', async () => {
      // Mock extractAllowedPaths to return allowed paths
      (robots.extractAllowedPaths as jest.Mock).mockResolvedValue(new Set(['/']));

      expect(await industryService.checkAllowed('https://www.takealot.com')).toBe(true);
    });
  });

  describe('classifyIndustry', () => {
    it('should classify the industry based on metadata', () => {
      const metadata: Metadata = {
        title: 'Technology News',
        description: 'The latest technology updates.',
        keywords: 'tech, news, updates',
        ogTitle: null,
        ogDescription: null,
        ogImage: null,
      };

      const industryName = industryService['classifyIndustry'](metadata);

      expect(industryName).toBe('Technology'); // Adjust based on your industries
    });

    it('should return "No classification" if no match is found', () => {
      const metadata: Metadata = {
        title: 'Random Title',
        description: 'Random Description',
        keywords: 'random, words',
        ogTitle: null,
        ogDescription: null,
        ogImage: null,
      };

      const industryName = industryService['classifyIndustry'](metadata);

      expect(industryName).toBe('No classification');
    });
  });

});
