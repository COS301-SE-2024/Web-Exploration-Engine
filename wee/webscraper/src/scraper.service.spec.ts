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

describe('ScraperService', () => {
    let service: ScraperService;

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
                    useValue: {},
                },
                {
                    provide: ScrapeMetadataService,
                    useValue: {},
                },
                {
                    provide: ScrapeStatusService,
                    useValue: {},
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
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});