import { Test, TestingModule } from '@nestjs/testing';
import { SentimentAnalysisService } from './sentiment-analysis.service';
import { Metadata } from '../models/ServiceModels';
import axios from 'axios';
import { jest } from '@jest/globals';


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
    jest.clearAllTimers();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('classifySentiment', () => {
    it('should classify sentiment successfully', async () => {
      const metadata: Metadata = {
        title: 'Test Title',
        description: 'Test Description',
        keywords: 'test keywords',
        ogTitle: '',
        ogDescription: '',
        ogImage: ''
      };

      const sentimentAnalysisResult = { positive: 0.8, negative: 0.1, neutral: 0.1 };
      const positiveWords = ['great', 'amazing'];
      const negativeWords = ['bad', 'terrible'];
      const emotions = { happy: 0.9, sad: 0.1 };

      jest.spyOn(service, 'sentimentAnalysis').mockResolvedValue(sentimentAnalysisResult);
      jest.spyOn(service, 'getPositiveNegativeWords').mockResolvedValue({ positiveWords, negativeWords });
      jest.spyOn(service, 'analyzeEmotions').mockResolvedValue(emotions);

      const result = await service.classifySentiment('', metadata);
      expect(result).toEqual({
        sentimentAnalysis: sentimentAnalysisResult,
        positiveWords,
        negativeWords,
        emotions,
      });
    });

    it('should handle errors and return default values', async () => {
      const metadata: Metadata = {
        title: '', description: '', keywords: '',
        ogTitle: '',
        ogDescription: '',
        ogImage: ''
      };

      jest.spyOn(service, 'sentimentAnalysis').mockRejectedValue(new Error('Network error'));
      jest.spyOn(service, 'getPositiveNegativeWords').mockRejectedValue(new Error('Network error'));
      jest.spyOn(service, 'analyzeEmotions').mockRejectedValue(new Error('Network error'));

      const result = await service.classifySentiment('', metadata);
      expect(result).toEqual({
        sentimentAnalysis: { positive: 0, negative: 0, neutral: 0 },
        positiveWords: [],
        negativeWords: [],
        emotions: {},
      });
    });
  });

  describe('sentimentAnalysis', () => {
    it('should analyze sentiment successfully', async () => {
      const metadata: Metadata = {
        title: 'Test Title', description: 'Test Description', keywords: 'test keywords',
        ogTitle: '',
        ogDescription: '',
        ogImage: ''
      };
      const sentimentScores = { positive: 0.8, negative: 0.1, neutral: 0.1 };

      mockedAxios.post.mockResolvedValue({
        data: [[
          { label: 'POS', score: 0.8 },
          { label: 'NEG', score: 0.1 },
          { label: 'NEU', score: 0.1 }
        ]]
      });

      const result = await service.sentimentAnalysis(metadata);
      expect(result).toEqual(sentimentScores);
    });

    it('should handle errors and return default sentiment scores', async () => {
      const metadata: Metadata = {
        title: 'Test Title', description: 'Test Description', keywords: 'test keywords',
        ogTitle: '',
        ogDescription: '',
        ogImage: ''
      };

      mockedAxios.post.mockRejectedValue(new Error('Network error'));

      const result = await service.sentimentAnalysis(metadata);
      expect(result).toEqual({ positive: 0, negative: 0, neutral: 0 });
    });

    it('should handle unexpected response format from sentiment analysis API', async () => {
      const metadata: Metadata = {
        title: 'Test Title', description: 'Test Description', keywords: 'test keywords',
        ogTitle: '',
        ogDescription: '',
        ogImage: ''
      };

      mockedAxios.post.mockResolvedValue({
        data: {}
      });

      const expectedSentimentScores = { positive: 0, negative: 0, neutral: 0 };

      const result = await service.sentimentAnalysis(metadata);
      expect(result).toEqual(expectedSentimentScores);
    });
  });

  describe('getPositiveNegativeWords', () => {
    it('should return positive and negative words successfully', async () => {
      const metadata: Metadata = {
        title: 'Test Title',
        description: 'Test Description',
        keywords: 'great amazing bad terrible',
        ogTitle: '',
        ogDescription: '',
        ogImage: ''
      };
  
      const positiveWords = ['Test'];
      const negativeWords = [];
  
      mockedAxios.post.mockResolvedValue({
        data: [[
          { label: '5 stars', score: 0.9 },
          { label: '1 star', score: 0.8 }
        ]]
      });
  
      const result = await service.getPositiveNegativeWords(metadata);
      expect(result).toEqual({ positiveWords, negativeWords });
    });
  
    it('should handle neutral/unknown sentiment and not include them in the lists', async () => {
      const metadata: Metadata = {
        title: 'Neutral Test',
        description: 'Neutral Description',
        keywords: 'neutral unknown',
        ogTitle: '',
        ogDescription: '',
        ogImage: ''
      };
  
      mockedAxios.post.mockResolvedValue({
        data: [
          [
            { label: '3 stars', score: 0.5 }, 
            { label: '3 stars', score: 0.4 }  
          ]
        ]
      });
  
      const result = await service.getPositiveNegativeWords(metadata);
      expect(result).toEqual({ positiveWords: [], negativeWords: [] });
    });
  
    it('should handle unexpected response format from token classification API', async () => {
      const metadata: Metadata = {
        title: 'Unexpected Format Test',
        description: 'Testing unexpected response format',
        keywords: 'unexpected response',
        ogTitle: '',
        ogDescription: '',
        ogImage: ''
      };
  
      mockedAxios.post.mockResolvedValue({
        data: {} 
      });
  
      const result = await service.getPositiveNegativeWords(metadata);
      expect(result).toEqual({ positiveWords: [], negativeWords: [] });
    });
  
    it('should handle empty batch response gracefully', async () => {
      const metadata: Metadata = {
        title: 'Empty Batch Test',
        description: 'Testing empty batch response',
        keywords: 'empty batch',
        ogTitle: '',
        ogDescription: '',
        ogImage: ''
      };
  
      mockedAxios.post.mockResolvedValue({
        data: [] 
      });
  
      const result = await service.getPositiveNegativeWords(metadata);
      expect(result).toEqual({ positiveWords: [], negativeWords: [] });
    });
  });
  

  describe('analyzeEmotions', () => {
    it('should analyze emotions successfully', async () => {
      const metadata: Metadata = {
        title: 'Test Title', description: 'Test Description', keywords: 'test keywords',
        ogTitle: '',
        ogDescription: '',
        ogImage: ''
      };
      const emotions = { happy: 0.9, sad: 0.1 };

      mockedAxios.post.mockResolvedValue({
        data: [[
          { label: 'happy', score: 0.9 },
          { label: 'sad', score: 0.1 }
        ]]
      });

      const result = await service.analyzeEmotions(metadata);
      expect(result).toEqual(emotions);
    });

    it('should handle errors and return empty emotions', async () => {
      const metadata: Metadata = {
        title: 'Test Title', description: 'Test Description', keywords: 'test keywords',
        ogTitle: '',
        ogDescription: '',
        ogImage: ''
      };

      mockedAxios.post.mockRejectedValue(new Error('Network error'));

      const result = await service.analyzeEmotions(metadata);
      expect(result).toEqual({});
    });

    it('should handle unexpected response format from emotion analysis API', async () => {
      const metadata: Metadata = {
        title: 'Test Title', description: 'Test Description', keywords: 'test keywords',
        ogTitle: '',
        ogDescription: '',
        ogImage: ''
      };

      mockedAxios.post.mockResolvedValue({
        data: {}
      });

      const expectedEmotions = {};
      const result = await service.analyzeEmotions(metadata);
      expect(result).toEqual(expectedEmotions);
    });
  });
});
