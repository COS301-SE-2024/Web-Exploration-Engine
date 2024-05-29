import { Test, TestingModule } from '@nestjs/testing';
import { ScrapingController } from '../industry-classification-app/industry.controller';
import { ScrapingService } from '../industry-classification-app/industry.service';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

describe('ScrapingController', () => {
  let controller: ScrapingController;
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

  it('should return industry on successful scrape', async () => {
    const url = 'https://takealot.com';
    const result = { industry: 'E-Commerce' };
    mockScrapingService.scrapeMetadata.mockResolvedValue(result);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await controller.handleScrapeMetadata(url, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.json).toHaveBeenCalledWith(result);
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

  it('should return 500 on scrapeMetadata error', async () => {
    const url = 'https://example.com';
    mockScrapingService.scrapeMetadata.mockRejectedValue(new Error('scrape error'));

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await controller.handleScrapeMetadata(url, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error scraping metadata' });
  });

  it('should return allowed status for checkAllowed', async () => {
    const url = 'https://takealot.com';
    mockScrapingService.checkAllowed.mockResolvedValue(true);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await controller.checkAllowed(url, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.json).toHaveBeenCalledWith({ allowed: true });
  });

  it('should return 500 on checkAllowed error', async () => {
    const url = 'https://example.com';
    mockScrapingService.checkAllowed.mockRejectedValue(new Error('check allowed error'));

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await controller.checkAllowed(url, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error checking URL' });
  });
});
