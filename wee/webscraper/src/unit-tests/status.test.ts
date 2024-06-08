import { Test, TestingModule } from '@nestjs/testing';
import { StatusService } from '../status-app/status.service';
import axios from 'axios';

jest.mock('axios');

describe('ScrapingService', () => {
  let service: StatusService;
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatusService],
    }).compile();

    service = module.get<StatusService>(StatusService);
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
  it('should calculate the correct percentages of live and parked URLs', async () => {
    const urls = [
      'http://example1.com',
      'http://example2.com',
      'http://example3.com',
      'http://example4.com'
    ];

    mockedAxios.head
      .mockResolvedValueOnce({ status: 200 })
      .mockResolvedValueOnce({ status: 200 })
      .mockResolvedValueOnce({ status: 404 })
      .mockResolvedValueOnce({ status: 500 });

    const result = await service.calculatePercentages(urls);

    expect(result.live).toBeCloseTo(50);
    expect(result.parked).toBeCloseTo(50);
  });

  // Test case for all live URLs
  it('should return 100% live and 0% parked for all live URLs', async () => {
    const urls = [
      'http://example1.com',
      'http://example2.com',
      'http://example3.com',
      'http://example4.com'
    ];

    mockedAxios.head
      .mockResolvedValueOnce({ status: 200 })
      .mockResolvedValueOnce({ status: 200 })
      .mockResolvedValueOnce({ status: 200 })
      .mockResolvedValueOnce({ status: 200 });

    const result = await service.calculatePercentages(urls);

    expect(result.live).toBeCloseTo(100);
    expect(result.parked).toBeCloseTo(0);
  });

  // Test case for all parked URLs
  it('should return 0% live and 100% parked for all parked URLs', async () => {
    const urls = [
      'http://example1.com',
      'http://example2.com',
      'http://example3.com',
      'http://example4.com'
    ];

    mockedAxios.head
      .mockResolvedValueOnce({ status: 404 })
      .mockResolvedValueOnce({ status: 500 })
      .mockResolvedValueOnce({ status: 404 })
      .mockResolvedValueOnce({ status: 500 });

    const result = await service.calculatePercentages(urls);

    expect(result.live).toBeCloseTo(0);
    expect(result.parked).toBeCloseTo(100);
  });

  // Test case for a mix of live, parked, and network error URLs
  it('should calculate the correct percentages with mixed live, parked, and network error URLs', async () => {
    const urls = [
      'http://example1.com',
      'http://example2.com',
      'http://example3.com',
      'http://example4.com'
    ];

    mockedAxios.head
      .mockResolvedValueOnce({ status: 200 })
      .mockResolvedValueOnce({ status: 404 })
      .mockResolvedValueOnce({ status: 500 })
      .mockRejectedValueOnce(new Error('Network Error'));

    const result = await service.calculatePercentages(urls);

    expect(result.live).toBeCloseTo(25);
    expect(result.parked).toBeCloseTo(75);
  });
});
