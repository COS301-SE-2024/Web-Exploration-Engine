import { createClient } from '../../src/app/utils/supabase/server'; // Adjust paths as necessary
import * as service from '../../src/app/services/ScheduledScrapingService';
import { ScheduleTask, GetSchedulesResponse} from '../../src/app/models/ScheduleModels';


jest.mock('../../src/app/utils/supabase/server', () => {
  const mockSupabaseClient = {
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
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

  describe('getSchedules', () => {
    it('should get all schedules for a user', async () => {
      const user_id = 'user123';
      const scheduleData = {
        user_id,
        id: 'schedule123',
        url: 'https://example.com',
        next_scrape: '2024-08-24T00:00:00.000Z',
        result_history: [],
        frequency: 'daily',
        keywords: ['keyword1', 'keyword2'],
        keyword_results: [],
      };

      const expectedResponse = {
        id: scheduleData.id,
        url: scheduleData.url,
        next_scrape: scheduleData.next_scrape,
        keywords: scheduleData.keywords,
      } as GetSchedulesResponse;

      const mockData = [scheduleData];
      const expectedData = [expectedResponse];

      supabaseClient.from.mockReturnValueOnce(supabaseClient);
      supabaseClient.select.mockReturnValueOnce(supabaseClient);
      supabaseClient.eq.mockReturnValueOnce(supabaseClient);
      supabaseClient.order.mockReturnValueOnce({ data: mockData });

      const result = await service.getSchedules(user_id);

      expect(supabaseClient.from).toHaveBeenCalledWith('scheduled_tasks');
      expect(supabaseClient.select).toHaveBeenCalledWith('*');
      expect(supabaseClient.eq).toHaveBeenCalledWith('user_id', user_id);
      expect(supabaseClient.order).toHaveBeenCalledWith('id', { ascending: true });
      expect(result).toEqual(expectedData);
    });

    it('should throw an error if getting schedules fails', async () => {
      const user_id = 'user123';

      supabaseClient.from.mockReturnValueOnce(supabaseClient);
      supabaseClient.select.mockReturnValueOnce(supabaseClient);
      supabaseClient.eq.mockReturnValueOnce(supabaseClient);
      supabaseClient.order.mockReturnValueOnce({ data: null, error: { message: 'Select error' } });

      await expect(service.getSchedules(user_id)).rejects.toThrow('Failed to get schedules: Select error');
    });
  });

  describe('updateKeywords', () => {
    it('should update keywords successfully', async () => {
      const id = 'schedule123';
      const keywords = ['keyword1', 'keyword2'];
  
      const currentData = {
        keywords: ['keyword1', 'keyword3'],
        keyword_results: [
          { keyword: 'keyword1', result: 'result1' },
          { keyword: 'keyword3', result: 'result3' },
        ],
      };
  
      // Mock the response for select
      supabaseClient.eq.mockResolvedValueOnce({
        data: [currentData],
        error: null,
      });
  
      // Mock the response for update
      supabaseClient.eq.mockResolvedValueOnce({
        data: { id, keywords, keyword_results: [{ keyword: 'keyword1', result: 'result1' }] },
        error: null,
      });
  
      await service.updateKeywords(id, keywords);
  
      expect(supabaseClient.from).toHaveBeenCalledWith('scheduled_tasks');
      expect(supabaseClient.select).toHaveBeenCalledWith('keywords, keyword_results');
      expect(supabaseClient.eq).toHaveBeenCalledWith('id', id);
      expect(supabaseClient.update).toHaveBeenCalledWith({
        keywords,
        keyword_results: [{ keyword: 'keyword1', result: 'result1' }],
      });
    });

    it('should throw an error if getting current keywords fails', async () => {
      const id = 'schedule123';
      const keywords = ['keyword1', 'keyword2'];
  
      supabaseClient.eq.mockResolvedValueOnce({
        data: null,
        error: { message: 'Select error' },
      });
  
      await expect(service.updateKeywords(id, keywords)).rejects.toThrow('Failed to update keywords: Select error');
    });

    it('should filter out removed keywords and update keyword results', async () => {
      const id = 'schedule123';
      const keywords = ['keyword1', 'keyword2'];
  
      const currentData = {
        keywords: ['keyword1', 'keyword3'],
        keyword_results: [
          { keyword: 'keyword1', result: 'result1' },
          { keyword: 'keyword3', result: 'result3' },
        ],
      };
  
      // Mock the response for select
      supabaseClient.eq.mockResolvedValueOnce({
        data: [currentData],
        error: null,
      });
  
      // Mock the response for update
      supabaseClient.eq.mockResolvedValueOnce({
        data: { id, keywords, keyword_results: [{ keyword: 'keyword1', result: 'result1' }] },
        error: null,
      });
  
      await service.updateKeywords(id, keywords);
  
      expect(supabaseClient.from).toHaveBeenCalledWith('scheduled_tasks');
      expect(supabaseClient.select).toHaveBeenCalledWith('keywords, keyword_results');
      expect(supabaseClient.eq).toHaveBeenCalledWith('id', id);
      expect(supabaseClient.update).toHaveBeenCalledWith({
        keywords,
        keyword_results: [{ keyword: 'keyword1', result: 'result1' }],
      });
    });

    it('should set keyword_results to an empty array if there are not current key words', async () => {
      const id = 'schedule123';
      const keywords = ['keyword1', 'keyword2'];
  
      const currentData = {
        keywords: [],
        keyword_results: [],
      };
  
      // Mock the response for select
      supabaseClient.eq.mockResolvedValueOnce({
        data: [currentData],
        error: null,
      });
  
      // Mock the response for update
      supabaseClient.eq.mockResolvedValueOnce({
        data: { id, keywords, keyword_results: [] },
        error: null,
      });
  
      await service.updateKeywords(id, keywords);
  
      expect(supabaseClient.from).toHaveBeenCalledWith('scheduled_tasks');
      expect(supabaseClient.select).toHaveBeenCalledWith('keywords, keyword_results');
      expect(supabaseClient.eq).toHaveBeenCalledWith('id', id);
      expect(supabaseClient.update).toHaveBeenCalledWith({
        keywords,
        keyword_results: [],
      });
    });

    it('should throw an error if updating keywords fails', async () => {
      const id = 'schedule123';
      const keywords = ['keyword1', 'keyword2'];
  
      const currentData = {
        keywords: ['keyword1', 'keyword3'],
        keyword_results: [
          { keyword: 'keyword1', result: 'result1' },
          { keyword: 'keyword3', result: 'result3' },
        ],
      };
  
      // Mock the response for select
      supabaseClient.eq.mockResolvedValueOnce({
        data: [currentData],
        error: null,
      });
  
      // Mock the response for update
      supabaseClient.eq.mockResolvedValueOnce({
        data: null,
        error: { message: 'Update error' },
      });
  
      await expect(service.updateKeywords(id, keywords)).rejects.toThrow('Failed to update keywords: Update error');
    });
  });

  describe('deleteSchedule', () => {
    it('should delete a schedule successfully', async () => {
      const id = 'schedule123';
  
      supabaseClient.eq.mockResolvedValueOnce({
        data: { id },
        error: null,
      });
  
      await service.deleteSchedule(id);
  
      expect(supabaseClient.from).toHaveBeenCalledWith('scheduled_tasks');
      expect(supabaseClient.delete).toHaveBeenCalledWith();
      expect(supabaseClient.eq).toHaveBeenCalledWith('id', id);
    });

    it('should throw an error if deleting schedule fails', async () => {
      const id = 'schedule123';
  
      supabaseClient.eq.mockResolvedValueOnce({
        data: null,
        error: { message: 'Delete error' },
      });
  
      await expect(service.deleteSchedule(id)).rejects.toThrow('Failed to delete schedule: Delete error');
    });
  });
});
