import { Test, TestingModule } from '@nestjs/testing';
import { ScrapeAddressService } from './scrape-address.service';
import { RobotsResponse } from '../models/ServiceModels';
import * as puppeteer from 'puppeteer';

jest.mock('puppeteer');
const mockedPuppeteer = puppeteer as jest.Mocked<typeof puppeteer>;

describe('ScrapeAddressService', () => {
  let service: ScrapeAddressService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [ScrapeAddressService],
    }).compile();

    service = module.get<ScrapeAddressService>(ScrapeAddressService);
  });

  it('should handle errors gracefully', async () => {
    const url = 'https://example.com';
    const robots: RobotsResponse = {
      baseUrl: 'http://example.com',
      allowedPaths: ['/'],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: true,
    };

    // Mocking puppeteer launch to simulate an error
    mockedPuppeteer.launch.mockRejectedValue(new Error('Mocked error'));

    const result = await service.scrapeAddress(url, robots);
    expect(result.addresses).toEqual([]);
  });

  it('should scrape addresses from the page', async () => {
    const url = 'https://example.com';
    const robots: RobotsResponse = {
      baseUrl: 'http://example.com',
      allowedPaths: ['/'],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: true,
    };

    const pageContent = `
      Welcome to our website.
      Address: 123 Main Street, Springfield, IL
      Visit us at 456 Elm Street, Springfield, IL
    `;
    const mockAddresses = ['123 Main Street, Springfield, IL', '456 Elm Street, Springfield, IL'];
    const browser = {
      newPage: jest.fn().mockResolvedValue({
        goto: jest.fn(),
        evaluate: jest.fn().mockResolvedValue(mockAddresses),
        close: jest.fn(),
      }),
      close: jest.fn(),
    };
    mockedPuppeteer.launch.mockResolvedValue(browser as any);

    const result = await service.scrapeAddress(url, robots);

    expect(result.addresses).toContain('123 Main Street, Springfield, IL');
    expect(result.addresses).toContain('456 Elm Street, Springfield, IL');
    expect(browser.newPage).toHaveBeenCalledTimes(1);
    expect(browser.close).toHaveBeenCalledTimes(1);
  });
});
