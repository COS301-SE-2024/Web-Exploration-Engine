import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ImagesController } from '../images-app/images.controller';
import { ImagesService } from '../images-app/images.service';

describe('ImagesController (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ImagesController],
      providers: [ImagesService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
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

  it('/scrapeImages (GET) ', async () => {
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
