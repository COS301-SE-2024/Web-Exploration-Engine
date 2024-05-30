import { Test, TestingModule } from '@nestjs/testing';
import { ScrapingService } from '../status-app/scraping.service';
import axios from 'axios';

jest.mock('axios');

describe('ScrapingService', () => {
  let service: ScrapingService;
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScrapingService],
    }).compile();

    service = module.get<ScrapingService>(ScrapingService);
  });

  // Test case to ensure that the service is defined
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Test case to check if the service returns true for status code 200
  it('should return true for status code 200', async () => {
    mockedAxios.head.mockResolvedValueOnce({ status: 200 });

    const result = await service.status('http://example.com');
    expect(result).toBe(true);
  });

  // Test case to check if the service returns true for status code 299
  it('should return true for status code 299', async () => {
    mockedAxios.head.mockResolvedValueOnce({ status: 299 });

    const result = await service.status('http://example.com');
    expect(result).toBe(true);
  });

  // Test case to check if the service returns false for status code 300
  it('should return false for status code 300', async () => {
    mockedAxios.head.mockResolvedValueOnce({ status: 300 });

    const result = await service.status('http://example.com');
    expect(result).toBe(false);
  });

  // Test case to check if the service returns false for status code 404
  it('should return false for status code 404', async () => {
    mockedAxios.head.mockResolvedValueOnce({ status: 404 });

    const result = await service.status('http://example.com');
    expect(result).toBe(false);
  });

  // Test case to check if the service returns false for status code 500
  it('should return false for status code 500', async () => {
    mockedAxios.head.mockResolvedValueOnce({ status: 500 });

    const result = await service.status('http://example.com');
    expect(result).toBe(false);
  });

  // Test case to check if the service returns false for network error
  it('should return false for network error', async () => {
    mockedAxios.head.mockRejectedValueOnce(new Error('Network Error'));

    const result = await service.status('http://example.com');
    expect(result).toBe(false);
  });
});
