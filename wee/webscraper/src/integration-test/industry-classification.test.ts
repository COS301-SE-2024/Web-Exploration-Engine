import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { IndustryController } from '../industry-classification-app/industry.controller';
import { IndustryService } from '../industry-classification-app/industry.service';

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
      controllers: [IndustryController],
      providers: [{ provide: IndustryService, useValue: industryService }],
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
