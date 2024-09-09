import { Test, TestingModule } from '@nestjs/testing';
import { SchedulerService } from './scheduler.service';
import { SupabaseService } from '../supabase/supabase.service';
import { PubSubService } from '../pub-sub/pub_sub.service';
import { ScheduleTask, ScheduleTaskResponse, UpdateScheduleTask } from '../models/scheduleTaskModels';
import axios from 'axios';
import * as cron from 'node-cron';

jest.mock('axios');

describe('SchedulerService', () => {
  let service: SchedulerService;
  let supabaseService: SupabaseService;
  let pubsubService: PubSubService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulerService,
        {
          provide: SupabaseService,
          useValue: {
            createSchedule: jest.fn(),
            getDueSchedules: jest.fn(),
            updateNextScrapeTime: jest.fn(),
            updateSchedule: jest.fn(),
            updateKeywordResult: jest.fn(),
          },
        },
        {
          provide: PubSubService,
          useValue: {
            publishMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SchedulerService>(SchedulerService);
    supabaseService = module.get<SupabaseService>(SupabaseService);
    pubsubService = module.get<PubSubService>(PubSubService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Stop all cron jobs
    cron.getTasks().forEach(task => task.stop());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkSchedules', () => {
    it('should skip execution if another job is running', async () => {
      service.isRunning = true;
      await service.checkSchedules();
      expect(supabaseService.getDueSchedules).not.toHaveBeenCalled();
    });

    it('should process due schedules', async () => {
      service.isRunning = false;
      const dueSchedules: ScheduleTaskResponse[] = [{ 
        id: '1', 
        user_id: '1', 
        url: 'http://example.com', 
        frequency: 'daily', 
        next_scrape: '2021-01-01T00:00:00.000Z', 
        updated_at: '2021-01-01T00:00:00.000Z', 
        created_at: '2021-01-01T00:00:00.000Z', 
        result_history: [],
        keywords: [],
        keyword_results: [],
       }];
      jest.spyOn(supabaseService, 'getDueSchedules').mockResolvedValue(dueSchedules);
      jest.spyOn(pubsubService, 'publishMessage').mockResolvedValue(undefined);
      const updateSpy = jest.spyOn(supabaseService, 'updateSchedule').mockResolvedValue(undefined);
      const mockResponse = { data: { status: 'completed', result: 'result' } };
      (axios.get as jest.Mock).mockResolvedValue(mockResponse);

      await service.checkSchedules();

      expect(pubsubService.publishMessage).toHaveBeenCalledWith(service.topicName, {
        type: 'scrape',
        data: { url: 'http://example.com' }
      });
      expect(updateSpy).toHaveBeenCalledWith({
        id: '1',
        result_history: expect.any(Array),
        newResults: expect.anything(),
      });
    }, 20000);

    it('should handle errors during execution', async () => {
      service.isRunning = false;
      jest.spyOn(supabaseService, 'getDueSchedules').mockRejectedValue(new Error('Failed to get schedules'));
      await expect(service.checkSchedules()).resolves.not.toThrow();
      expect(service.isRunning).toBe(false);
    });
  });

  describe('pollForResults', () => {
    it('should poll the API endpoint until results are received or max retries are reached', async () => {
      const schedule: ScheduleTaskResponse = { 
        id: '1', 
        user_id: '1', 
        url: 'http://example.com', 
        frequency: 'daily', 
        next_scrape: '2021-01-01T00:00:00.000Z', 
        updated_at: '2021-01-01T00:00:00.000Z', 
        created_at: '2021-01-01T00:00:00.000Z', 
        result_history: [],
        keywords: [],
        keyword_results: [],
      };

      const mockEndPoints = ['http://api.com/1', 'http://api.com/2'];

      const handleApiResultsSpy = jest.spyOn(service, 'handleApiResults');

      const mockResponse = { data: { status: 'completed', result: 'result' } };
      (axios.get as jest.Mock).mockResolvedValue(mockResponse);

      await service.pollForResults(mockEndPoints, schedule);

      expect(axios.get).toHaveBeenCalled();
      expect(handleApiResultsSpy).toHaveBeenCalledWith('result', schedule);
    }, 10000);

    it('should retry polling on failure', async () => {
      const schedule: ScheduleTaskResponse = { 
        id: '1', 
        user_id: '1', 
        url: 'http://example.com', 
        frequency: 'daily', 
        next_scrape: '2021-01-01T00:00:00.000Z', 
        updated_at: '2021-01-01T00:00:00.000Z', 
        created_at: '2021-01-01T00:00:00.000Z', 
        result_history: [],
        keywords: [],
        keyword_results: [],
      };
    
      const mockEndPoints = ['http://api.com/1', 'http://api.com/2'];
      const maxRetries = 20; // Set a specific number of retries to control test duration
      
      jest.spyOn(service, 'delay').mockImplementation(() => Promise.resolve()); // Mock delay to speed up the test
    
      // Mock axios.get to always throw an error to simulate failure
      (axios.get as jest.Mock).mockRejectedValue(new Error('API error'));
    
      // Call the pollForResults method
      await service.pollForResults(mockEndPoints, schedule);
    
      // Verify that axios.get was called the expected number of times (maxRetries * endpoints)
      expect(axios.get).toHaveBeenCalledTimes(mockEndPoints.length * maxRetries);
    }, 10000);
  });


  describe('handleScrapeResults', () => {
    it('should update schedule with the new results', async () => {
      const results = 'result';
      const schedule: ScheduleTaskResponse = { 
        id: '1', 
        user_id: '1', 
        url: 'http://example.com', 
        frequency: 'daily', 
        next_scrape: '2021-01-01T00:00:00.000Z', 
        updated_at: '2021-01-01T00:00:00.000Z', 
        created_at: '2021-01-01T00:00:00.000Z', 
        result_history: [],
        keywords: [],
        keyword_results: [],
      };
      const updateSpy = jest.spyOn(supabaseService, 'updateSchedule').mockResolvedValue(undefined);

      await service.handleScrapeResults(results, schedule);

      expect(updateSpy).toHaveBeenCalledWith({
        id: '1',
        result_history: expect.any(Array),
        newResults: results,
      });
    });
  });

  describe('handleKeywordResults', () => {
    it('should update schedule with the new results', async () => {
      const results = {
        keyword: 'keyword',
        timestampArr: ['2021-01-01T00:00:00.000Z'],
        ranking: '1',
        topTen: ['result1', 'result2'],
      };
      const schedule: ScheduleTaskResponse = { 
        id: '1', 
        user_id: '1', 
        url: 'http://example.com', 
        frequency: 'daily', 
        next_scrape: '2021-01-01T00:00:00.000Z', 
        updated_at: '2021-01-01T00:00:00.000Z', 
        created_at: '2021-01-01T00:00:00.000Z', 
        result_history: [],
        keywords: [],
        keyword_results: [],
      };
      const updateSpy = jest.spyOn(supabaseService, 'updateKeywordResult').mockResolvedValue(undefined);

      await service.handleKeywordResults(results, schedule);

      expect(updateSpy).toHaveBeenCalledWith({
        id: schedule.id,
        keyword: results.keyword,
        results: schedule.keyword_results,
        newRank: results.ranking,
        newTopTen: results.topTen, 
      });
    });
  });

  describe('delay', () => {
    it('should wait for the specified amount of time', async () => {
      const start = Date.now();
      await service.delay(100);
      const end = Date.now();
      expect(end - start).toBeGreaterThanOrEqual(100);
    });
  });
});
