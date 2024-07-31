import { Test, TestingModule } from '@nestjs/testing';
import { SentimentAnalysisService } from './sentiment-analysis.service';
import { Metadata } from '../models/ServiceModels';
import axios from 'axios';
import { jest } from '@jest/globals';

describe('SentimentAnalysisService', () => {
  let service: SentimentAnalysisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SentimentAnalysisService],
    }).compile();

    service = module.get<SentimentAnalysisService>(SentimentAnalysisService);
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

 
});
