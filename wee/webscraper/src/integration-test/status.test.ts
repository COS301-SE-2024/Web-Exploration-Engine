import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { StatusController } from '../status-app/status.controller';
import { StatusService } from '../status-app/status.service';

describe('StatusController', () => {
  let app: INestApplication;
  let statusService: StatusService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [StatusController],
      providers: [StatusService],
    }).compile();

    app = moduleFixture.createNestApplication();
    statusService = moduleFixture.get<StatusService>(StatusService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('/status (GET) - Success', async () => {
    // Mock test the statusService to return mock status responses
    jest.spyOn(statusService, 'status').mockImplementation(async () => true);

    const urls = 'https://example.com,https://anotherexample.com';
    const response = await request(app.getHttpServer())
      .get('/status')
      .query({ urls });

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual([true, true]);
  });

  it('/status/summary (GET) - Success', async () => {
    // Mock the statusService to return mock summary
    const mockSummary = { live: 70, parked: 30 };
    jest.spyOn(statusService, 'calculateSummary').mockResolvedValue(mockSummary);

    const urls = 'https://example.com,https://anotherexample.com';
    const response = await request(app.getHttpServer())
      .get('/status/summary')
      .query({ urls });

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual(mockSummary);
  });

  it('/status (GET) - Error in fetching status', async () => {
    // Mock test the statusService to throw an error
    const errorMessage = 'Failed to fetch status';
    jest.spyOn(statusService, 'status').mockRejectedValue(new Error(errorMessage));

    const urls = 'https://example.com';
    const response = await request(app.getHttpServer())
      .get('/status')
      .query({ urls });

    expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(response.body).toEqual({
      message: 'Internal server error',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  });


  it('/status/summary (GET) - Error in calculating summary', async () => {
    // Mock the statusService to throw an error
    const errorMessage = 'Failed to calculate summary';
    jest.spyOn(statusService, 'calculateSummary').mockRejectedValue(new Error(errorMessage));

    const urls = 'https://example.com';
    const response = await request(app.getHttpServer())
      .get('/status/summary')
      .query({ urls });

    expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(response.body).toEqual({
      message: 'Internal server error',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  });

  it('/status/summary (GET) - Missing URLs', async () => {
    const response = await request(app.getHttpServer()).get('/status/summary');

    expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(response.body).toEqual({
        message: 'Internal server error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  });
});
