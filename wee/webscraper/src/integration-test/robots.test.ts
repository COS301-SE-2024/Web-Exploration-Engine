import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { RobotsController } from '../robots-app/robots.controller';
import { RobotsService } from '../robots-app/robots.service';

describe('RobotsController', () => {
  let app: INestApplication;
  let robotsService: RobotsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RobotsController],
      providers: [
        {
          provide: RobotsService,
          useValue: {
            getAllowedPaths: jest.fn(),
          },
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    robotsService = module.get<RobotsService>(RobotsService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /robots/allowed-paths', () => {
    it('should return allowed paths from robots.txt', async () => {
      const url = 'http://example.com';
      const expectedResult = ['/path1', '/path2'];
      jest.spyOn(robotsService, 'getAllowedPaths').mockResolvedValueOnce(new Set(expectedResult));

      const response = await request(app.getHttpServer())
        .get('/robots/allowed-paths')
        .query({ url });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual({ allowedPaths: expectedResult });
    });

     //handle empty url case
    it('should handle missing URL parameter', async () => {
      const response = await request(app.getHttpServer())
        .get('/robots/allowed-paths');

      expect(response.status).toBe(HttpStatus.OK);
    });

    it('should handle error from RobotsService', async () => {
      const url = 'http://example.com';
      const errorMessage = 'Failed to retrieve allowed paths';

      jest.spyOn(robotsService, 'getAllowedPaths').mockImplementationOnce(async () => {
        throw new Error(errorMessage);
      });

      const response = await request(app.getHttpServer())
        .get('/robots/allowed-paths')
        .query({ url });

      expect(response.status).toBe(HttpStatus.OK);

    });

  });
});
