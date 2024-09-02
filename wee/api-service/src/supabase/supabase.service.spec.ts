import { Test, TestingModule } from '@nestjs/testing';
import { SupabaseService } from './supabase.service';
import { createClient } from '@supabase/supabase-js';
import { ScheduleTask, UpdateScheduleTask, ScheduleTaskResponse } from '../models/scheduleTaskModels';
import { DateTime } from 'luxon';


jest.mock('@supabase/supabase-js', () => {
  const mockSupabaseClient = {
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
  };

  // allow chaining of methods - call last method in chain to resolve

  return {
    createClient: jest.fn().mockReturnValue(mockSupabaseClient),
    mockSupabaseClient, // Expose the mock client for testing
  };
});

jest.mock('luxon', () => {
  const originalLuxon = jest.requireActual('luxon');
  return {
    ...originalLuxon,
    DateTime: {
      ...originalLuxon.DateTime,
      now: () => originalLuxon.DateTime.fromISO('2024-09-01T11:00:00.000+02:00'),
    },
  };
});


describe('SupabaseService', () => {
  let service: SupabaseService;
  let supabaseClient: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupabaseService],
    }).compile();

    service = module.get<SupabaseService>(SupabaseService);
    supabaseClient = createClient('', 'key');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSchedule', () => {
    it('should create a new schedule successfully', async () => {
      const scheduleData: ScheduleTask = {
        user_id: 'user123',
        url: 'https://example.com',
        frequency: 'daily',
        next_scrape: DateTime.now().toUTC().toFormat("yyyy-MM-dd HH:mm:ss.SSSSSSZZ"),
      };
      

      supabaseClient.insert.mockResolvedValueOnce({ data: [scheduleData], error: null });

      const result = await service.createSchedule(scheduleData);

      expect(supabaseClient.from).toHaveBeenCalledWith('scheduled_tasks');
      expect(supabaseClient.insert).toHaveBeenCalledWith([{
        user_id: scheduleData.user_id,
        url: scheduleData.url,
        frequency: scheduleData.frequency,
        next_scrape: scheduleData.next_scrape,
        result_history: [],
      }]);
      expect(result).toEqual([scheduleData]);
    });

    it('should throw an error if schedule creation fails', async () => {
      const scheduleData: ScheduleTask = {
        user_id: 'user123',
        url: 'https://example.com',
        frequency: 'daily',
        next_scrape: DateTime.now().toUTC().toFormat("yyyy-MM-dd HH:mm:ss.SSSSSSZZ"),
      };

      supabaseClient.insert.mockResolvedValueOnce({ data: null, error: 'Insert error' });

      await expect(service.createSchedule(scheduleData)).rejects.toThrow('Failed to create schedule: Insert error');
    });
  });

  describe('updateSchedule', () => {
  
    it('should update a schedule successfully', async () => {
      // Define the mock time in UTC
      const mockTime = '2024-09-01T11:00:00.000+02:00'; // Fixed time for consistent testing
    
      const updateData = {
        id: 'schedule123',
        result_history: [
          {
            timestamp: mockTime,
            result: '',
          },
        ],
        newResults: {},
        updated_at: mockTime,
      };
    
      // Mock the Supabase client methods
      supabaseClient.from.mockReturnThis();
      supabaseClient.update.mockReturnThis();
      supabaseClient.eq.mockResolvedValueOnce({ data: [updateData], error: null });
    
      const result = await service.updateSchedule({
        id: updateData.id,
        result_history: updateData.result_history,
        newResults: updateData.newResults,
      });
    
      // Assertions
      expect(supabaseClient.from).toHaveBeenCalledWith('scheduled_tasks');
      expect(supabaseClient.update).toHaveBeenCalledWith({
        result_history: updateData.result_history,
        updated_at: mockTime
      });
      expect(supabaseClient.eq).toHaveBeenCalledWith('id', updateData.id);
      expect(result).toEqual([updateData]);
    
      // Restore the original DateTime.now() method after the test
      jest.restoreAllMocks();
    });
    

    it('should throw an error if schedule update fails', async () => {
      const updateData: UpdateScheduleTask = {
        id: 'schedule123',
        result_history: [],
        newResults: {},
      };

      supabaseClient.eq.mockResolvedValue({ data: null, error: {message: 'Update error'} });

      await expect(service.updateSchedule(updateData)).rejects.toThrow('Failed to update schedule: Update error');
    });
  });

  describe('getDueSchedules', () => {
    it('should return due schedules successfully', async () => {
      const dueSchedules: ScheduleTaskResponse[] = [
        { 
          id: 'schedule123', 
          user_id: 'user123',
          url: 'https://example.com', 
          frequency: 'daily',
          next_scrape: '2024-08-24T00:00:00.000Z', 
          updated_at: '2024-08-24T00:00:00.000Z',
          created_at: '2024-08-24T00:00:00.000Z',
          result_history: [] 
        },
      ];

      supabaseClient.lte.mockResolvedValue({ data: dueSchedules, error: null });

      const result = await service.getDueSchedules();

      expect(supabaseClient.from).toHaveBeenCalledWith('scheduled_tasks');
      expect(supabaseClient.select).toHaveBeenCalledWith('*');
      expect(result).toEqual(dueSchedules);
    });

    it('should throw an error if fetching due schedules fails', async () => {
      supabaseClient.lte.mockResolvedValue({ data: null, error: { message:'Select error' } });

      await expect(service.getDueSchedules()).rejects.toThrow('Failed to fetch due schedules: Select error');
    });
  });

  // describe('updateNextScrapeTime', () => {
  //   it('should update the next scrape time successfully', async () => {
  //     const schedule: ScheduleTaskResponse = {
  //       id: 'schedule123', 
  //         user_id: 'user123',
  //         url: 'https://example.com', 
  //         frequency: 'daily',
  //         next_scrape: '2024-08-24T00:00:00.000Z', 
  //         updated_at: '2024-08-24T00:00:00.000Z',
  //         created_at: '2024-08-24T00:00:00.000Z',
  //         result_history: [] 
  //     };

  //     supabaseClient.update.mockResolvedValue({ data: [schedule], error: null });

  //     const result = await service.updateNextScrapeTime(schedule);

  //     expect(supabaseClient.from).toHaveBeenCalledWith('scheduled_tasks');
  //     expect(supabaseClient.update).toHaveBeenCalledWith({
  //       next_scrape: schedule.next_scrape,
  //     });
  //     expect(supabaseClient.eq).toHaveBeenCalledWith('id', schedule.id);
  //     expect(result).toEqual([schedule]);
  //   });

  //   it('should throw an error if updating next scrape time fails', async () => {
  //     const schedule: ScheduleTaskResponse = {
  //       id: 'schedule123',
  //       url: 'https://example.com',
  //       next_scrape: '2024-08-24T00:00:00.000Z',
  //       result_history: [],
  //     };

  //     supabaseClient.update.mockResolvedValue({ data: null, error: 'Update error' });

  //     await expect(service.updateNextScrapeTime(schedule)).rejects.toThrow('Failed to update next scrape time: Update error');
  //   });
  // });

  describe('calculateNextScrapeTime', () => {
    it('should return the correct date for daily frequency', () => {
      const result = service.calculateNextScrapeTime('daily');
      expect(result).toBe('2024-09-02T11:00:00.000+02:00');
    });

    it('should return the correct date for weekly frequency', () => {
      const result = service.calculateNextScrapeTime('weekly');
      expect(result).toBe('2024-09-08T11:00:00.000+02:00');
    });

    it('should return the correct date for bi-weekly frequency', () => {
      const result = service.calculateNextScrapeTime('bi-weekly');
      expect(result).toBe('2024-09-15T11:00:00.000+02:00');
    });

    it('should return the correct date for monthly frequency', () => {
      const result = service.calculateNextScrapeTime('monthly');
      expect(result).toBe('2024-10-01T11:00:00.000+02:00');
    });

    it('should throw an error for invalid frequency', () => {
      expect(() => service.calculateNextScrapeTime('invalid')).toThrow('Invalid frequency: invalid');
    });
  });
});