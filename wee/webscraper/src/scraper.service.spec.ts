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
import { SentimentAnalysisService } from './sentiment-analysis/sentiment-analysis.service';
import { RobotsResponse, Metadata, IndustryClassification, ScrapeResult } from './models/ServiceModels';

describe('ScraperService', () => {
    let service: ScraperService;
    
    let cacheManager: Cache;
    let robotsService: RobotsService;
    let metadataService: ScrapeMetadataService;
    let industryClassificationService: IndustryClassificationService;
    let scrapeLogoService: ScrapeLogoService;
    let imagesService: ScrapeImagesService;
    let contactInfoService: ScrapeContactInfoService;
    let addressService: ScrapeAddressService;
    let screenshotService: ScreenshotService;
    let seoAnalysisService: SeoAnalysisService;
    let sentimentAnalysisService: SentimentAnalysisService;

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
                    provide: SentimentAnalysisService,
                    useValue: {
                        sentimentAnalysis: jest.fn(),
                        classifySentiment: jest.fn(),
                    },
                },          
            ]
        }).compile();

        service = module.get<ScraperService>(ScraperService);
        cacheManager = module.get<Cache>('CACHE_MANAGER');
        robotsService = module.get<RobotsService>(RobotsService);
        metadataService = module.get<ScrapeMetadataService>(ScrapeMetadataService);
        industryClassificationService = module.get<IndustryClassificationService>(IndustryClassificationService);
        scrapeLogoService = module.get<ScrapeLogoService>(ScrapeLogoService);
        imagesService = module.get<ScrapeImagesService>(ScrapeImagesService);
        contactInfoService = module.get<ScrapeContactInfoService>(ScrapeContactInfoService);
        addressService = module.get<ScrapeAddressService>(ScrapeAddressService);
        screenshotService = module.get<ScreenshotService>(ScreenshotService);
        seoAnalysisService = module.get<SeoAnalysisService>(SeoAnalysisService);
        sentimentAnalysisService = module.get<SentimentAnalysisService>(SentimentAnalysisService);
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
            sentimentClassification: null,
        };

        jest.spyOn(cacheManager, 'get').mockResolvedValue(JSON.stringify(cachedData));
        const result = await service.scrape(url) as ScrapeResult;

        expect(cacheManager.get).toHaveBeenCalledWith(url);
        expect(result.url).toBe(url);

        expect(result.time).toBeCloseTo(cachedData.time, 2);
        
        expect(result).toEqual(expect.objectContaining({
            ...cachedData,
            time: result.time
        }));
    });

    it('should scrape and cache data on cache miss', async () => {
        const url = 'http://example.com';
    
        jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
    
        const cacheSetSpy = jest.spyOn(cacheManager, 'set').mockResolvedValue(undefined);
    
        jest.spyOn(robotsService, 'readRobotsFile').mockResolvedValue({
            baseUrl: url,
            isUrlScrapable: true,
            isBaseUrlAllowed: true,
            allowedPaths: [],
            disallowedPaths: []
        } as RobotsResponse);
    
        jest.spyOn(metadataService, 'scrapeMetadata').mockResolvedValue({
            title: 'Example Title',
            description: 'Example Description',
            keywords: 'example, keywords'
        } as Metadata);
    
        jest.spyOn(industryClassificationService, 'classifyIndustry').mockResolvedValue({
            metadataClass: {
                label: "E-commerce",
                score: 95,
            },
            domainClass: {
                label: 'Unknown',
                score: 0,
            }
        } as IndustryClassification);

        jest.spyOn(scrapeLogoService, 'scrapeLogo').mockResolvedValue('http://example.com/logo.png');
        jest.spyOn(imagesService, 'scrapeImages').mockResolvedValue(['image1.png', 'image2.svg']);
        jest.spyOn(contactInfoService, 'scrapeContactInfo').mockResolvedValue({
            emails: ['email@gmail.com'], 
            phones: ['01234567892'], 
            socialLinks: []
        })
        jest.spyOn(addressService, 'scrapeAddress').mockResolvedValue({addresses: ['address 1', 'address 2']});
        jest.spyOn(screenshotService, 'captureScreenshot').mockResolvedValue({screenshot: 'screenshot.png'});
        jest.spyOn(seoAnalysisService, 'seoAnalysis').mockResolvedValue(null);    
        jest.spyOn(sentimentAnalysisService, 'sentimentAnalysis').mockResolvedValue(null);
        
        const result = await service.scrape(url) as ScrapeResult;    
        
        expect(cacheManager.get).toHaveBeenCalledWith(url); 
        expect(result.url).toBe(url); 
        expect(result).toEqual(expect.objectContaining({ 
            url,
            time: expect.any(Number),
            domainStatus: undefined,
            robots: {
                baseUrl: url,
                isUrlScrapable: true,
                isBaseUrlAllowed: true,
                allowedPaths: [],
                disallowedPaths: []
            },
            metadata: {
                title: 'Example Title',
                description: 'Example Description',
                keywords: 'example, keywords'
            },
            industryClassification: {
                metadataClass: {
                    label: "E-commerce",
                    score: 95,
                },
                domainClass: {
                    label: 'Unknown',
                    score: 0,
                }
            },
            logo: 'http://example.com/logo.png',
            images: ['image1.png', 'image2.svg'],
            slogan: '',
            contactInfo: {
                emails: ['email@gmail.com'], 
                phones: ['01234567892'], 
                socialLinks: []
            },
            addresses: ['address 1', 'address 2'],
            screenshot: 'screenshot.png',
            seoAnalysis: null,
            sentimentClassification: null,
        }));
    
        expect(cacheSetSpy).toHaveBeenCalledWith(url, JSON.stringify(result)); 
    });

});

