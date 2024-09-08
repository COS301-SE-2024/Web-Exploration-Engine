import { createClient } from '../../src/app/utils/supabase/server'; // Adjust paths as necessary
import * as service from '../../src/app/services/ScheduledScrapingService';
import { ScheduleTask } from '../../src/app/models/ScheduleModels';
import { error } from 'console';


jest.mock('../../src/app/utils/supabase/server', () => {
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

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));



describe('ScheduledScrapingService functions', () => {

  let supabaseClient: any;

  beforeEach(() => {
    supabaseClient = createClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createScheduleTask', () => {
    it('should create a new schedule successfully', async () => {
      const scheduleData = {
        user_id: 'user123',
        url: 'https://example.com',
        next_scrape: '2024-08-24T00:00:00.000Z',
        result_history: [],
        frequency: 'daily',
        keywords: ['keyword1', 'keyword2'],
        keyword_results: [],
      } as ScheduleTask;

      supabaseClient.insert.mockResolvedValueOnce({ data: [scheduleData], error: null });

      const result = await service.createScheduleTask(scheduleData);

      expect(supabaseClient.from).toHaveBeenCalledWith('scheduled_tasks');
      expect(supabaseClient.insert).toHaveBeenCalledWith([scheduleData]);
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

      supabaseClient.insert.mockResolvedValueOnce({ data: null, error: {message: 'Insert error'} });

      await expect(service.createScheduleTask(scheduleData)).rejects.toThrow('Failed to create schedule: Insert error');
    });
  });
});
