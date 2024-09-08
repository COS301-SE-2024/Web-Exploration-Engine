import { createClient } from '../../src/app/utils/supabase/server';
import * as service from '../../src/app/services/ScheduledScrapingService';


jest.mock('../../src/app/utils/supabase/server', () => ({
  createClient: jest.fn(),
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));


const mockSupabaseClient = {
  auth: {
    signInWithPassword: jest.fn(),
    signInWithOAuth: jest.fn(),
    signUp: jest.fn(),
    getUser: jest.fn(),
    resetPasswordForEmail: jest.fn(),
    updateUser: jest.fn(),
  },
  from: jest.fn().mockReturnThis(), // Mock from to return the same object (allowing chaining)
  insert: jest.fn(), // Mock insert to be chained after from
  select: jest.fn().mockReturnThis(), // Mock select for other tests
  eq: jest.fn().mockReturnThis(), // Mock eq to be used in chaining
  delete: jest.fn().mockReturnThis(), // Mock delete for delete tests
};

(createClient as jest.Mock).mockReturnValue(mockSupabaseClient);

describe('ScheduledScrapingService functions', () => {
  describe('createScheduleTask', () => {
    it('should create a new schedule successfully', async () => {
      const scheduleData = {
        id: 'schedule123',
        url: 'https://example.com',
        next_scrape: '2024-08-24T00:00:00.000Z',
        result_history: [],
        frequency: 'daily',
      };

      mockSupabaseClient.insert.mockResolvedValueOnce({ data: [scheduleData], error: null });

      const result = await service.createScheduleTask(scheduleData);

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('scheduled_tasks');
      expect(mockSupabaseClient.insert).toHaveBeenCalledWith([scheduleData]);
      expect(result).toEqual([scheduleData]);
    });

    it('should throw an error if schedule creation fails', async () => {
      const scheduleData = {
        id: 'schedule123',
        url: 'https://example.com',
        next_scrape: '2024-08-24T00:00:00.000Z',
        result_history: [],
        frequency: 'daily',
      };

      mockSupabaseClient.insert.mockResolvedValueOnce({ data: null, error: 'Insert error' });

      await expect(service.createScheduleTask(scheduleData)).rejects.toThrow('Failed to create schedule: Insert error');
    });
  });
});

