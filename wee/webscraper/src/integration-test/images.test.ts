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
    const response = await request(app.getHttpServer())
      .get('/isCrawlingAllowed')
      .query({ urls: 'https://www.takealot.com' });

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toHaveProperty('https://www.takealot.com');
  });

  it('/scrapeImages (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/scrapeImages')
      .query({ urls: 'https://www.takealot.com' })
      .timeout(10000); // Increase timeout to 10 seconds

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toHaveProperty('https://www.takealot.com');
    expect(response.body['https://www.takealot.com']).toHaveLength(50); // Adjust as per your expected response
  }, 15000); // Increase timeout for this specific test to 15 seconds


  it('/scrapeLogos (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/scrapeLogos')
      .query({ urls: 'https://www.takealot.com' });

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toHaveProperty('https://www.takealot.com');
    expect(typeof response.body['https://www.takealot.com']).toBe('string');
  });

  it('/scrape-metadata (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/scrape-metadata')
      .query({ url: 'https://www.takealot.com' });

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toHaveProperty('https://www.takealot.com');
    expect(response.body['https://www.takealot.com']).toHaveProperty('title');
    expect(response.body['https://www.takealot.com']).toHaveProperty('description');
    expect(response.body['https://www.takealot.com']).toHaveProperty('author');
    expect(response.body['https://www.takealot.com']).toHaveProperty('publishedDate');
  });
});
