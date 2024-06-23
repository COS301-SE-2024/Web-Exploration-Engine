import { Test, TestingModule } from '@nestjs/testing';
import { ScrapeStatusService } from './scrape-status.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ScrapeStatusService', () => {
  let service: ScrapeStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScrapeStatusService],
    }).compile();

    service = module.get<ScrapeStatusService>(ScrapeStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return live for a live website', async () => {
    mockedAxios.get.mockResolvedValue({
      status: 200,
      data: '<html><head></head><body>Google</body></html>',
    });
    const url = 'https://www.google.com';
    const status = await service.scrapeStatus(url);
    expect(status).toBe('live');
  });

  it('should return parked for a parked website', async () => {
    mockedAxios.get.mockResolvedValue({
      status: 200,
      data: '<html><head><meta name="generator" content="Next.js"></head><body></body></html>',
    });
    const url = 'https://www.example.co.za';
    const status = await service.scrapeStatus(url);
    expect(status).toBe('parked');
  });

  it('should return an error for an invalid URL', async () => {
    const url = '';
    const status = await service.scrapeStatus(url);
    expect(status).toEqual('error');
  });

  it('should return not working for a 404 error', async () => {
    mockedAxios.get.mockRejectedValue({
      response: {
        status: 404,
      },
    });
    const url = 'https://www.nonexistentwebsite.com';
    const status = await service.scrapeStatus(url);
    expect(status).toBe('not working');
  });

  it('should return under construction for a 500 error', async () => {
    mockedAxios.get.mockRejectedValue({
      response: {
        status: 500,
      },
    });
    const url = 'https://www.websitewithservererror.com';
    const status = await service.scrapeStatus(url);
    expect(status).toBe('under construction');
  });

  it('should return parked when no response is received', async () => {
    mockedAxios.get.mockRejectedValue({
      request: {},
    });
    const url = 'https://www.noresponsewebsite.com';
    const status = await service.scrapeStatus(url);
    expect(status).toBe('parked');
  });

  it('should return error for other errors', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network error'));
    const url = 'https://www.networkerrorwebsite.com';
    const status = await service.scrapeStatus(url);
    expect(status).toBe('error');
  });
});
