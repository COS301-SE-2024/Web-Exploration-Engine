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

  describe('sentimentAnalysis', () => {
    it('should analyze sentiment successfully', async () => {
      const metadata: Metadata = {
        title: 'Test Title', description: 'Test Description', keywords: 'test keywords',
        ogTitle: '',
        ogDescription: '',
        ogImage: ''
      };
      const sentimentScores = { positive: 0.8, negative: 0.1, neutral: 0.1 };

      jest.spyOn(axios, 'post').mockResolvedValue({ data: [[{ label: 'POS', score: 0.8 }, { label: 'NEG', score: 0.1 }, { label: 'NEU', score: 0.1 }]] });

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

      jest.spyOn(axios, 'post').mockRejectedValue(new Error('Network error'));

      const result = await service.sentimentAnalysis(metadata);
      expect(result).toEqual({ positive: 0, negative: 0, neutral: 0 });
    });
  });

  describe('getPositiveNegativeWords', () => {
    it('should return positive and negative words successfully', async () => {
      const metadata: Metadata = {
        title: 'Test Title', description: 'Test Description', keywords: 'test keywords',
        ogTitle: '',
        ogDescription: '',
        ogImage: ''
      };


      const positiveWords = ['Test', 'Title', 'Description', 'test', 'keywords'];
      const negativeWords = [];

      // Mock the API response
      jest.spyOn(axios, 'post').mockResolvedValue({
        data: [[
          { label: '5 stars', score: 0.9 },
          { label: '1 star', score: 0.8 }
        ]]
      });

      
      const result = await service.getPositiveNegativeWords(metadata);
      expect(result).toEqual({ positiveWords, negativeWords });
    });


    it('should handle errors and return empty word lists', async () => {
      const metadata: Metadata = {
        title: 'Test Title', description: 'Test Description', keywords: 'test keywords',
        ogTitle: '',
        ogDescription: '',
        ogImage: ''
      };

      jest.spyOn(axios, 'post').mockRejectedValue(new Error('Network error'));

      const result = await service.getPositiveNegativeWords(metadata);
      expect(result).toEqual({ positiveWords: [], negativeWords: [] });
    });
  });


});