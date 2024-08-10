// scraperService.test.js

import { checkJobStatus, pollForResult } from '../../src/app/services/PubSubService';

// Mock the fetch API
global.fetch = jest.fn();

describe('checkJobStatus', () => {
  afterEach(() => {
    fetch.mockClear();
  });

  it('should return job status data when the fetch is successful', async () => {
    const mockData = { status: 'completed', result: 'some result' };
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const data = await checkJobStatus('http://example.com');
    expect(data).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith('http://localhost:3002/api/scraper/status/scrape/http%3A%2F%2Fexample.com');

  });

  it('should throw an error when the fetch response is not ok', async () => {
    fetch.mockResolvedValue({
      ok: false,
      statusText: 'Internal Server Error',
    });

    await expect(checkJobStatus('http://example.com')).rejects.toThrow('Error fetching job status: Internal Server Error');
    expect(fetch).toHaveBeenCalledWith('http://localhost:3002/api/scraper/status/scrape/http%3A%2F%2Fexample.com');

  });

  it('should throw an error when the fetch fails', async () => {
    const errorMessage = 'Network Error';
    fetch.mockRejectedValue(new Error(errorMessage));

    await expect(checkJobStatus('http://example.com')).rejects.toThrow('Network Error');
    expect(fetch).toHaveBeenCalledWith('http://localhost:3002/api/scraper/status/scrape/http%3A%2F%2Fexample.com');

  });
});

describe('pollForResult', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    fetch.mockClear();
    jest.useRealTimers();
  });

  it('should resolve with the result when the job status is completed', async () => {
    const mockData = { status: 'completed', result: 'some result' };
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const resultPromise = pollForResult('http://example.com');

    // Fast-forward time
    jest.advanceTimersByTime(5000);

    await expect(resultPromise).resolves.toEqual('some result');
  });


  it('should stop polling and reject if an error occurs', async () => {
    const errorMessage = 'Network Error';
    fetch.mockRejectedValue(new Error(errorMessage));

    const resultPromise = pollForResult('http://example.com');

    // Fast-forward time
    jest.advanceTimersByTime(5000);

    await expect(resultPromise).rejects.toThrow('Network Error');
  });
});
