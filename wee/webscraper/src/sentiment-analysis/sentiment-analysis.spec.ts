import { Test, TestingModule } from '@nestjs/testing';
import { SentimentAnalysisService } from './sentiment-analysis.service';
import axios from 'axios';
import { Metadata, SentimentClassification } from '../models/ServiceModels';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SentimentAnalysisService', () => {
  let service: SentimentAnalysisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SentimentAnalysisService],
    }).compile();

    service = module.get<SentimentAnalysisService>(SentimentAnalysisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('analyzeEmotions', () => {
    it('should return emotions', async () => {
      const metadata: Metadata = {
        title: 'Sample Title',
        description: 'Sample Description',
        keywords: 'Sample Keywords',
        ogTitle: 'Open Graph Title',
        ogDescription: 'Open Graph Description',
        ogImage: 'https://example.com/image.jpg',
      };

      mockedAxios.post.mockResolvedValueOnce({
        data: [
          [{ label: 'joy', score: 0.8 }, { label: 'anger', score: 0.2 }],
        ],
      });

      const result = await service.analyzeEmotions(metadata);

      expect(result).toEqual({ joy: 0.8, anger: 0.2 });
    });

    it('should handle errors and return empty emotions', async () => {
      const metadata: Metadata = {
        title: '',
        description: '',
        keywords: '',
        ogTitle: '',
        ogDescription: '',
        ogImage: '',
      };

      mockedAxios.post.mockRejectedValueOnce(new Error('API error'));

      const result = await service.analyzeEmotions(metadata);

      expect(result).toEqual({});
    });

    it('should handle unexpected API response format', async () => {
      const metadata: Metadata = {
        title: 'Sample Title',
        description: 'Sample Description',
        keywords: 'Sample Keywords',
        ogTitle: 'Open Graph Title',
        ogDescription: 'Open Graph Description',
        ogImage: 'https://example.com/image.jpg',
      };

      mockedAxios.post.mockResolvedValueOnce({
        data: [{ label: 'joy', score: 0.8 }, { label: 'anger', score: 0.2 }],
      });

      const result = await service.analyzeEmotions(metadata);

      expect(result).toEqual({});
    });
  });

  describe('getPositiveNegativeWords', () => {
    it('should return positive and negative words', async () => {
      const metadata: Metadata = {
        title: 'Takealot.com: Online Shopping | SA\'s leading online store',
        description: 'South Africa\'s leading online store. Fast, reliable delivery to your door. Many ways to pay. Shop anything you can imagine: TVs, laptops, cellphones, kitchen appliances, toys, books, beauty & more. Shop the mobile app anytime, anywhere.',
        keywords: null,
        ogTitle: 'Takealot.com: Online Shopping | SA\'s leading online store',
        ogDescription: 'South Africa\'s leading online store. Fast, reliable delivery to your door. Many ways to pay. Shop anything you can imagine: TVs, laptops, cellphones, kitchen appliances, toys, books, beauty & more. Shop the mobile app anytime, anywhere.',
        ogImage: 'https://www.takealot.com/static/images/logo_transparent.png'
      };


      mockedAxios.post.mockResolvedValueOnce({
        data: [
     //come back to this part and fix it ??
        ],
      });

      const result = await service.getPositiveNegativeWords(metadata);

      expect(result).toEqual({
        positiveWords: [],
        negativeWords: [],
      });
    });


    it('should handle errors and return empty word lists', async () => {
      const metadata: Metadata = {
        title: '',
        description: '',
        keywords: '',
        ogTitle: '',
        ogDescription: '',
        ogImage: '',
      };

      mockedAxios.post.mockRejectedValueOnce(new Error('API error'));

      const result = await service.getPositiveNegativeWords(metadata);

      expect(result).toEqual({ positiveWords: [], negativeWords: [] });
    });

    it('should handle unexpected API response format', async () => {
      const metadata: Metadata = {
        title: 'Sample Title',
        description: 'Sample Description',
        keywords: 'Sample Keywords',
        ogTitle: 'Open Graph Title',
        ogDescription: 'Open Graph Description',
        ogImage: 'https://example.com/image.jpg',
      };

      mockedAxios.post.mockResolvedValueOnce({
        data: [{ label: 'unexpectedLabel', score: 0.5 }],
      });

      const result = await service.getPositiveNegativeWords(metadata);

      expect(result).toEqual({
        positiveWords: [],
        negativeWords: [],
      });
    });
  });
});
