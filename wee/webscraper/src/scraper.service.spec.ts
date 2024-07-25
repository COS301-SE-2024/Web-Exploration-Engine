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

describe('ScraperService', () => {
    let service: ScraperService;
    let cacheManager: Cache;
    let pubsub: PubSubService;
    let mockMessage: any;

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
                        // Mock methods if needed
                    },
                },
                {
                    provide: ScrapeMetadataService,
                    useValue: {
                        // Mock methods if needed
                    },
                },
                {
                    provide: ScrapeStatusService,
                    useValue: {
                        // Mock methods if needed
                    },
                },
                {
                    provide: IndustryClassificationService,
                    useValue: {
                        // Mock methods if needed
                    },
                },
                {
                    provide: ScrapeLogoService,
                    useValue: {
                        // Mock methods if needed
                    },
                },
                {
                    provide: ScrapeImagesService,
                    useValue: {
                        // Mock methods if needed
                    },
                },
                {
                    provide: ScreenshotService,
                    useValue: {
                        // Mock methods if needed
                    },
                },
                {
                    provide: ScrapeContactInfoService,
                    useValue: {
                        // Mock methods if needed
                    },
                },
                {
                    provide: ScrapeAddressService,
                    useValue: {
                        // Mock methods if needed
                    },
                },
                {
                    provide: SeoAnalysisService,
                    useValue: {
                        // Mock methods if needed
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
});