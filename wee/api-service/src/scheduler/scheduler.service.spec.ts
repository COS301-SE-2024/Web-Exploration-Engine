import { Test, TestingModule } from '@nestjs/testing';
import { SchedulerService } from './scheduler.service';
import { SupabaseService } from '../supabase/supabase.service';
import { PubSubService } from '../pub-sub/pub_sub.service';
import { ScheduleResult, ScheduleTaskResponse, UpdateScheduleTask} from '../models/scheduleTaskModels';
import { ScrapeResult } from '../models/scraperModels';
import { EmailService } from '../email-service/email.service';
import axios from 'axios';
import * as cron from 'node-cron';

// mocks
import { emptyResultHistory, schedules, scheduleWithKeyword } from '../mocks/scheduleMocks';

jest.mock('axios');


describe('SchedulerService', () => {
  let service: SchedulerService;
  let supabaseService: SupabaseService;
  let pubsubService: PubSubService;
  let emailService: EmailService;

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
            getEmailByScheduleId: jest.fn(),  
          },
        },
        {
          provide: PubSubService,
          useValue: {
            publishMessage: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SchedulerService>(SchedulerService);
    supabaseService = module.get<SupabaseService>(SupabaseService);
    pubsubService = module.get<PubSubService>(PubSubService);
    emailService=module.get<EmailService>(EmailService);
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

    it('should handle multiple due schedules', async () => {
      service.isRunning = false;
      jest.spyOn(supabaseService, 'getDueSchedules').mockResolvedValue(schedules);
      jest.spyOn(pubsubService, 'publishMessage').mockResolvedValue(undefined);
      const updateSpy = jest.spyOn(supabaseService, 'updateSchedule').mockResolvedValue(undefined);
      (axios.get as jest.Mock).mockResolvedValue({ data: { status: 'completed', result: 'result' } });

      await service.checkSchedules();

      expect(pubsubService.publishMessage).toHaveBeenCalledTimes(2);
      expect(updateSpy).toHaveBeenCalledTimes(2); 
    });

    it('should publish message for each keyword in a schedule', async () => {
      service.isRunning = false;
      jest.spyOn(supabaseService, 'getDueSchedules').mockResolvedValue(scheduleWithKeyword);
      jest.spyOn(pubsubService, 'publishMessage').mockResolvedValue(undefined);
      const updateScrapeSpy = jest.spyOn(supabaseService, 'updateSchedule').mockResolvedValue(undefined);
      const updateKeywordSpy = jest.spyOn(supabaseService, 'updateKeywordResult').mockResolvedValue(undefined);
      // mock keyword scrape result
      (axios.get as jest.Mock).mockResolvedValueOnce({ data: { status: 'completed', result: { keyword: 'keyword' } } });

      //mock scrape result
      (axios.get as jest.Mock).mockResolvedValueOnce({ data: { status: 'completed', result: 'result' } } );

      await service.checkSchedules();

      expect(pubsubService.publishMessage).toHaveBeenCalledTimes(2);
      expect(updateScrapeSpy).toHaveBeenCalledTimes(1);
      expect(updateKeywordSpy).toHaveBeenCalledTimes(1);
    });


    // it('should log an error if there are no due schedules', async () => {
    //   service.isRunning = false;
    //   jest.spyOn(supabaseService, 'getDueSchedules').mockResolvedValue([]);
    //   const consoleSpy = jest.spyOn(console, 'log').mockImplementation(); // Mock console.log

    //   await service.checkSchedules();

    //   expect(consoleSpy).toHaveBeenCalledWith('No due schedules found');
    //   consoleSpy.mockRestore(); // Restore the original console.log
    // });

    it('should not throw error if getDueSchedules fails', async () => {
      service.isRunning = false;
      jest.spyOn(supabaseService, 'getDueSchedules').mockRejectedValue(new Error('Failed to get schedules'));
      await expect(service.checkSchedules()).resolves.not.toThrow();
      expect(service.isRunning).toBe(false);
    });

    it('should process due schedules', async () => {
      service.isRunning = false;
      jest.spyOn(supabaseService, 'getDueSchedules').mockResolvedValue([schedules[0]]);
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
        result_history: emptyResultHistory,
        newAccessibilityScore: 0,
        newBestPracticesScore: 0,
        newCommentCount: 0,
        newNPS: 0,
        newNewsSentiment: undefined,
        newNumReviews: 0,
        newPerformanceScore: 0,
        newPinCount: 0,
        newRating: 0,
        newReactionCount: 0,
        newRecommendationStatus: '',
        newShareCount: 0,
        newSiteSpeed: 0,
        newStarRatings: {},
        newTotalEngagement: 0,
        newTrustIndex: 0,
      } as UpdateScheduleTask);
      // expect(emailService.sendMail).toHaveBeenCalledWith({
      //   to: 'user1@example.com',
      //   subject: 'Your scrape result for http://example.com',
      //   text: 'The scraping task for http://example.com has been completed. The results are ready.',
      // });
    }, 80000);

    it('should handle errors during execution', async () => {
      service.isRunning = false;
      jest.spyOn(supabaseService, 'getDueSchedules').mockRejectedValue(new Error('Failed to get schedules'));
      await expect(service.checkSchedules()).resolves.not.toThrow();
      expect(service.isRunning).toBe(false);
    });
  });

  describe('pollForResults', () => {
    it('should poll the API endpoint until results are received or max retries are reached', async () => {
      const mockEndPoint = 'http://api.com/1';

      const handleApiResultsSpy = jest.spyOn(service, 'handleApiResults');

      const mockResponse = { data: { status: 'completed', result: 'result' } };
      (axios.get as jest.Mock).mockResolvedValue(mockResponse);

      await service.pollForResults(mockEndPoint, schedules[0]);

      expect(axios.get).toHaveBeenCalled();
      expect(handleApiResultsSpy).toHaveBeenCalledWith('result', schedules[0]);
    }, 30000);

    it('should retry polling on failure', async () => {
    
      const mockEndPoint = 'http://api.com/1';
      const maxRetries = 20; // Set a specific number of retries to control test duration
      
      const delaySpy = jest.spyOn(service, 'delay').mockImplementation(() => Promise.resolve()); // Mock delay to speed up the test
    
      // Mock axios.get to always throw an error to simulate failure
      (axios.get as jest.Mock).mockRejectedValue(new Error('API error'));
    
      // Call the pollForResults method
      await service.pollForResults(mockEndPoint, schedules[0]);
    
      // Verify that axios.get was called the expected number of times (maxRetries * endpoints)
      expect(axios.get).toHaveBeenCalledTimes(maxRetries);
      expect(delaySpy).toHaveBeenCalledTimes(maxRetries);
    }, 10000);
  });


  describe('handleScrapeResults', () => {
    it('should update schedule with the new results', async () => {
      const results: ScrapeResult = {
        url: '',
        domainStatus: '',
        robots: undefined,
        scrapeNews: undefined,
        shareCountdata: undefined,
        time: 0,
        reviews: undefined
      };
      const updateSpy = jest.spyOn(supabaseService, 'updateSchedule').mockResolvedValue(undefined);

      await service.handleScrapeResults(results, schedules[0]);

      expect(updateSpy).toHaveBeenCalledWith({
        id: '1',
        result_history: expect.any(Object),
        newAccessibilityScore: 0,
        newBestPracticesScore: 0,
        newCommentCount: 0,
        newNPS: 0,
        newNewsSentiment: undefined,
        newNumReviews: 0,
        newPerformanceScore: 0,
        newPinCount: 0,
        newRating: 0,
        newReactionCount: 0,
        newRecommendationStatus: '',
        newShareCount: 0,
        newSiteSpeed: 0,
        newStarRatings: {},
        newTotalEngagement: 0,
        newTrustIndex: 0,
      } as UpdateScheduleTask);
    });

    it('should update schedule with the new results and send an email', async () => {
      const results: ScrapeResult = {
        url: '',
        domainStatus: '',
        robots: undefined,
        scrapeNews: undefined,
        shareCountdata: undefined,
        time: 0,
        reviews: undefined
      };
      // mock email of user
      jest.spyOn(supabaseService, 'getEmailByScheduleId').mockResolvedValue('example@gmail.com');
      const updateSpy = jest.spyOn(supabaseService, 'updateSchedule').mockResolvedValue(undefined);
      const emailSpy = jest.spyOn(emailService, 'sendMail').mockResolvedValue(undefined);

      await service.handleScrapeResults(results, schedules[0]);

      expect(updateSpy).toHaveBeenCalledWith({
        id: '1',
        result_history: expect.any(Object),
        newAccessibilityScore: 0,
        newBestPracticesScore: 0,
        newCommentCount: 0,
        newNPS: 0,
        newNewsSentiment: undefined,
        newNumReviews: 0,
        newPerformanceScore: 0,
        newPinCount: 0,
        newRating: 0,
        newReactionCount: 0,
        newRecommendationStatus: '',
        newShareCount: 0,
        newSiteSpeed: 0,
        newStarRatings: {},
        newTotalEngagement: 0,
        newTrustIndex: 0,
      } as UpdateScheduleTask);
      expect(emailSpy).toHaveBeenCalled();
    });

    it('should not send an email if user email is not found', async () => {
      const results: ScrapeResult = {
        url: '',
        domainStatus: '',
        robots: undefined,
        scrapeNews: undefined,
        shareCountdata: undefined,
        time: 0,
        reviews: undefined
      };
      jest.spyOn(supabaseService, 'getEmailByScheduleId').mockResolvedValue(undefined);
      const updateSpy = jest.spyOn(supabaseService, 'updateSchedule').mockResolvedValue(undefined);
      const emailSpy = jest.spyOn(emailService, 'sendMail').mockResolvedValue(undefined);

      await service.handleScrapeResults(results, schedules[0]);

      expect(updateSpy).toHaveBeenCalled();
      expect(emailSpy).not.toHaveBeenCalled();
    });

    it ('should update the next scrape time for the schedule', async () => {
      const results: ScrapeResult = {
        url: '',
        domainStatus: '',
        robots: undefined,
        scrapeNews: undefined,
        shareCountdata: undefined,
        time: 0,
        reviews: undefined
      };
      jest.spyOn(supabaseService, 'getEmailByScheduleId').mockResolvedValue('example@gmail.com');
      const updateSpy = jest.spyOn(supabaseService, 'updateSchedule').mockResolvedValue(undefined);
      const emailSpy = jest.spyOn(emailService, 'sendMail').mockResolvedValue(undefined);
      const nextScrapeSpy = jest.spyOn(supabaseService, 'updateNextScrapeTime').mockResolvedValue(undefined);

      await service.handleScrapeResults(results, schedules[0]);

      expect(nextScrapeSpy).toHaveBeenCalledWith(schedules[0]);
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
      const updateSpy = jest.spyOn(supabaseService, 'updateKeywordResult').mockResolvedValue(undefined);

      await service.handleKeywordResults(results, schedules[0]);
      const schedule = schedules[0];

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
      expect(end - start).toBeGreaterThanOrEqual(90);
    });
  });
  
});
