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

  describe('createSchedule', () => {
    it('should call SupabaseService.createSchedule with the correct parameters', async () => {
      const schedule: ScheduleTask = {
        user_id: '1',
        url: 'http://example.com',
        frequency: 'daily',
      };
      await service.createSchedule(schedule);
      jest.spyOn(supabaseService, 'createSchedule').mockResolvedValue(undefined);
      expect(supabaseService.createSchedule).toHaveBeenCalledWith(schedule);
    });
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

  describe('pollApiEndpoint', () => {
    it('should poll the API endpoint until results are received or max retries are reached', async () => {
      const url = 'http://example.com';
      const schedule: ScheduleTaskResponse = { 
        id: '1', 
        user_id: '1', 
        url: 'http://example.com', 
        frequency: 'daily', 
        next_scrape: '2021-01-01T00:00:00.000Z', 
        updated_at: '2021-01-01T00:00:00.000Z', 
        created_at: '2021-01-01T00:00:00.000Z', 
        result_history: [],
      };

      const handleApiResultsSpy = jest.spyOn(service, 'handleApiResults');

      const mockResponse = { data: { status: 'completed', result: 'result' } };
      (axios.get as jest.Mock).mockResolvedValue(mockResponse);

      await service.pollApiEndpoint(url, schedule);

      expect(axios.get).toHaveBeenCalled();
      expect(handleApiResultsSpy).toHaveBeenCalledWith('result', schedule);
    }, 10000);

  //   it('should retry polling on failure', async () => {
  //     const url = 'http://example.com';
  //     const schedule: ScheduleTaskResponse = { 
  //       id: '1', 
  //       user_id: '1', 
  //       url: 'http://example.com', 
  //       frequency: 'daily', 
  //       next_scrape: '2021-01-01T00:00:00.000Z', 
  //       updated_at: '2021-01-01T00:00:00.000Z', 
  //       created_at: '2021-01-01T00:00:00.000Z', 
  //       result_history: [],
  //     };
  //     (axios.get as jest.Mock).mockRejectedValue(new Error('API error'));

  //     await service.pollApiEndpoint(url, schedule);

  //     expect(axios.get).toHaveBeenCalledTimes(expect.any(Number));
  //   }, 10000);
  });

  describe('handleApiResults', () => {
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
      };
      const updateSpy = jest.spyOn(supabaseService, 'updateSchedule').mockResolvedValue(undefined);

      await service.handleApiResults(results, schedule);

      expect(updateSpy).toHaveBeenCalledWith({
        id: '1',
        result_history: expect.any(Array),
        newResults: results,
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
