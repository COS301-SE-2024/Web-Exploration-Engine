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

      // Mocking an unexpected API response format
      mockedAxios.post.mockResolvedValueOnce({
        data: [{ label: 'joy', score: 0.8 }, { label: 'anger', score: 0.2 }],
      });

      const result = await service.analyzeEmotions(metadata);

      // Expecting empty object due to unexpected format
      expect(result).toEqual({});
    });
  });

});
