import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ScraperModule } from './scraper.module';

describe('ScraperController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ScraperModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/GET scraper - should scrape a website successfully', async () => {
    const url = 'https://example.com';
    const response = await request(app.getHttpServer())
      .get('/scraper?url=' + encodeURIComponent(url))
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/);

    expect(response.body).toBeDefined();

  },20000);


  // it('/GET read-robots - should read robots.txt successfully', async () => {
  //   const url = 'https://example.com';
  //   const response = await request(app.getHttpServer())
  //     .get('/scraper/read-robots?url=' + encodeURIComponent(url))
  //     .expect(HttpStatus.OK)
  //     .expect('Content-Type', /json/);

  //   expect(response.body).toBeDefined();
  //   // Add more assertions based on expected response structure
  // });



  // it('/GET scrape-metadata - should scrape metadata successfully', async () => {
  //   const url = 'https://example.com';
  //   const response = await request(app.getHttpServer())
  //     .get('/scraper/scrape-metadata?url=' + encodeURIComponent(url))
  //     .expect(HttpStatus.OK)
  //     .expect('Content-Type', /json/);

  //   expect(response.body).toBeDefined();

  // });


  // it('/GET scrape-status - should return status successfully', async () => {
  //   const url = 'https://example.com';
  //   const response = await request(app.getHttpServer())
  //     .get('/scraper/scrape-status?url=' + encodeURIComponent(url))
  //     .expect(HttpStatus.OK)
  //     .expect('Content-Type', /json/);

  //   expect(response.body).toBeDefined();

  // });



  // it('/GET classify-industry - should classify industry successfully', async () => {
  //   const url = 'https://example.com';
  //   const response = await request(app.getHttpServer())
  //     .get('/scraper/classify-industry?url=' + encodeURIComponent(url))
  //     .expect(HttpStatus.OK)
  //     .expect('Content-Type', /json/);

  //   expect(response.body).toBeDefined();

  // });


  // it('/GET scrape-images - should scrape images successfully', async () => {
  //   const url = 'https://example.com';
  //   const response = await request(app.getHttpServer())
  //     .get('/scraper/scrape-images?url=' + encodeURIComponent(url))
  //     .expect(HttpStatus.OK)
  //     .expect('Content-Type', /json/);

  //   expect(response.body).toBeDefined();

  // });


  // it('/GET scrape-logo - should scrape logo successfully', async () => {
  //   const url = 'https://example.com';
  //   const response = await request(app.getHttpServer())
  //     .get('/scraper/scrape-logo?url=' + encodeURIComponent(url))
  //     .expect(HttpStatus.OK)
  //     .expect('Content-Type', /json/);

  //   expect(response.body).toBeDefined();

  // });


  // it('/GET screenshot - should get screenshot successfully', async () => {
  //   const url = 'https://example.com';
  //   const response = await request(app.getHttpServer())
  //     .get('/scraper/screenshot?url=' + encodeURIComponent(url))
  //     .expect(HttpStatus.OK)
  //     .expect('Content-Type', /json/);

  //   expect(response.body).toBeDefined();

  // });


  // it('/GET scrape-contact-info - should scrape contact info successfully', async () => {
  //   const url = 'https://example.com';
  //   const response = await request(app.getHttpServer())
  //     .get('/scraper/scrape-contact-info?url=' + encodeURIComponent(url))
  //     .expect(HttpStatus.OK)
  //     .expect('Content-Type', /json/);

  //   expect(response.body).toBeDefined();

  // });


  // it('/GET scrape-addresses - should scrape addresses successfully', async () => {
  //   const url = 'https://example.com';
  //   const response = await request(app.getHttpServer())
  //     .get('/scraper/scrape-addresses?url=' + encodeURIComponent(url))
  //     .expect(HttpStatus.OK)
  //     .expect('Content-Type', /json/);

  //   expect(response.body).toBeDefined();

  // });



});

