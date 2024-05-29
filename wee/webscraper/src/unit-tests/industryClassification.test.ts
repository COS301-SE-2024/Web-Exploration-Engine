import { Test, TestingModule } from '@nestjs/testing';
import { ScrapingController } from '../industry-classification-app/industry.controller';
import { ScrapingService } from '../industry-classification-app/industry.service';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

// Test if the ScrapingController returns the correct industry on successful scrape
describe('ScrapingController', () => {
  let controller: ScrapingController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: ScrapingService;

  const mockScrapingService = {
    scrapeMetadata: jest.fn(),
    checkAllowed: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScrapingController],
      providers: [
        {
          provide: ScrapingService,
          useValue: mockScrapingService,
        },
      ],
    }).compile();

    controller = module.get<ScrapingController>(ScrapingController);
    service = module.get<ScrapingService>(ScrapingService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should throw an error for a url that cannot be scrapped', async () => {
    const Url = 'https://www.amazon.com';
    const scrapingService = new ScrapingService();


    await expect(scrapingService.scrapeMetadata(Url)).rejects.toThrowError('cannot scrape this website');
  });

  it('should throw an error for an invalid URL', async () => {
    const Url = 'https://www.example.com';
    const scrapingService = new ScrapingService();


    await expect(scrapingService.scrapeMetadata(Url)).rejects.toThrowError('An error occurred while fetching allowed paths');
  });

  it('should return {"E-Commerce"} for a valid URL', async () => {
    const Url = 'https://www.takealot.com';
    const scrapingService = new ScrapingService();

    const result = await scrapingService.scrapeMetadata(Url);
    const industry = result.industry; // Extract the value of the 'industry' key

    expect(industry).toEqual("E-commerce"); // Compare the value with the expected value
  });


  it('should return 400 if URL is not provided', async () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await controller.handleScrapeMetadata('', res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({ error: 'URL is required' });
  });



});
