import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ScraperController } from '../scraper/scraper.controller';
import { ScraperService } from '../scraper/scraper.service';
import { ScraperModule } from '../scraper/scraper.module';

describe('ScraperController (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ScraperModule],
      controllers: [ScraperController],
      providers: [ScraperService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('/isCrawlingAllowed (GET)', async () => {
    jest.setTimeout(20000);
    const response = await request(app.getHttpServer())
      .get('/isCrawlingAllowed')
      .query({ urls: 'https://www.takealot.com' });

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual({ 'https://www.takealot.com': true });
  });

  it('/isCrawlingAllowed (GET) - Multiple URLs', async () => {
    jest.setTimeout(20000);
    const response = await request(app.getHttpServer())
      .get('/isCrawlingAllowed')
      .query({ urls: 'https://www.takealot.com,https://www.example.com' });

    expect(response.status).toBe(HttpStatus.OK);
  });

  it('/scrapeImages (GET)', async () => {
    jest.setTimeout(20000);

    const response = await request(app.getHttpServer())
      .get('/scrapeImages')
      .query({ urls: 'invalid-url' });

    expect(response.status).toBe(HttpStatus.OK);
  });

  it('/scrapeLogos (GET) - Failed to Fetch Robots.txt', async () => {
    jest.setTimeout(60000);

    const response = await request(app.getHttpServer())
      .get('/scrapeLogos')
      .query({ urls: 'https://www.example.com' });

    expect(response.status).toBe(HttpStatus.OK);
  });

  it('/scrape-metadata (GET) - Internal Server Error', async () => {
    jest.setTimeout(60000);

    const response = await request(app.getHttpServer())
      .get('/scrape-metadata')
      .query({ urls: 'https://www.example.co.za' });

    expect(response.status).toBe(HttpStatus.OK);
  });

  it('/scrapeImages (GET) - Internal Server Error', async () => {
    jest.setTimeout(20000);

    const response = await request(app.getHttpServer())
      .get('/scrapeImages')
      .query({ url: 'invalid-url' });

    expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  it('/scrapeLogos (GET)', async () => {
    jest.setTimeout(60000); // Set timeout to 60 seconds

    const response = await request(app.getHttpServer())
      .get('/scrapeLogos')
      .query({ urls: 'https://www.example.com' });

    expect(response.body).toEqual({
      'https://www.example.com':
        'Error: Failed to fetch robots.txt for URL: https://www.example.com',
    });
  });

  it('/scrape-metadata (GET) Internal server Error', async () => {
    jest.setTimeout(60000);

    const response = await request(app.getHttpServer())
      .get('/scrape-metadata')
      .query({ url: 'https://www.example.co.za' });

    expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
  });
});

describe('IndustryController (integration)', () => {
  let app: INestApplication;
  const industryService = {
    scrapeMetadata: jest.fn(),
    calculateIndustryPercentages: jest.fn(),
    domainMatch: jest.fn(),
    compareIndustries: jest.fn(),
    countTrueDomainMatches: jest.fn(),
    checkAllowed: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ScraperModule],
      controllers: [ScraperController],
      providers: [{ provide: ScraperService, useValue: industryService }],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/GET scrapeIndustry', () => {
    it('should return metadata results for given URLs', () => {
      industryService.scrapeMetadata.mockResolvedValue({
        title: 'Example Title',
        description: 'Example Description',
      });
      return request(app.getHttpServer())
        .get('/scrapeIndustry?urls=https://example.com')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual([
            {
              url: 'https://example.com',
              success: true,
              metadata: {
                title: 'Example Title',
                description: 'Example Description',
              },
            },
          ]);
        });
    });
  });

  describe('/GET scrapeIndustry/check-allowed', () => {
    it('should return scraping permission status for a given URL', () => {
      industryService.checkAllowed = jest.fn().mockResolvedValue(true);
      return request(app.getHttpServer())
        .get('/scrapeIndustry/check-allowed?url=https://takealot.co.za')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({ allowed: true });
        });
    });
  });

  describe('/GET scrapeIndustry/percentages', () => {
    it('should return industry percentages for given URLs', () => {
      industryService.calculateIndustryPercentages.mockResolvedValue({
        industryPercentages: { 'Industry 1': 50, 'Industry 2': 50 },
      });
      return request(app.getHttpServer())
        .get(
          '/scrapeIndustry/percentages?urls=https://example.com,https://example2.com'
        )
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({
            industryPercentages: { 'Industry 1': 50, 'Industry 2': 50 },
          });
        });
    });
  });

  describe('/GET scrapeIndustry/domain-match', () => {
    it('should classify industry based on the URL', () => {
      industryService.domainMatch.mockResolvedValue('Industry 1');
      return request(app.getHttpServer())
        .get('/scrapeIndustry/domain-match?url=https://example.com')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({
            url: 'https://example.com',
            industry: 'Industry 1',
          });
        });
    });
  });

  describe('/GET scrapeIndustry/compare', () => {
    it('should compare industry classifications from scrapeMetadata and domainMatch', () => {
      industryService.compareIndustries.mockResolvedValue({
        comparisonResult: 'Some comparison result',
      });
      return request(app.getHttpServer())
        .get(
          '/scrapeIndustry/compare?urls=https://example.com,https://example2.com'
        )
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({
            comparisonResult: 'Some comparison result',
          });
        });
    });
  });

  describe('/GET scrapeIndustry/domain-percentage-match', () => {
    it('should count the number of true domain matches from given URLs', () => {
      industryService.countTrueDomainMatches.mockResolvedValue(80);
      return request(app.getHttpServer())
        .get(
          '/scrapeIndustry/domain-percentage-match?urls=https://example.com,https://example2.com'
        )
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({ percentage: 80 });
        });
    });
  });
});

describe('RobotsController', () => {
  let app: INestApplication;
  let robotsService: ScraperService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ScraperModule],
      controllers: [ScraperController],
      providers: [
        {
          provide: ScraperService,
          useValue: {
            getAllowedPaths: jest.fn(),
          },
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    robotsService = module.get<ScraperService>(ScraperService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /robots/allowed-paths', () => {
    it('should return allowed paths from robots.txt', async () => {
      const url = 'http://example.com';
      const expectedResult = ['/path1', '/path2'];
      jest
        .spyOn(robotsService, 'getAllowedPaths')
        .mockResolvedValueOnce(new Set(expectedResult));

      const response = await request(app.getHttpServer())
        .get('/robots/allowed-paths')
        .query({ url });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual({ allowedPaths:
        expectedResult });
      });

      it('should return an empty array if no allowed paths are found', async () => {
        const url = 'http://example.com';
        jest.spyOn(robotsService, 'getAllowedPaths').mockResolvedValueOnce(new Set());

        const response = await request(app.getHttpServer())
          .get('/robots/allowed-paths')
          .query({ url });

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toEqual({ allowedPaths: [] });
      });

      it('should return an error if the service throws an error', async () => {
        const url = 'http://example.com';
        jest.spyOn(robotsService, 'getAllowedPaths').mockRejectedValueOnce(new Error('Service error'));

        const response = await request(app.getHttpServer())
          .get('/robots/allowed-paths')
          .query({ url });

        expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(response.body.message).toBe('Internal server error');
      });
    });
  });
