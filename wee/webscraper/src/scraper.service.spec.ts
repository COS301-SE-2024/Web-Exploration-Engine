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
import {
    ErrorResponse,
    RobotsResponse,
    Metadata,
    IndustryClassification,
  } from './models/ServiceModels';

describe('ScraperService', () => {
    let service: ScraperService;
    let cacheManager: Cache;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ScraperService,
                {
                    provide: 'CACHE_MANAGER',
                    useValue: {
                        get: jest.fn(),
                        set: jest.fn(),
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
                    useValue: {},
                },
                {
                    provide: ScrapeStatusService,
                    useValue: {
                        scrapeStatus: jest.fn(),
                    },
                },
                {
                    provide: IndustryClassificationService,
                    useValue: {},
                },
                {
                    provide: ScrapeLogoService,
                    useValue: {},
                },
                {
                    provide: ScrapeImagesService,
                    useValue: {},
                },
                {
                    provide: ScreenshotService,
                    useValue: {},
                },
                {
                    provide: ScrapeContactInfoService,
                    useValue: {},
                },
                {
                    provide: ScrapeAddressService,
                    useValue: {},
                },
                {
                    provide: SeoAnalysisService,
                    useValue: {},
                },                
            ]
        }).compile();

        service = module.get<ScraperService>(ScraperService);
        cacheManager = module.get<Cache>('CACHE_MANAGER');
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return cached data on cache hit', async () => {
        const url = 'http://example.com';
        const cachedData = {
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

        jest.spyOn(cacheManager, 'get').mockResolvedValue(JSON.stringify(cachedData));
        const result = await service.scrape(url);

        expect(cacheManager.get).toHaveBeenCalledWith(url);
        expect(result.url).toBe(url);

        expect(result.time).toBeCloseTo(cachedData.time, 2);
        
        expect(result).toEqual(expect.objectContaining({
            ...cachedData,
            time: result.time
        }));
    });


});