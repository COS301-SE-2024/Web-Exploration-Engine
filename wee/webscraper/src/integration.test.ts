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
  }, 60000); 

  afterAll(async () => {
    await app.close();
  }, 60000);

  describe('/GET scraper', () => {
    it('should scrape a website successfully', async () => {
      const url = 'https://example.com';
      const response = await request(app.getHttpServer())
        .get('/scraper?url=' + encodeURIComponent(url))
        .expect(HttpStatus.OK)
        .expect('Content-Type', /json/)
        .timeout(60000);

      expect(response.body).toBeDefined();
    }, 60000);
  });

  describe('/GET read-robots', () => {
    it('should read robots.txt successfully', async () => {
      const url = 'https://example.com';
      const response = await request(app.getHttpServer())
        .get('/scraper/read-robots?url=' + encodeURIComponent(url))
        .expect(HttpStatus.OK)
        .expect('Content-Type', /json/)
        .timeout(60000);

      expect(response.body).toBeDefined();
    }, 60000);
  });

  describe('/GET scrape-metadata', () => {
    it('should scrape metadata successfully', async () => {
      const url = 'https://example.com';
      const response = await request(app.getHttpServer())
        .get('/scraper/scrape-metadata?url=' + encodeURIComponent(url))
        .expect(HttpStatus.OK)
        .expect('Content-Type', /json/)
        .timeout(60000);

      expect(response.body).toBeDefined();
    }, 60000);
  });



  describe('/GET classify-industry', () => {
    it('should classify industry successfully', async () => {
      const url = 'https://example.com';
      const response = await request(app.getHttpServer())
        .get('/scraper/classify-industry?url=' + encodeURIComponent(url))
        .expect(HttpStatus.OK)
        .expect('Content-Type', /json/)
        .timeout(60000);

      expect(response.body).toBeDefined();
    }, 60000);
  });

  describe('/GET scrape-images', () => {
    it('should scrape images successfully', async () => {
      const url = 'https://example.com';
      try {
        const response = await request(app.getHttpServer())
          .get('/scraper/scrape-images?url=' + encodeURIComponent(url))
          .expect(HttpStatus.OK)
          .expect('Content-Type', /json/)
          .timeout(60000);
  
        expect(response.body).toBeDefined();
      } catch (error) {
        console.error('Error in scrape-images test:', error.message);
        throw error;
      }
    }, 60000);
  });

  describe('/GET scrape-status', () => {
    it('should return status successfully', async () => {
      const url = 'https://example.com';
      const response = await request(app.getHttpServer())
        .get('/scraper/scrape-status?url=' + encodeURIComponent(url))
        .expect(HttpStatus.OK)
        .timeout(60000)
        .catch(err => {
          if (err.response) {
            console.error('Error Response:', err.response.text);
          }
          throw err;
        });

      expect(response.body).toBeDefined();
    }, 60000);
  });

  describe('/GET scrape-logo', () => {
    it('should scrape logo successfully', async () => {
      const url = 'https://example.com';
      const response = await request(app.getHttpServer())
        .get('/scraper/scrape-logo?url=' + encodeURIComponent(url))
        .expect(HttpStatus.OK)
        .timeout(60000)
        .catch(err => {
          if (err.response) {
            console.error('Error Response:', err.response.text);
          }
          throw err;
        });

      expect(response.body).toBeDefined();
    }, 60000);
  });


  describe('/GET screenshot', () => {
    it('should get screenshot successfully', async () => {
      const url = 'https://example.com';
      const response = await request(app.getHttpServer())
        .get('/scraper/screenshot?url=' + encodeURIComponent(url))
        .expect(HttpStatus.OK)
        .expect('Content-Type', /json/)
        .timeout(60000);

      expect(response.body).toBeDefined();
    }, 60000);
  });

  describe('/GET scrape-contact-info', () => {
    it('should scrape contact info successfully', async () => {
      const url = 'https://example.com';
      const response = await request(app.getHttpServer())
        .get('/scraper/scrape-contact-info?url=' + encodeURIComponent(url))
        .expect(HttpStatus.OK)
        .expect('Content-Type', /json/)
        .timeout(60000);

      expect(response.body).toBeDefined();
    }, 60000);
  });

  describe('/GET scrape-addresses', () => {
    it('should scrape addresses successfully', async () => {
      const url = 'https://example.com';
      const response = await request(app.getHttpServer())
        .get('/scraper/scrape-addresses?url=' + encodeURIComponent(url))
        .expect(HttpStatus.OK)
        .expect('Content-Type', /json/)
        .timeout(60000);

      expect(response.body).toBeDefined();
    }, 60000);
  });
});
