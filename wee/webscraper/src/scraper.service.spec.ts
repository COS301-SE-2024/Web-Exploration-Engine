import { Test, TestingModule } from "@nestjs/testing";
import { ScraperService } from "./scraper.service";
import { Cache } from 'cache-manager';
import { RobotsService } from './robots/robots.service';
import { ScrapeMetadataService } from './scrape-metadata/scrape-metadata.service';
import { ScrapeStatusService } from './scrape-status/scrape-status.service';
import { IndustryClassificationService } from './industry-classification/industry-classification.service';
import { ScrapeLogoService } from './scrape-logo/scrape-logo.service';
import { ScrapeImagesService } from './scrape-images/scrape-images.service';
import { ScreenshotService } from './screenshot-homepage/screenshot.service';
import { ScrapeContactInfoService } from './scrape-contact-info/scrape-contact-info.service';
import { ScrapeAddressService } from './scrape-address/scrape-address.service';
import { SeoAnalysisService } from './seo-analysis/seo-analysis.service';
import { PubSubService } from "./pub-sub/pub_sub.service";
import { read } from "fs";
import { mock } from "node:test";
import { add } from "cheerio/lib/api/traversing";

describe('ScraperService', () => {
    let service: ScraperService;
    
    let cacheManager: Cache;
    let pubsub: PubSubService;
    let mockMessage: any;

    // Mock services
    let mockRobotsService: RobotsService;
    let mockScrapeStatusService: ScrapeStatusService;
    let mockMetadataService: ScrapeMetadataService;
    let mockIndustryClassificationService: IndustryClassificationService;
    let mockScrapeLogoService: ScrapeLogoService;
    let mockScrapeImagesService: ScrapeImagesService;
    let mockScreenshotService: ScreenshotService;
    let mockScrapeContactInfoService: ScrapeContactInfoService;
    let mockScrapeAddressService: ScrapeAddressService;
    let mockSeoAnalysisService: SeoAnalysisService;


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ScraperService,
                {
                    provide: 'CACHE_MANAGER',
                    useValue: {
                        get: jest.fn(),
                        set: jest.fn(),
                        del: jest.fn(),
                    } as Partial<Cache>,
                },
                {
                    provide: RobotsService,
                    useValue: {
                        readRobotsFile: jest.fn(),
                    },
                },
                {
                    provide: ScrapeMetadataService,
                    useValue: {
                        scrapeMetadata: jest.fn(),
                    },
                },
                {
                    provide: ScrapeStatusService,
                    useValue: {
                        scrapeStatus: jest.fn(),
                    },
                },
                {
                    provide: IndustryClassificationService,
                    useValue: {
                        classifyIndustry: jest.fn(),
                    },
                },
                {
                    provide: ScrapeLogoService,
                    useValue: {
                        scrapeLogo: jest.fn(),
                    },
                },
                {
                    provide: ScrapeImagesService,
                    useValue: {
                        scrapeImages: jest.fn(),
                    },
                },
                {
                    provide: ScreenshotService,
                    useValue: {
                        captureScreenshot: jest.fn(),
                    },
                },
                {
                    provide: ScrapeContactInfoService,
                    useValue: {
                        scrapeContactInfo: jest.fn(),
                    },
                },
                {
                    provide: ScrapeAddressService,
                    useValue: {
                        scrapeAddress: jest.fn(),
                    },
                },
                {
                    provide: SeoAnalysisService,
                    useValue: {
                        fetchHtmlContent: jest.fn(),
                        seoAnalysis: jest.fn(),
                        analyzeMetaDescription: jest.fn(),
                        analyzeTitleTag: jest.fn(),
                        analyzeHeadings: jest.fn(),
                        analyzeImageOptimization: jest.fn(),
                        analyzeInternalLinks: jest.fn(),
                        analyzeSiteSpeed: jest.fn(),
                        analyzeMobileFriendliness: jest.fn(),
                        analyzeStructuredData: jest.fn(),
                        analyzeIndexability: jest.fn(),
                        analyzeXmlSitemap: jest.fn(),
                        analyzeCanonicalTags: jest.fn(),
                        runLighthouse: jest.fn(),
                        analyzeContentQuality: jest.fn(),
                    },
                },
                {
                    provide: PubSubService,
                    useValue: {
                        subscribe: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<ScraperService>(ScraperService);
        cacheManager = module.get<Cache>('CACHE_MANAGER');
        pubsub = module.get<PubSubService>(PubSubService);

        // Mock services
        mockRobotsService = module.get<RobotsService>(RobotsService);
        mockScrapeStatusService = module.get<ScrapeStatusService>(ScrapeStatusService);
        mockMetadataService = module.get<ScrapeMetadataService>(ScrapeMetadataService);
        mockIndustryClassificationService = module.get<IndustryClassificationService>(IndustryClassificationService);
        mockScrapeLogoService = module.get<ScrapeLogoService>(ScrapeLogoService);
        mockScrapeImagesService = module.get<ScrapeImagesService>(ScrapeImagesService);
        mockScreenshotService = module.get<ScreenshotService>(ScreenshotService);
        mockScrapeContactInfoService = module.get<ScrapeContactInfoService>(ScrapeContactInfoService);
        mockScrapeAddressService = module.get<ScrapeAddressService>(ScrapeAddressService);
        mockSeoAnalysisService = module.get<SeoAnalysisService>(SeoAnalysisService);


        mockMessage = {
            data: { toString: jest.fn() },
            ack: jest.fn(),
        };
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getCachedData', () => {
        it('should return cached data if status is completed', async () => {
          const url = 'https://example.com';
          const cachedData = { status: 'completed', result: 'some result' };
          
          jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(JSON.stringify(cachedData));
    
          const result = await service.getCachedData(url);
    
          expect(result).toEqual(cachedData);
          expect(cacheManager.get).toHaveBeenCalledWith(url);
        });
    
        it('should return null if status is processing', async () => {
          const url = 'http://example.com';
          const cachedData = { status: 'processing', pollingURL: '/status' };
          jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(JSON.stringify(cachedData));
    
          const result = await service.getCachedData(url);
    
          expect(result).toBeNull();
          expect(cacheManager.get).toHaveBeenCalledWith(url);
        });
    
        it('should return null if no data is cached', async () => {
          const url = 'http://example.com';
          jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
          const result = await service.getCachedData(url);
    
          expect(result).toBeNull();
          expect(cacheManager.get).toHaveBeenCalledWith(url);
        });
    });

    describe('listenForScrapingTasks', () => {
        it('should subscribe to scraping tasks', async () => {
            const subscribeSpy = jest.spyOn(pubsub, 'subscribe');
            await service.listenForScrapingTasks();
            expect(subscribeSpy).toHaveBeenCalledWith(
                'projects/alien-grove-429815-s9/subscriptions/scraping-tasks-sub',
                expect.any(Function)
            );
        });
    });

    describe('handleMessage', () => {
        it('should hit the cache and return cached data', async () => {
          const url = 'http://example.com';
          const type = 'someType';
          const cachedData = { status: 'completed', result: 'some result' };
          jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(JSON.stringify(cachedData));
          mockMessage.data.toString.mockReturnValueOnce(JSON.stringify({ url, type }));
    
          const result = await service.handleMessage(mockMessage);
    
          expect(result.status).toEqual(cachedData.status);
            expect(result.result).toEqual(cachedData.result);
          expect(cacheManager.get).toHaveBeenCalledWith(url);
          expect(mockMessage.ack).not.toHaveBeenCalled(); // Ensure message is not acknowledged
        });
    
        it('should process a scrape if cache miss', async () => {
          const url = 'http://example.com';
          const type = 'someType';
          const scrapeResult = {
            url,
            time: 0,
            domainStatus: '',
            robots: null,
            metadata: null,
            industryClassification: null,
            logo: '',
            images: [],
            slogan: '',
            contactInfo: { emails: [], phones: [] },
            addresses: [],
            screenshot: '',
            seoAnalysis: null,
          };
          const cachedDataProcessing = { status: 'processing', pollingURL: `/scraper/status/${encodeURIComponent(url)}` };
          jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null); // Cache miss
          jest.spyOn(service, 'scrape').mockResolvedValueOnce(scrapeResult);
          mockMessage.data.toString.mockReturnValueOnce(JSON.stringify({ url, type }));
    
          await service.handleMessage(mockMessage);
    
          expect(cacheManager.set).toHaveBeenCalledWith(url, JSON.stringify(cachedDataProcessing));
          expect(mockMessage.ack).toHaveBeenCalled();
        });
    
        it('should handle errors and remove cache entry', async () => {
          const url = 'http://example.com';
          const type = 'someType';
          jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null); // Cache miss
          jest.spyOn(service, 'scrape').mockRejectedValueOnce(new Error('Some error'));
          mockMessage.data.toString.mockReturnValueOnce(JSON.stringify({ url, type }));
    
          await service.handleMessage(mockMessage);
    
          expect(cacheManager.set).toHaveBeenCalledWith(url, JSON.stringify({ status: 'processing', pollingURL: `/scraper/status/${encodeURIComponent(url)}` }));
          expect(cacheManager.del).toHaveBeenCalledWith(url);
        });
    });

    describe('scrapeWebsite', () => {
        it('should call scrape method with type "scrape"', async () => {
            const url = 'http://example.com';
            const type = 'scrape';
            const scrapeResult = { 
                url,
                time: 0,
                domainStatus: '',
                robots: null,
                metadata: null,
                industryClassification: null,
                logo: '',
                images: [],
                slogan: '',
                contactInfo: { emails: [], phones: [] },
                addresses: [],
                screenshot: '',
                seoAnalysis: null,
             };
    
            jest.spyOn(service, 'scrape').mockResolvedValueOnce(scrapeResult);
    
            const result = await service.scrapeWebsite(url, type);
    
            expect(result).toEqual(scrapeResult);
            expect(service.scrape).toHaveBeenCalledWith(url);
        });
    
        it('should throw an error for unknown scraping type', async () => {
            const url = 'http://example.com';
            const type = 'unknownType';
    
            await expect(service.scrapeWebsite(url, type)).rejects.toThrowError('Unknown scraping type: unknownType');
        });
    });

    describe('scrape', () => {
        it('should successfully scrape website data', async () => {
            const url = 'http://example.com';
            const type = 'scrape';
    
            // Mock responses
            jest.spyOn(mockRobotsService, 'readRobotsFile').mockResolvedValue({
                baseUrl: url,
                allowedPaths: [],
                disallowedPaths: [],
                isUrlScrapable: true,
                isBaseUrlAllowed: true,
            });
            jest.spyOn(mockScrapeStatusService, 'scrapeStatus').mockResolvedValue('live');
            jest.spyOn(mockMetadataService, 'scrapeMetadata').mockResolvedValue({
                title: 'Example',
                description: 'Example description',
                keywords: 'example',
                ogTitle: 'Example OG Title',
                ogDescription: 'Example OG Description',
                ogImage: 'http://example.com/image.jpg',
            });
            jest.spyOn(mockIndustryClassificationService, 'classifyIndustry').mockResolvedValue({
                metadataClass: { label: 'Technology', score: 0.9 },
                domainClass: { label: 'Technology', score: 0.9 },
            });
            jest.spyOn(mockScrapeLogoService, 'scrapeLogo').mockResolvedValue('http://example.com/logo.jpg');
            jest.spyOn(mockScrapeImagesService, 'scrapeImages').mockResolvedValue(['http://example.com/image.jpg']);
            jest.spyOn(mockScrapeContactInfoService, 'scrapeContactInfo').mockResolvedValue({ emails: [], phones: [], socialLinks: [] });
            jest.spyOn(mockScrapeAddressService, 'scrapeAddress').mockResolvedValue({ addresses: [] });
            jest.spyOn(mockScreenshotService, 'captureScreenshot').mockResolvedValue({ screenshot: 'screenshot' });
            jest.spyOn(mockSeoAnalysisService, 'seoAnalysis').mockResolvedValue({ 
                titleTagsAnalysis: { 
                    metaDescription: "South Africa's leading online store. Fast, reliable delivery to your door. Many ways to pay. Shop anything you can imagine: TVs, laptops, cellphones, kitchen appliances, toys, books, beauty & more. Shop the mobile app anytime, anywhere.",
                    length: 236,
                    recommendations: "Meta description length should be between 120 and 160 characters. Consider including words from the URL in the meta description: takealot."
                },
                metaDescriptionAnalysis: {
                    titleTag: "Takealot.com: Online Shopping | SA's leading online store",
                    length: 57,
                    recommendations: ""
                },
                headingAnalysis: {
                    headings: [],
                    count: 0,
                    recommendations: "No headings (H1-H6) found. Add headings to improve structure."
                },
                imageAnalysis: {
                    error: "Error analyzing images using Puppeteer: Navigation timeout of 30000 ms exceeded"
                },
                uniqueContentAnalysis: {
                    error: "Error analyzing images using Puppeteer: Protocol error (Page.navigate): Cannot navigate to invalid URL"
                },
                internalLinksAnalysis: {
                    totalLinks: 0,
                    uniqueLinks: 0,
                    recommendations: "Internal linking is sparse. Consider adding more internal links to aid navigation and SEO."
                },
                siteSpeedAnalysis: {
                    loadTime: 0,
                    recommendations: "Consider reducing the impact of third-party code. Third-party code can significantly impact load performance. Consider delivering critical third-party code with a different async or deferred pattern to ensure the main thread is never blocked."
                },
                mobileFriendlinessAnalysis: {
                    isResponsive: true,
                    recommendations: ""
                },
                structuredDataAnalysis: {
                    count: 0,
                    recommendations: "No structured data found. Add structured data to improve SEO."
                },
                indexabilityAnalysis: {
                    isIndexable: true,
                    recommendations: ""
                },
                XMLSitemapAnalysis: {
                    isSitemapValid: true,
                    recommendations: ""
                },
                canonicalTagAnalysis: {
                    canonicalTag: "https://www.takealot.com/",
                    isCanonicalTagPresent: true,
                    recommendations: ""
                },
                lighthouseAnalysis: { 
                    scores: { 
                        performance: 0.9,
                        accessibility: 0.9,
                        bestPractices: 0.9,
                    },
                    diagnostics: { 
                        recommendations: ["Consider reducing the impact of third-party code. Third-party code can significantly impact load performance. Consider delivering critical third-party code with a different async or deferred pattern to ensure the main thread is never blocked."]
                    },
                }
            });
    
            jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
    
            const result = await service.scrape(url);
        
            expect(result).toHaveProperty('url', url);
            expect(result).toHaveProperty('domainStatus', 'live');
            expect(result).toHaveProperty('metadata');
            expect(result).toHaveProperty('industryClassification');
            expect(result).toHaveProperty('logo', 'http://example.com/logo.jpg');
            expect(result).toHaveProperty('images');
            expect(result).toHaveProperty('contactInfo');
            expect(result).toHaveProperty('addresses');
            expect(result).toHaveProperty('screenshot');
            expect(result).toHaveProperty('seoAnalysis');
    
            expect(jest.spyOn(cacheManager, 'set')).toHaveBeenCalledWith(url, JSON.stringify( result ));
        });
    
        it('should handle errors and cache errors appropriately', async () => {
          const url = 'http://example.com';
          const type = 'scrape';
    
          // Simulate an error in scraping metadata
            jest.spyOn(mockRobotsService, 'readRobotsFile').mockResolvedValue({
                baseUrl: url,
                allowedPaths: [],
                disallowedPaths: [],
                isUrlScrapable: true,
                isBaseUrlAllowed: true,
            });
            jest.spyOn(mockScrapeStatusService, 'scrapeStatus').mockResolvedValue('live');
            jest.spyOn(mockMetadataService, 'scrapeMetadata').mockRejectedValue(new Error('Some error'));
            jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);

            await expect(service.scrape(url)).rejects.toThrowError('Some error');            
        });
    });

    describe('readRobotsFile', () => {
        it('should read robots.txt file and return the result', async () => {
            const url = 'http://example.com';
            const robotsResult = {
                baseUrl: url,
                allowedPaths: [],
                disallowedPaths: [],
                isUrlScrapable: true,
                isBaseUrlAllowed: true,
            };
            jest.spyOn(mockRobotsService, 'readRobotsFile').mockResolvedValue(robotsResult);
    
            const result = await service.readRobotsFile(url);
    
            expect(result).toEqual(robotsResult);
            expect(mockRobotsService.readRobotsFile).toHaveBeenCalledWith(url);
        });
    });

    describe('scrapeMetadata', () => {
        it('should scrape metadata and return the result', async () => {
            const url = 'http://example.com';
            const robotsResult = {
                baseUrl: url,
                allowedPaths: [],
                disallowedPaths: [],
                isUrlScrapable: true,
                isBaseUrlAllowed: true,
            };
            const metadataResult = {
                title: 'Example',
                description: 'Example description',
                keywords: 'example',
                ogTitle: 'Example OG Title',
                ogDescription: 'Example OG Description',
                ogImage: 'http://example.com/image.jpg',
            };

            jest.spyOn(mockRobotsService, 'readRobotsFile').mockResolvedValue(robotsResult);
            jest.spyOn(mockMetadataService, 'scrapeMetadata').mockResolvedValue(metadataResult);
    
            const result = await service.scrapeMetadata(url);
    
            expect(result).toEqual(metadataResult);
            expect(mockMetadataService.scrapeMetadata).toHaveBeenCalledWith(url, robotsResult);
        });
    });

    describe('scrapeStatus', () => {
        it('should scrape status and return the result', async () => {
            const url = 'http://example.com';
            const statusResult = 'live';
            jest.spyOn(mockScrapeStatusService, 'scrapeStatus').mockResolvedValue(statusResult);
    
            const result = await service.scrapeStatus(url);
    
            expect(result).toEqual(statusResult);
            expect(mockScrapeStatusService.scrapeStatus).toHaveBeenCalledWith(url);
        });
    });

    describe('classifyIndustry', () => {
        it('should classify industry and return the result', async () => {
            const url = 'http://example.com';
            const robotsResult = {
                baseUrl: url,
                allowedPaths: [],
                disallowedPaths: [],
                isUrlScrapable: true,
                isBaseUrlAllowed: true,
            };
            const metadataResult = {
                title: 'Example',
                description: 'Example description',
                keywords: 'example',
                ogTitle: 'Example OG Title',
                ogDescription: 'Example OG Description',
                ogImage: 'http://example.com/image.jpg',
            };
            const industryResult = {
                metadataClass: { label: 'Technology', score: 0.9 },
                domainClass: { label: 'Technology', score: 0.9 },
            };
            jest.spyOn(mockRobotsService, 'readRobotsFile').mockResolvedValue(robotsResult);
            jest.spyOn(mockMetadataService, 'scrapeMetadata').mockResolvedValue(metadataResult);
            jest.spyOn(mockIndustryClassificationService, 'classifyIndustry').mockResolvedValue(industryResult);
    
            const result = await service.classifyIndustry(url);
    
            expect(result).toEqual(industryResult);
            expect(mockIndustryClassificationService.classifyIndustry).toHaveBeenCalledWith(url, metadataResult);
        });
    });

    describe('scrapeLogo', () => {
        it('should scrape logo and return the result', async () => {
            const url = 'http://example.com';
            const robotsResult = {
                baseUrl: url,
                allowedPaths: [],
                disallowedPaths: [],
                isUrlScrapable: true,
                isBaseUrlAllowed: true,
            };
            const metadataResult = {
                title: 'Example',
                description: 'Example description',
                keywords: 'example',
                ogTitle: 'Example OG Title',
                ogDescription: 'Example OG Description',
                ogImage: 'http://example.com/image.jpg',
            };
            const logoResult = 'http://example.com/logo.jpg';
            jest.spyOn(mockRobotsService, 'readRobotsFile').mockResolvedValue(robotsResult);
            jest.spyOn(mockMetadataService, 'scrapeMetadata').mockResolvedValue(metadataResult);
            jest.spyOn(mockScrapeLogoService, 'scrapeLogo').mockResolvedValue(logoResult);
    
            const result = await service.scrapeLogo(url);
    
            expect(result).toEqual(logoResult);
            expect(mockScrapeLogoService.scrapeLogo).toHaveBeenCalledWith(url, metadataResult, robotsResult);
        });
    });

    describe('scrapeImages', () => {
        it('should scrape images and return the result', async () => {
            const url = 'http://example.com';
            const robotsResult = {
                baseUrl: url,
                allowedPaths: [],
                disallowedPaths: [],
                isUrlScrapable: true,
                isBaseUrlAllowed: true,
            };
            const metadataResult = {
                title: 'Example',
                description: 'Example description',
                keywords: 'example',
                ogTitle: 'Example OG Title',
                ogDescription: 'Example OG Description',
                ogImage: 'http://example.com/image.jpg',
            };
            const imagesResult = ['http://example.com/image.jpg'];
            jest.spyOn(mockRobotsService, 'readRobotsFile').mockResolvedValue(robotsResult);
            jest.spyOn(mockMetadataService, 'scrapeMetadata').mockResolvedValue(metadataResult);
            jest.spyOn(mockScrapeImagesService, 'scrapeImages').mockResolvedValue(imagesResult);
    
            const result = await service.scrapeImages(url);
    
            expect(result).toEqual(imagesResult);
            expect(mockScrapeImagesService.scrapeImages).toHaveBeenCalledWith(url, robotsResult);
        });
    });

    describe('captureScreenshot', () => {
        it('should capture screenshot and return the result', async () => {
            const url = 'http://example.com';
            const robotsResult = {
                baseUrl: url,
                allowedPaths: [],
                disallowedPaths: [],
                isUrlScrapable: true,
                isBaseUrlAllowed: true,
            };
            const screenshotResult = 'screenshot';
            jest.spyOn(mockRobotsService, 'readRobotsFile').mockResolvedValue(robotsResult);
            jest.spyOn(mockScreenshotService, 'captureScreenshot').mockResolvedValue({ screenshot: screenshotResult });
    
            const result = await service.getScreenshot(url);
    
            expect(result).toEqual({ screenshot: screenshotResult });
            expect(mockScreenshotService.captureScreenshot).toHaveBeenCalledWith(url, robotsResult);
        });
    });

    describe('scrapeContactInfo', () => {
        it('should scrape contact info and return the result', async () => {
            const url = 'http://example.com';
            const robotsResult = {
                baseUrl: url,
                allowedPaths: [],
                disallowedPaths: [],
                isUrlScrapable: true,
                isBaseUrlAllowed: true,
            };
            const contactInfoResult = { emails: [], phones: [], socialLinks: [] };
            jest.spyOn(mockRobotsService, 'readRobotsFile').mockResolvedValue(robotsResult);
            jest.spyOn(mockScrapeContactInfoService, 'scrapeContactInfo').mockResolvedValue(contactInfoResult);
    
            const result = await service.scrapeContactInfo(url);
    
            expect(result).toEqual(contactInfoResult);
            expect(mockScrapeContactInfoService.scrapeContactInfo).toHaveBeenCalledWith(url, robotsResult);
        });
    });

    describe('scrapeAddress', () => {
        it('should scrape address and return the result', async () => {
            const url = 'http://example.com';
            const robotsResult = {
                baseUrl: url,
                allowedPaths: [],
                disallowedPaths: [],
                isUrlScrapable: true,
                isBaseUrlAllowed: true,
            };
            const addressResult = { addresses: [] };
            jest.spyOn(mockRobotsService, 'readRobotsFile').mockResolvedValue(robotsResult);
            jest.spyOn(mockScrapeAddressService, 'scrapeAddress').mockResolvedValue(addressResult);
    
            const result = await service.scrapeAddress(url);
    
            expect(result).toEqual(addressResult);
            expect(mockScrapeAddressService.scrapeAddress).toHaveBeenCalledWith(url, robotsResult);
        });
    });

});