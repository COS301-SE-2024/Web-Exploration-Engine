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



});
