import { Test, TestingModule } from '@nestjs/testing';
import { ScrapeStatusService } from './scrape-status.service';

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
    const url = 'https://www.google.com';
    const status = await service.scrapeStatus(url);
    expect(status).toBe('live');
  });

  it('should return parked for a parked website', async () => {
    const url = 'https://www.example.com';
    const status = await service.scrapeStatus(url);
    expect(status).toBe('parked');
  });

  it('should return an error for an invalid URL', async () => {
    const url = '';
    const status = await service.scrapeStatus(url);
    expect(status).toEqual({
      errorStatus: 400,
      errorCode: '400 Bad Request',
      errorMessage: 'URL parameter is required',
    });
  });
});
