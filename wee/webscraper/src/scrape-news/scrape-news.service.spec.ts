import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { NewsScraperService } from './scrape-news.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('NewsScraperService', () => {
  let service: NewsScraperService;

  // mock api url
  process.env.SENTIMENT_ANALYSIS_API_URL = 'mocked-api-url';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewsScraperService],
    }).compile();

    service = module.get<NewsScraperService>(NewsScraperService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchNewsArticles', () => {
    it('should fetch news articles and return them with sentiment scores', async () => {
      const mockedRssData = `
        <rss>
          <channel>
            <item>
              <title>Test Article 1</title>
              <link>http://example.com/article1</link>
              <source>Example Source</source>
              <pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
            </item>
          </channel>
        </rss>
      `;

      mockedAxios.get.mockResolvedValueOnce({ status: 200, data: mockedRssData });

      mockedAxios.post.mockResolvedValueOnce({
        data: [
          [
            { label: 'POS', score: 0.7 },
            { label: 'NEG', score: 0.2 },
            { label: 'NEU', score: 0.1 },
          ],
        ],
      });

      const articles = await service.fetchNewsArticles('http://example.com');

      expect(mockedAxios.get).toHaveBeenCalledWith('https://news.google.com/rss/search?q=example');
      expect(mockedAxios.post).toHaveBeenCalled();
      expect(articles).toEqual([
        {
          title: 'Test Article 1',
          link: 'http://example.com/article1',
          source: undefined,
          pubDate: 'Mon, 01 Jan 2024 00:00:00 GMT',
          sentimentScores: { positive: 0.7, negative: 0.2, neutral: 0.1 },
        },
      ]);
    });

    it('should throw an error if unable to fetch news articles', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Failed to fetch'));

      await expect(service.fetchNewsArticles('http://example.com')).rejects.toThrow('Error fetching news articles: Failed to fetch');
    });
  });

  describe('extractBusinessName', () => {
    it('should extract the business name from a URL', () => {
      const url = 'http://example.com';
      const businessName = service['extractBusinessName'](url);

      expect(businessName).toBe('example');
    });

    it('should return null for an invalid URL', () => {
      const url = 'invalid-url';
      const businessName = service['extractBusinessName'](url);

      expect(businessName).toBeNull();
    });
  });

  describe('getSentiment', () => {
    it('should return sentiment scores from the API', async () => {
      const inputText = 'Test article';
      mockedAxios.post.mockResolvedValueOnce({
        data: [
          [
            { label: 'POS', score: 0.8 },
            { label: 'NEG', score: 0.1 },
            { label: 'NEU', score: 0.1 },
          ],
        ],
      });

      const sentimentScores = await service['getSentiment'](inputText);

      expect(sentimentScores).toEqual({ positive: 0.8, negative: 0.1, neutral: 0.1 });
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'mocked-api-url',
        { text: inputText },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should handle errors and return default sentiment scores', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('API Error'));

      const sentimentScores = await service['getSentiment']('Test article');

      expect(sentimentScores).toEqual({ positive: 0, negative: 0, neutral: 0 });
      expect(mockedAxios.post).toHaveBeenCalled();
    });
  });
});
