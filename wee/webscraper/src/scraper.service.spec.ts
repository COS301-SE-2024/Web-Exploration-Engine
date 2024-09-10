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
import { SentimentAnalysisService } from "./sentiment-analysis/sentiment-analysis.service";
import { KeywordAnalysisService } from "./keyword-analysis/keyword-analysis.service";
import { NewsScraperService } from "./scrape-news/scrape-news.service";
import { ShareCountService } from "./share-count-analytics/share-count-analytics.service";
import { PubSubService } from "./pub-sub/pub_sub.service";
import { ProxyService } from "./proxy/proxy.service";
import { ScrapeReviewsService } from "./scrape-reviews/scrape-reviews.service";
import * as puppeteer from 'puppeteer';
import { NewsItem, RobotsResponse } from "./models/ServiceModels";

jest.mock('puppeteer');
import axios from 'axios';
import xml2js from 'xml2js';

jest.mock('axios');
jest.mock('xml2js');

describe('ScraperService', () => {
    let service: ScraperService;

    let cacheManager: Cache;
    let pubsub: PubSubService;

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
    let mockSentimentAnalysisService: SentimentAnalysisService;
    let mockKeywordAnalysisService: KeywordAnalysisService;
    let mockScrapeNewsService:NewsScraperService;
    let mockShareCountService: ShareCountService;
    let mockReviewService: ScrapeReviewsService;

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
                        classifySentiment: jest.fn(),
                        sentimentAnalysis: jest.fn(),
                    },
                },
                {
                  provide: ShareCountService,
                  useValue: {
                      classifyShareCount: jest.fn(),
                      getShareCount: jest.fn(),
                  },
              },
                {
                    provide: KeywordAnalysisService,
                    useValue: {
                        getKeywordRanking: jest.fn(),
                    },
                },
                {
                    provide: PubSubService,
                    useValue: {
                        subscribe: jest.fn(),
                    },
                },
                {
                    provide: ProxyService,
                    useValue: {
                        getProxy: jest.fn(),
                    },
                },
                {
                    provide: NewsScraperService,
                    useValue: {
                        fetchNewsArticles: jest.fn(),
                        extractBusinessName: jest.fn(),
                        getSentiment: jest.fn(),
                    },
                },
                {
                    provide: ScrapeReviewsService,
                    useValue: {
                        scrapeReviews: jest.fn(),
                        scrapeReviewsFromHelloPeter: jest.fn(),
                        scrapeReviewsViaGoogle: jest.fn(),
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
        mockSentimentAnalysisService = module.get<SentimentAnalysisService>(SentimentAnalysisService);
        mockKeywordAnalysisService = module.get<KeywordAnalysisService>(KeywordAnalysisService);
        mockScrapeNewsService=module.get<NewsScraperService>(NewsScraperService);
        mockShareCountService = module.get<ShareCountService>(ShareCountService);
        mockReviewService = module.get<ScrapeReviewsService>(ScrapeReviewsService);
        process.env.GOOGLE_CLOUD_SUBSCRIPTION = 'mock-subscription';
    });

    afterEach(() => {
        jest.clearAllMocks();
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
                'mock-subscription',
                expect.any(Function)
            );
        });

        it('should be called on module init', async () => {
            const listenForScrapingTasksSpy = jest.spyOn(service, 'listenForScrapingTasks');
            await service.onModuleInit();
            expect(listenForScrapingTasksSpy).toHaveBeenCalled();
        });
    });

    describe('handleMessage', () => {
        it('should hit the cache', async () => {
          const url = 'http://example.com';
          const type = 'scrape';
          const mockMessage = {
            data: Buffer.from(JSON.stringify({ data: { url }, type })),
            ack: jest.fn(),
            nack: jest.fn(),
            publishTime: new Date(),
            };

          await service.handleMessage(mockMessage);
          expect(cacheManager.get).toHaveBeenCalledWith(`${url}-${type}`);
            expect(mockMessage.ack).toHaveBeenCalled();
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
            contactInfo: { emails: [], phones: [], socialLinks: [] },
            addresses: [],
            screenshot: '',
            seoAnalysis: null,
            scrapeNews: [],
            semtimentClassification: null,
            shareCount:null,
            reviews:[],
          };
          const mockMessage = {
            data: Buffer.from(JSON.stringify({ data: { url }, type })),
            ack: jest.fn(),
            nack: jest.fn(),
            publishTime: new Date(),
            };
          const cachedDataProcessing = { status: 'processing', pollingURL: `/scraper/status/${encodeURIComponent(url)}` };
          jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null); // Cache miss
          jest.spyOn(service, 'scrape').mockResolvedValueOnce(scrapeResult);


          await service.handleMessage(mockMessage);
          expect(mockMessage.ack).toHaveBeenCalled();
          expect(cacheManager.set).toHaveBeenNthCalledWith(1, `${url}-${type}`, JSON.stringify(cachedDataProcessing));

        });

        // it('should handle errors and remove cache entry', async () => {
        //   const url = 'http://example.com';
        //   const type = 'someType';
        //   jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null); // Cache miss
        //   jest.spyOn(service, 'scrape').mockRejectedValueOnce(new Error('Some error'));
        //   mockMessage.data.toString.mockReturnValueOnce(JSON.stringify({ url, type }));

        //   await service.handleMessage(mockMessage);

        //   expect(cacheManager.set).toHaveBeenCalledWith(`${url}-${type}`, JSON.stringify({ status: 'processing', pollingURL: `/scraper/status/${encodeURIComponent(url)}` }));
        //   expect(cacheManager.del).toHaveBeenCalledWith(`${url}-${type}`);
        // });
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
                contactInfo: { emails: [], phones: [], socialLinks: [] },
                addresses: [],
                screenshot: '',
                seoAnalysis: null,
                scrapeNews:[],
                semtimentClassification: null,
                news:[],
                shareCount:null,
                reviews:[],
             };

            jest.spyOn(service, 'scrape').mockResolvedValueOnce(scrapeResult);

            const result = await service.scrapeWebsite({url}, type);

            expect(result).toEqual(scrapeResult);
            expect(service.scrape).toHaveBeenCalledWith(url);
        });

        it('should call scrape method with type "read-robots"', async () => {
            const url = 'http://example.com';
            const type = 'read-robots';
            const robotsResult = {
                baseUrl: url,
                allowedPaths: [],
                disallowedPaths: [],
                isUrlScrapable: true,
                isBaseUrlAllowed: true,
            };

            jest.spyOn(service, 'readRobotsFile').mockResolvedValueOnce(robotsResult);
            jest.spyOn(mockRobotsService, 'readRobotsFile').mockResolvedValue(robotsResult);

            const result = await service.scrapeWebsite({url}, type);

            expect(result).toEqual(robotsResult);
            expect(service.readRobotsFile).toHaveBeenCalledWith(url);
        });

        it('should call scrape method with type "scrape-metadata"', async () => {
            const url = 'http://example.com';
            const type = 'scrape-metadata';
            const metadataResult = {
                title: 'Example',
                description: 'Example description',
                keywords: 'example',
                ogTitle: 'Example OG Title',
                ogDescription: 'Example OG Description',
                ogImage: 'http://example.com/image.jpg',
            };

            jest.spyOn(service, 'scrapeMetadata').mockResolvedValue(metadataResult);

            const result = await service.scrapeWebsite({url}, type);

            expect(result).toEqual(metadataResult);
            expect(service.scrapeMetadata).toHaveBeenCalledWith(url);
        });

        it('should call scrape method with type "scrape-status"', async () => {
            const url = 'http://example.com';
            const type = 'scrape-status';
            const statusResult = 'live';

            jest.spyOn(service, 'scrapeStatus').mockResolvedValue(statusResult);

            const result = await service.scrapeWebsite({url}, type);

            expect(result).toEqual(statusResult);
            expect(service.scrapeStatus).toHaveBeenCalledWith(url);
        });

        it('should call scrape method with type "classify-industry"', async () => {
            const url = 'http://example.com';
            const type = 'classify-industry';
            const industryResult = {
                metadataClass: { label: 'Technology', score: 0.9 },
                domainClass: { label: 'Technology', score: 0.9 },
                zeroShotDomainClassify: [{ label: 'Technology', score: 0.9 }],
                zeroShotMetaDataClassify: [{ label: 'Technology', score: 0.9 }],
            };

            jest.spyOn(service, 'classifyIndustry').mockResolvedValue(industryResult);

            const result = await service.scrapeWebsite({url}, type);

            expect(result).toEqual(industryResult);
            expect(service.classifyIndustry).toHaveBeenCalledWith(url);
        });

        it('should call scrape method with type "scrape-logo"', async () => {
            const url = 'http://example.com';
            const type = 'scrape-logo';
            const logoResult = 'http://example.com/logo.jpg';

            jest.spyOn(service, 'scrapeLogo').mockResolvedValue(logoResult);

            const result = await service.scrapeWebsite({url}, type);

            expect(result).toEqual(logoResult);
            expect(service.scrapeLogo).toHaveBeenCalledWith(url);
        });

        it('should call scrape method with type "scrape-images"', async () => {
            const url = 'http://example.com';
            const type = 'scrape-images';
            const imagesResult = ['http://example.com/image.jpg'];

            jest.spyOn(service, 'scrapeImages').mockResolvedValue(imagesResult);

            const result = await service.scrapeWebsite({url}, type);

            expect(result).toEqual(imagesResult);
            expect(service.scrapeImages).toHaveBeenCalledWith(url);
        });

        it('should call scrape method with type "screenshot"', async () => {
            const url = 'http://example.com';
            const type = 'screenshot';
            const screenshotResult = 'screenshot';

            jest.spyOn(service, 'getScreenshot').mockResolvedValue({ screenshot: screenshotResult });

            const result = await service.scrapeWebsite({url}, type);

            expect(result).toEqual({ screenshot: screenshotResult });
            expect(service.getScreenshot).toHaveBeenCalledWith(url);
        });

        it('should call scrape method with type "scrape-contact-info"', async () => {
            const url = 'http://example.com';
            const type = 'scrape-contact-info';
            const contactInfoResult = { emails: [], phones: [], socialLinks: [] };

            jest.spyOn(service, 'scrapeContactInfo').mockResolvedValue(contactInfoResult);

            const result = await service.scrapeWebsite({url}, type);

            expect(result).toEqual(contactInfoResult);
            expect(service.scrapeContactInfo).toHaveBeenCalledWith(url);
        });

        it('should call scrape method with type "scrape-address"', async () => {
            const url = 'http://example.com';
            const type = 'scrape-addresses';
            const addressResult = { addresses: [] };

            jest.spyOn(service, 'scrapeAddress').mockResolvedValue(addressResult);

            const result = await service.scrapeWebsite({url}, type);

            expect(result).toEqual(addressResult);
            expect(service.scrapeAddress).toHaveBeenCalledWith(url);
        });
        it('should call scrape method with type "scrape-news"', async () => {
            const url = 'http://example.com';
            const type = 'scrape-news';

            const robotsResponse: RobotsResponse = {
              baseUrl: url,
              allowedPaths: ['/'],
              disallowedPaths: ['/admin'],
              isUrlScrapable: true,
              isBaseUrlAllowed: true,
            };
          
  
            jest.spyOn(mockRobotsService, 'readRobotsFile').mockResolvedValue(robotsResponse);

            const newsResult: NewsItem[] = [
              {
                title: 'Example News Title',
                link: 'http://example.com/news1',
                source: 'Example Source',
                pubDate: '2024-09-01T10:00:00Z',
                sentimentScores: {
                  positive: 0.7,
                  negative: 0.1,
                  neutral: 0.2,
                },
              },
            ];

            jest.spyOn(mockScrapeNewsService, 'fetchNewsArticles').mockResolvedValue(newsResult);


            const result = await service.scrapeWebsite({ url }, type);

            expect(result).toEqual(newsResult); 
            expect(mockScrapeNewsService.fetchNewsArticles).toHaveBeenCalledWith(url); 
          });
          
          

        it('should call scrape method with type "shareCount"', async () => {
          const url = 'http://example.com';
          const type = 'shareCount';
          const shareCountArr = {
            "Facebook": {
              "comment_plugin_count": 9835,
              "total_count": 660431433,
              "og_object": null,
              "comment_count": 174355,
              "share_count": 658575283,
              "reaction_count": 1671960
            },
            "Pinterest": 9745
          };

          jest.spyOn(service, 'getShareCount').mockResolvedValue(shareCountArr);

          const result = await service.scrapeWebsite({url}, type);

          expect(result).toEqual(shareCountArr);
          expect(service.getShareCount).toHaveBeenCalledWith(url);
      });


        it('should call scrape method with type "seo-analysis"', async () => {
            const url = 'http://example.com';
            const type = 'seo-analysis';
            jest.spyOn(service, 'seoAnalysis').mockResolvedValue({
                titleTagsAnalysis: {
                    titleTag: "Takealot.com: Online Shopping | SA's leading online store",
                    length: 57,
                    recommendations: ""
                },
                metaDescriptionAnalysis: {
                    metaDescription: "South Africa's leading online store. Fast, reliable delivery to your door. Many ways to pay. Shop anything you can imagine: TVs, laptops, cellphones, kitchen appliances, toys, books, beauty & more. Shop the mobile app anytime, anywhere.",
                    length: 236,
                    isUrlWordsInDescription: true,
                    recommendations: "Meta description length should be between 120 and 160 characters. Consider including words from the URL in the meta description: takealot."
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
                    textLength: 0,
                    uniqueWordsPercentage: 0,
                    repeatedWords: [{
                        word: 'example',
                        count: 7,
                    }],
                    recommendations: "Add more unique content to improve SEO."
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

            const result = await service.scrapeWebsite({url}, type);

            expect(service.seoAnalysis).toHaveBeenCalledWith(url);


        });

        it('should call scrape method with type "keyword-analysis"', async () => {
            const url = 'http://example.com';
            const type = 'keyword-analysis';
            const keyword = 'example';
            const keywordResult = {
                keyword,
                url,
                ranking: 1,
                topTen: [
                    'example.com', 'example2.com', 'example3.com', 'example4.com', 'example5.com', 'example6.com', 'example7.com', 'example8.com', 'example9.com', 'example10.com'
                ],
                recommendation: 'Some recommendation'
            };

            jest.spyOn(service, 'keywordAnalysis').mockResolvedValue(keywordResult);

            const result = await service.scrapeWebsite({url, keyword}, type);

            expect(result).toEqual(keywordResult);
            expect(service.keywordAnalysis).toHaveBeenCalledWith(url, keyword);
        });

        it('should throw an error for unknown scraping type', async () => {
            const url = 'http://example.com';
            const type = 'unknownType';

            await expect(service.scrapeWebsite({url}, type)).rejects.toThrowError('Unknown scraping type: unknownType');
        });
        it('should call scrape method with type "scrape-reviews"', async () => {
            const url = 'http://example.com';
            const type = 'scrape-reviews';
            const reviewsResult = [
                "Rating: 4.5",
                "Number of reviews: 100",
                "Trustindex rating: 54",
                "NPS: 80",
                "Recommendation status: Highly recommended",
                "Review breakdown: 50; 30; 20"
            ];

            jest.spyOn(service, 'scrapeReviews').mockResolvedValue(reviewsResult);

            const result = await service.scrapeWebsite({url, }, type);

            expect(result).toEqual(reviewsResult);
            expect(service.scrapeReviews).toHaveBeenCalledWith(url);
        });
    });

    describe('scrape', () => {
        it('should successfully scrape website data', async () => {
            const url = 'http://example.com';
            const type = 'scrape';

            const mockBrowser = {
                newPage: jest.fn().mockResolvedValue({
                    goto: jest.fn(),
                    screenshot: jest.fn(),
                    authenticate: jest.fn(),
                    close: jest.fn(),
                }),
                close: jest.fn(),
            } as unknown as puppeteer.Browser;


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
                zeroShotDomainClassify: [{ label: 'Technology', score: 0.9 }],
                zeroShotMetaDataClassify: [{ label: 'Technology', score: 0.9 }],
            });
            jest.spyOn(mockScrapeLogoService, 'scrapeLogo').mockResolvedValue('http://example.com/logo.jpg');
            jest.spyOn(mockScrapeImagesService, 'scrapeImages').mockResolvedValue(['http://example.com/image.jpg']);
            jest.spyOn(mockScrapeContactInfoService, 'scrapeContactInfo').mockResolvedValue({ emails: [], phones: [], socialLinks: [] });
            jest.spyOn(mockScrapeAddressService, 'scrapeAddress').mockResolvedValue({ addresses: [] });
            jest.spyOn(mockScreenshotService, 'captureScreenshot').mockResolvedValue({ screenshot: 'screenshot' });
            jest.spyOn(mockSeoAnalysisService, 'seoAnalysis').mockResolvedValue({
                titleTagsAnalysis: {
                    titleTag: "Takealot.com: Online Shopping | SA's leading online store",
                    length: 57,
                    recommendations: ""
                },
                metaDescriptionAnalysis: {
                    metaDescription: "South Africa's leading online store. Fast, reliable delivery to your door. Many ways to pay. Shop anything you can imagine: TVs, laptops, cellphones, kitchen appliances, toys, books, beauty & more. Shop the mobile app anytime, anywhere.",
                    length: 236,
                    isUrlWordsInDescription: true,
                    recommendations: "Meta description length should be between 120 and 160 characters. Consider including words from the URL in the meta description: takealot."
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
                    textLength: 0,
                    uniqueWordsPercentage: 0,
                    repeatedWords: [{
                        word: 'example',
                        count: 7,
                    }],
                    recommendations: "Add more unique content to improve SEO."
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
            jest.spyOn(mockSentimentAnalysisService, 'classifySentiment').mockResolvedValue({
                sentimentAnalysis: {
                    positive: 0,
                    negative: 0,
                    neutral: 0,
                },
                positiveWords: [],
                negativeWords: [],
                emotions: {},
            });

            jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
            jest.spyOn(puppeteer, 'launch').mockResolvedValue(mockBrowser);

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
            expect(result).toHaveProperty('sentiment');

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

    describe('shareCount', () => {
      it('should return the share count for the given URL', async () => {
        const url = 'http://example.com';
        const type = 'shareCount';
        const expectedShareCount = {
          "Facebook": {
            "comment_plugin_count": 9835,
            "total_count": 660431433,
            "og_object": null,
            "comment_count": 174355,
            "share_count": 658575283,
            "reaction_count": 1671960
          },
          "Pinterest": 9745
        }
        jest.spyOn(mockShareCountService, 'getShareCount').mockResolvedValue(expectedShareCount);

        const result = await service.getShareCount(url);

        expect(result).toEqual(expectedShareCount);
        expect(mockShareCountService.getShareCount).toHaveBeenCalledWith(url);
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

            const mockPage = {
                goto: jest.fn().mockResolvedValue(undefined),
                evaluate: jest.fn(),
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

            jest.spyOn(puppeteer, 'launch').mockResolvedValue(mockBrowser);

            jest.spyOn(mockRobotsService, 'readRobotsFile').mockResolvedValue(robotsResult);
            jest.spyOn(mockMetadataService, 'scrapeMetadata').mockResolvedValue(metadataResult);

            const result = await service.scrapeMetadata(url);

            expect(result).toEqual(metadataResult);
            expect(mockMetadataService.scrapeMetadata).toHaveBeenCalledWith(url, robotsResult, mockBrowser);
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
                // metadataClass: { label: 'Technology', score: 0.9 },
                // domainClass: { label: 'Technology', score: 0.9 },
                zeroShotDomainClassify: [{ label: 'Technology', score: 0.9 }],
                zeroShotMetaDataClassify: [{ label: 'Technology', score: 0.9 }],
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

            const mockPage = {
                goto: jest.fn(),
                evaluate: jest.fn(),
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

            jest.spyOn(puppeteer, 'launch').mockResolvedValue(mockBrowser);


            const logoResult = 'http://example.com/logo.jpg';
            jest.spyOn(mockRobotsService, 'readRobotsFile').mockResolvedValue(robotsResult);
            jest.spyOn(mockMetadataService, 'scrapeMetadata').mockResolvedValue(metadataResult);
            jest.spyOn(mockScrapeLogoService, 'scrapeLogo').mockResolvedValue(logoResult);


            const result = await service.scrapeLogo(url);

            expect(result).toEqual(logoResult);
            expect(mockScrapeLogoService.scrapeLogo).toHaveBeenCalledWith(url, metadataResult, robotsResult, mockBrowser);
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

            const mockPage = {
                goto: jest.fn(),
                evaluate: jest.fn(),
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

            jest.spyOn(puppeteer, 'launch').mockResolvedValue(mockBrowser);

            const imagesResult = ['http://example.com/image.jpg'];
            jest.spyOn(mockRobotsService, 'readRobotsFile').mockResolvedValue(robotsResult);
            jest.spyOn(mockMetadataService, 'scrapeMetadata').mockResolvedValue(metadataResult);
            jest.spyOn(mockScrapeImagesService, 'scrapeImages').mockResolvedValue(imagesResult);

            const result = await service.scrapeImages(url);

            expect(result).toEqual(imagesResult);
            expect(mockScrapeImagesService.scrapeImages).toHaveBeenCalledWith(url, robotsResult, mockBrowser);
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

            const mockPage = {
                goto: jest.fn(),
                screenshot: jest.fn(),
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

            jest.spyOn(puppeteer, 'launch').mockResolvedValue(mockBrowser);

            const screenshotResult = 'screenshot';
            jest.spyOn(mockRobotsService, 'readRobotsFile').mockResolvedValue(robotsResult);
            jest.spyOn(mockScreenshotService, 'captureScreenshot').mockResolvedValue({ screenshot: screenshotResult });

            const result = await service.getScreenshot(url);

            expect(result).toEqual({ screenshot: screenshotResult });
            expect(mockScreenshotService.captureScreenshot).toHaveBeenCalledWith(url, robotsResult, mockBrowser);
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

            const mockPage = {
                goto: jest.fn(),
                evaluate: jest.fn(),
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

            jest.spyOn(puppeteer, 'launch').mockResolvedValue(mockBrowser);

            jest.spyOn(mockRobotsService, 'readRobotsFile').mockResolvedValue(robotsResult);
            jest.spyOn(mockScrapeContactInfoService, 'scrapeContactInfo').mockResolvedValue(contactInfoResult);

            const result = await service.scrapeContactInfo(url);

            expect(result).toEqual(contactInfoResult);
            expect(mockScrapeContactInfoService.scrapeContactInfo).toHaveBeenCalledWith(url, robotsResult, mockBrowser);
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

            const mockPage = {
                goto: jest.fn(),
                evaluate: jest.fn(),
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

            jest.spyOn(puppeteer, 'launch').mockResolvedValue(mockBrowser);
            const addressResult = { addresses: [] };
            jest.spyOn(mockRobotsService, 'readRobotsFile').mockResolvedValue(robotsResult);
            jest.spyOn(mockScrapeAddressService, 'scrapeAddress').mockResolvedValue(addressResult);

            const result = await service.scrapeAddress(url);

            expect(result).toEqual(addressResult);
            expect(mockScrapeAddressService.scrapeAddress).toHaveBeenCalledWith(url, robotsResult, mockBrowser);
        });
    });

    // describe('seoAnalysis', () => {
    // });

    describe('keywordAnalysis', () => {
        it('should get keyword ranking and return the result', async () => {
            const url = 'http://example.com';
            const keyword = 'example';
            const keywordResult = {
                keyword,
                url,
                ranking: 1,
                topTen: [
                    'example.com', 'example2.com', 'example3.com', 'example4.com', 'example5.com', 'example6.com', 'example7.com', 'example8.com', 'example9.com', 'example10.com'
                ],
                recommendation: 'Some recommendation'
            };

            const mockPage = {
                goto: jest.fn(),
                evaluate: jest.fn(),
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

            jest.spyOn(puppeteer, 'launch').mockResolvedValue(mockBrowser);

            jest.spyOn(mockKeywordAnalysisService, 'getKeywordRanking').mockResolvedValue(keywordResult);

            const result = await service.keywordAnalysis(url, keyword);

            expect(result).toEqual(keywordResult);
            expect(mockKeywordAnalysisService.getKeywordRanking).toHaveBeenCalledWith(url, keyword, mockBrowser);
        });


    });
    describe('newsScraping', () => {
        it('should return the news articles with sentiment scores for the given URL', async () => {
          const url = 'http://example.com';
      
          const expectedNewsArticles: NewsItem[] = [
            {
              title: 'Example News 1',
              link: 'http://example.com/news1',
              source: 'Example Source 1',
              pubDate: '2024-09-01',
              sentimentScores: {
                positive: 0.8,
                negative: 0.1,
                neutral: 0.1,
              },
            },
            {
              title: 'Example News 2',
              link: 'http://example.com/news2',
              source: 'Example Source 2',
              pubDate: '2024-09-02',
              sentimentScores: {
                positive: 0.3,
                negative: 0.3,
                neutral: 0.4,
              },
            },
          ];
      
          jest.spyOn(mockScrapeNewsService, 'fetchNewsArticles').mockResolvedValue(expectedNewsArticles);
      
        });
      });
    
      describe('scrapeReviews', () => {
            it('should scrape reviews and return the result in the expected format', async () => {
              const url = 'http://example.com';
              
              const expectedReviewsResult = [
                `Rating: 4.5`,
                `Number of reviews: 120`,
                `Trustindex rating: 4.2`,
                `NPS: 60`,
                `Recommendation status: Unlikely`,
                `Review breakdown: 50; 30; 20; 10`
              ];
          
              const mockPage = {
                goto: jest.fn(),
                evaluate: jest.fn().mockResolvedValue({
                  rating: '4.5',
                  reviewCount: '120',
                  trustindexRating: '4.2',
                  nps: '60',
                  recommendationStatus: 'Unlikely',
                  reviewNumbers: ['50', '30', '20', '10']
                }),
                close: jest.fn(),
              } as unknown as puppeteer.Page;
          
              const mockBrowser = {
                newPage: jest.fn().mockResolvedValue(mockPage),
                close: jest.fn(),
              } as unknown as puppeteer.Browser;
          
              process.env.PROXY_USERNAME = 'username';
              process.env.PROXY_PASSWORD = 'password';
          
              jest.spyOn(puppeteer, 'launch').mockResolvedValue(mockBrowser);
          
              jest.spyOn(mockRobotsService, 'readRobotsFile').mockResolvedValue({
                baseUrl: url,
                allowedPaths: [],
                disallowedPaths: [],
                isUrlScrapable: true,
                isBaseUrlAllowed: true,
              });
          
              jest.spyOn(mockReviewService, 'scrapeReviews').mockResolvedValue(expectedReviewsResult);
          
              const result = await mockReviewService.scrapeReviews(url);
          
              expect(result).toEqual(expectedReviewsResult);
            });
          });
    
});
