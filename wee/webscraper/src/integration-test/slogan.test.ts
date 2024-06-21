import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { SloganController } from '../slogan-app/slogan.controller';
import { SloganService } from '../slogan-app/slogan.service';

describe('SloganController', () => {
  let app: INestApplication;
  let sloganService: SloganService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [SloganController],
      providers: [SloganService],
    }).compile();

    app = moduleFixture.createNestApplication();
    sloganService = moduleFixture.get<SloganService>(SloganService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('/scrapeSlogans (GET) - Success', async () => {
    // Mock the sloganService to return mock slogans
    jest.spyOn(sloganService, 'scrapeSlogans').mockResolvedValue(['Slogan 1', 'Slogan 2']);

    const urls = 'https://example.com,https://anotherexample.com';
    const response = await request(app.getHttpServer())
      .get('/scrapeSlogans')
      .query({ urls });

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual({
      'https://example.com': ['Slogan 1', 'Slogan 2'],
      'https://anotherexample.com': ['Slogan 1', 'Slogan 2'],
    });
  });

  it('/scrapeSlogans (GET) - Error in scraping', async () => {
    // Mock the sloganService to throw an error
    const errorMessage = 'Failed to fetch slogans';
    jest.spyOn(sloganService, 'scrapeSlogans').mockRejectedValue(new Error(errorMessage));

    const urls = 'https://example.com';
    const response = await request(app.getHttpServer())
      .get('/scrapeSlogans')
      .query({ urls });

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual({
      'https://example.com': `Error: ${errorMessage}`,
    });
  });

  it('/scrapeSlogans (GET) - Missing URLs', async () => {
    const response = await request(app.getHttpServer()).get('/scrapeSlogans').query({});

    expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
 
  });
});
