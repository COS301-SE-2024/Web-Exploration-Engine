import { Test, TestingModule } from '@nestjs/testing';
import { SupabaseService } from './supabase.service';
import { createClient } from '@supabase/supabase-js';
import { ScheduleResult, UpdateScheduleTask, ScheduleTaskResponse, updateKeywordResult } from '../models/scheduleTaskModels';
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


const emptyResultHistory = {
  commentCount: [],
  shareCount: [],
  reactionCount: [],
  totalEngagement: [],
  pinCount: [],
  rating: [],
  numReviews: [],
  trustIndex: [],
  newsSentiment: {
    positiveAvg: [],
    negativeAvg: [],
    neutralAvg: [],
  },
  NPS: [],
  recommendationStatus: [],
  starRatings: [],
  siteSpeed: [],
  performanceScore: [],
  accessibilityScore: [],
  bestPracticesScore: [],
} as ScheduleResult;

const mockResultHistory = {
  commentCount: [1],
  shareCount: [2],
  reactionCount: [3],
  totalEngagement: [6],
  pinCount: [5],
  rating: [4],
  numReviews: [100],
  trustIndex: [80],
  NPS: [90],
  recommendationStatus: ['Good'],
  starRatings: [[
    { stars: 1, numReviews: 10 },
    { stars: 2, numReviews: 20 },
    { stars: 3, numReviews: 30 },
    { stars: 4, numReviews: 40 },
    { stars: 5, numReviews: 50 },
  ],
  [
    { stars: 1, numReviews: 10 },
    { stars: 2, numReviews: 20 },
    { stars: 3, numReviews: 30 },
    { stars: 4, numReviews: 40 },
    { stars: 5, numReviews: 50 },
  ]],
  newsSentiment: {
    positiveAvg: [1],
    negativeAvg: [2],
    neutralAvg: [3],
  },
  siteSpeed: [100],
  performanceScore: [90],
  accessibilityScore: [80],
  bestPracticesScore: [70],
} as ScheduleResult;



describe('SupabaseService', () => {
  let service: SupabaseService;
  let supabaseClient: any;
  const mockDate = new Date(); // Mock date

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupabaseService],
    }).compile();

    service = module.get<SupabaseService>(SupabaseService);
    supabaseClient = createClient('', 'key');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should use the mocked Date', () => {
    const now = new Date(); // Should return fixedDate
    expect(now).toEqual(mockDate);

    // Calculate the expected next scrape time
    const expectedNextScrape = new Date(mockDate.getTime());
    expectedNextScrape.setDate(mockDate.getDate() + 1);
    expect(service.calculateNextScrapeTime('daily')).toBe(expectedNextScrape.toISOString());
  });

  describe('updateSchedule', () => {
  
    it('should update a schedule successfully', async () => {
      // Define the mock time in UTC
      
      const timestamp = new Date();
      const updateData = {
        id: 'schedule123',
        result_history: mockResultHistory,
        newCommentCount: 10,
        newShareCount: 20,
        newReactionCount: 30,
        newTotalEngagement: 60,
        newPinCount: 5,
        newNewsSentiment: [
          {
            title: 'News title',
            link: 'https://example.com',
            source: 'News source',
            pubDate: timestamp.toISOString(),
            sentimentScores: {
              positive: 1,
              negative: 2,
              neutral: 3,
            },
          },
        ],
        newRating: 4,
        newNumReviews: 100,
        newTrustIndex: 80,
        newNPS: 90,
        newRecommendationStatus: 'Good',
        newStarRatings: [
          { stars: 1, numReviews: 1 },
          { stars: 2, numReviews: 2 },
          { stars: 3, numReviews: 3 },
          { stars: 4, numReviews: 4 },
          { stars: 5, numReviews: 5 },
        ],
        newSiteSpeed: 100,
        newPerformanceScore: 90,
        newAccessibilityScore: 80,
        newBestPracticesScore: 70,
      } as UpdateScheduleTask;
    
      // Mock the Supabase client methods
      supabaseClient.from.mockReturnThis();
      supabaseClient.update.mockReturnThis();
      supabaseClient.eq.mockResolvedValueOnce({ data: mockResultHistory, error: null });
    
      const result = await service.updateSchedule(updateData);
    
      // Assertions
      expect(supabaseClient.from).toHaveBeenCalledWith('scheduled_tasks');
      expect(supabaseClient.update).toHaveBeenCalledWith({
        result_history: updateData.result_history,
        updated_at: timestamp.toISOString(),
      });
      expect(supabaseClient.eq).toHaveBeenCalledWith('id', updateData.id);

      // Check the updated result history
      expect(result).toEqual({
        commentCount: [1, 10],
        shareCount: [2, 20],
        reactionCount: [3, 30],
        totalEngagement: [6, 60],
        pinCount: [5, 5],
        rating: [4, 4],
        numReviews: [100, 100],
        trustIndex: [80, 80],
        NPS: [90, 90],
        recommendationStatus: ['Good', 'Good'],
        starRatings: [
          [
            { stars: 1, numReviews: 10 },
            { stars: 2, numReviews: 20 },
            { stars: 3, numReviews: 30 },
            { stars: 4, numReviews: 40 },
            { stars: 5, numReviews: 50 },
          ],
          [
            { stars: 1, numReviews: 10 },
            { stars: 2, numReviews: 20 },
            { stars: 3, numReviews: 30 },
            { stars: 4, numReviews: 40 },
            { stars: 5, numReviews: 50 },
          ],
          [
            { stars: 1, numReviews: 1 },
            { stars: 2, numReviews: 2 },
            { stars: 3, numReviews: 3 },
            { stars: 4, numReviews: 4 },
            { stars: 5, numReviews: 5 },
          ],
        ],
        newsSentiment: {
          positiveAvg: [1, 1],
          negativeAvg: [2, 2],
          neutralAvg: [3, 3],
        },
        siteSpeed: [100, 100],
        performanceScore: [90, 90],
        accessibilityScore: [80, 80],
        bestPracticesScore: [70, 70],
      });
    
      // Restore the original DateTime.now() method after the test
      jest.restoreAllMocks();
    });
    

    it('should throw an error if schedule update fails', async () => {
      const updateData: UpdateScheduleTask = {
        id: 'schedule123',
        result_history: emptyResultHistory,
        newCommentCount: 10,
        newShareCount: 20,
        newReactionCount: 30,
        newTotalEngagement: 60,
        newPinCount: 5,
        newNewsSentiment: [
          {
            title: 'News title',
            link: 'https://example.com',
            source: 'News source',
            pubDate: new Date().toISOString(),
            sentimentScores: {
              positive: 1,
              negative: 2,
              neutral: 3,
            },
          },
        ],
        newRating: 4,
        newNumReviews: 100,
        newTrustIndex: 80,
        newNPS: 90,
        newRecommendationStatus: 'Good',
        newStarRatings: [
          { stars: 1, numReviews: 1 },
          { stars: 2, numReviews: 2 },
          { stars: 3, numReviews: 3 },
          { stars: 4, numReviews: 4 },
          { stars: 5, numReviews: 5 },
        ],  
        newSiteSpeed: 100,
        newPerformanceScore: 90,
        newAccessibilityScore: 80,
        newBestPracticesScore: 70,
      }
      supabaseClient.eq.mockResolvedValue({ data: null, error: {message: 'Update error'} });

      await expect(service.updateSchedule(updateData)).rejects.toThrow('Failed to update schedule: Update error');
    });
  });

  describe('getDueSchedules', () => {
    it('should return due schedules successfully', async () => {
      const timestamp = new Date();
      const dueSchedules: ScheduleTaskResponse[] = [
        { 
          id: 'schedule123', 
          user_id: 'user123',
          url: 'https://example.com', 
          frequency: 'daily',
          next_scrape: timestamp.toISOString(),
          updated_at: timestamp.toISOString(),
          created_at: timestamp.toISOString(),
          result_history: emptyResultHistory,
          keywords: [],
          keyword_results: [],
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

  describe('updateNextScrapeTime', () => {
    it('should update the next scrape time successfully', async () => {
      const schedule: ScheduleTaskResponse = {
        id: 'schedule123',
        user_id: 'user123',
        url: 'https://example.com',
        frequency: 'daily',
        created_at: '2024-08-24T00:00:00.000Z',
        updated_at: '2024-08-24T00:00:00.000Z',
        next_scrape: '2024-08-24T00:00:00.000Z',
        result_history: emptyResultHistory,
        keywords: [],
        keyword_results: [],
      };

      const nextScrapeTime = '2024-08-25T00:00:00.000Z';
      jest.spyOn(service, 'calculateNextScrapeTime').mockReturnValue(nextScrapeTime);
      supabaseClient.update.mockReturnThis();
      supabaseClient.eq.mockResolvedValueOnce({ data: [schedule], error: null });

      await service.updateNextScrapeTime(schedule);

      expect(service.calculateNextScrapeTime).toHaveBeenCalledWith('daily');
      expect(supabaseClient.from).toHaveBeenCalledWith('scheduled_tasks');
      expect(supabaseClient.update).toHaveBeenCalledWith({ next_scrape: nextScrapeTime });
      expect(supabaseClient.eq).toHaveBeenCalledWith('id', 'schedule123');
    });

    it('should throw an error if calculating next scrape time fails', async () => {
      const schedule: ScheduleTaskResponse = {
        id: 'schedule123',
        user_id: 'user123',
        url: 'https://example.com',
        frequency: 'daily',
        created_at: '2024-08-24T00:00:00.000Z',
        updated_at: '2024-08-24T00:00:00.000Z',
        next_scrape: '2024-08-24T00:00:00.000Z',
        result_history: emptyResultHistory,
        keywords: [],
        keyword_results: [],
      };

      jest.spyOn(service, 'calculateNextScrapeTime').mockImplementation(() => {
        throw new Error('Calculation error');
      });

      await expect(service.updateNextScrapeTime(schedule)).rejects.toThrow('Failed to calculate next scrape time: Calculation error');
    });

    it('should throw an error if updating next scrape time fails', async () => {
      const schedule: ScheduleTaskResponse = {
        id: 'schedule123',
        user_id: 'user123',
        url: 'https://example.com',
        frequency: 'daily',
        created_at: '2024-08-24T00:00:00.000Z',
        updated_at: '2024-08-24T00:00:00.000Z',
        next_scrape: '2024-08-24T00:00:00.000Z',
        result_history: emptyResultHistory,
        keywords: [],
        keyword_results: [],
      };

      const nextScrapeTime = '2024-08-25T00:00:00.000Z';
      jest.spyOn(service, 'calculateNextScrapeTime').mockReturnValue(nextScrapeTime);
      supabaseClient.update.mockReturnThis();
      supabaseClient.eq.mockResolvedValueOnce({ data: null, error: { message: 'Update error' } });

      await expect(service.updateNextScrapeTime(schedule)).rejects.toThrow('Failed to update next scrape time: Update error');
    });
  });

  describe('calculateNextScrapeTime', () => {
    it('should return the correct date for daily frequency', () => {
      const expectedNextScrape = new Date(mockDate.getTime());
      expectedNextScrape.setDate(mockDate.getDate() + 1);
      expect(service.calculateNextScrapeTime('daily')).toBe(expectedNextScrape.toISOString());
    });

    it('should return the correct date for weekly frequency', () => {
      const expectedNextScrape = new Date(mockDate.getTime());
      expectedNextScrape.setDate(mockDate.getDate() + 7);
      expect(service.calculateNextScrapeTime('weekly')).toBe(expectedNextScrape.toISOString());
    });

    it('should return the correct date for bi-weekly frequency', () => {
      const expectedNextScrape = new Date(mockDate.getTime());
      expectedNextScrape.setDate(mockDate.getDate() + 14);
      expect(service.calculateNextScrapeTime('bi-weekly')).toBe(expectedNextScrape.toISOString());
    });

    it('should return the correct date for monthly frequency', () => {
      const expectedNextScrape = new Date(mockDate.getTime());
      expectedNextScrape.setDate(mockDate.getMonth() + 1);
      expect(service.calculateNextScrapeTime('monthly')).toBe(expectedNextScrape.toISOString());
    });

    it('should throw an error for invalid frequency', () => {
      expect(() => service.calculateNextScrapeTime('invalid')).toThrow('Invalid frequency');
    });
  });

  describe('updateKewordResult', () => {
    it('should update keyword result successfully when keyword exists', async () => {
      const scheduleData = {
        id: 'schedule123',
        keyword: 'keyword1',
        newRank: '1',
        newTopTen: ['example.com', 'example2.com'],
        results: [
          {
            keyword: 'keyword1',
            timestampArr: ['2024-08-24T00:00:00.000Z'],
            rankArr: ['2'],
            topTenArr: [['example.com']],
          },
        ],
      } as updateKeywordResult;

      const expectedResults = [
        {
          keyword: 'keyword1',
          timestampArr: ['2024-08-24T00:00:00.000Z', mockDate.toISOString()],
          rankArr: ['2', '1'],
          topTenArr: [['example.com'], ['example.com', 'example2.com']],
        },
      ];

      supabaseClient.eq.mockResolvedValueOnce({ data: expectedResults, error: null });

      const result = await service.updateKeywordResult(scheduleData);

      expect(supabaseClient.from).toHaveBeenCalledWith('scheduled_tasks');
      expect(supabaseClient.update).toHaveBeenCalledWith({
        keyword_results: expectedResults,
      });
      expect(supabaseClient.eq).toHaveBeenCalledWith('id', 'schedule123');
      expect(result).toEqual(expectedResults);
    });

    it('should update keyword result successfully when keyword does not exist', async () => {
      const scheduleData = {
        id: 'schedule123',
        keyword: 'keyword2',
        newRank: '1',
        newTopTen: ['example.com', 'example2.com'],
        results: [
          {
            keyword: 'keyword1',
            timestampArr: ['2024-08-24T00:00:00.000Z'],
            rankArr: ['2'],
            topTenArr: [['example.com']],
          },
        ],
      } as updateKeywordResult;

      const expectedResults = [
        {
          keyword: 'keyword1',
          timestampArr: ['2024-08-24T00:00:00.000Z'],
          rankArr: ['2'],
          topTenArr: [['example.com']],
        },
        {
          keyword: 'keyword2',
          timestampArr: [mockDate.toISOString()],
          rankArr: ['1'],
          topTenArr: [['example.com', 'example2.com']],
        },
      ];

      supabaseClient.eq.mockResolvedValueOnce({ data: expectedResults, error: null });

      const result = await service.updateKeywordResult(scheduleData);

      expect(supabaseClient.from).toHaveBeenCalledWith('scheduled_tasks');
      expect(supabaseClient.update).toHaveBeenCalledWith({
        keyword_results: expectedResults,
      });
      expect(supabaseClient.eq).toHaveBeenCalledWith('id', 'schedule123');
      expect(result).toEqual(expectedResults);
    });

    it('should throw an error if updating keyword result fails', async () => {
      const scheduleData = {
        id: 'schedule123',
        keyword: 'keyword1',
        newRank: '1',
        newTopTen: ['example.com', 'example2.com'],
        results: [
          {
            keyword: 'keyword1',
            timestampArr: ['2024-08-24T00:00:00.000Z'],
            rankArr: ['2'],
            topTenArr: [['example.com']],
          },
        ],
      } as updateKeywordResult;

      supabaseClient.eq.mockResolvedValueOnce({ data: null, error: { message: 'Update error' } });

      await expect(service.updateKeywordResult(scheduleData)).rejects.toThrow('Failed to update keyword result: Update error');
    });
  });

});