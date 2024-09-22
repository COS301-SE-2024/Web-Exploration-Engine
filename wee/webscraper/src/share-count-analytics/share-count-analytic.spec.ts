import axios from 'axios';
import { ShareCountService } from './share-count-analytics.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ShareCountService', () => {
  let service: ShareCountService;

  beforeEach(() => {
    service = new ShareCountService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch share count successfully', async () => {
    const mockResponse = { shares: 123 };
    mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

    const url = 'https://example.com';
    const result = await service.getShareCount(url);

    expect(mockedAxios.get).toHaveBeenCalledWith('https://api.sharedcount.com/v1.1', {
      params: {
        apikey: process.env.SHARE_COUNT_API_KEY,
        url: url,
      },
    });
    expect(result).toEqual(mockResponse);
  });

  it('should handle errors correctly', async () => {
    const errorMessage = 'Network Error';
    mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

    const url = 'https://example.com';

    await expect(service.getShareCount(url)).resolves.toBeNull();
  });
});
