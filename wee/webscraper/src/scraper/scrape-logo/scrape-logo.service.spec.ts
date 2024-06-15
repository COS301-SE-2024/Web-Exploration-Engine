import { Test, TestingModule } from '@nestjs/testing';
import { ScrapeLogoService } from './scrape-logo.service';
import { Metadata, RobotsResponse } from '../models/ServiceModels';

describe('ScrapeLogoService', () => {
  let service: ScrapeLogoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScrapeLogoService],
    }).compile();

    service = module.get<ScrapeLogoService>(ScrapeLogoService);
  });

  it('should return ogImage if available in metadata', async () => {
    const url = 'https://example.com';
    const metadata: Metadata = {
      title: 'Test Title',
      description: 'Test Description',
      keywords: 'Test Keywords',
      ogTitle: 'Test OG Title',
      ogDescription: 'Test OG Description',
      ogImage: 'http://test.com/image.png',
    };
    const robots: RobotsResponse = {
      baseUrl: 'http://example.com',
      allowedPaths: [],
      disallowedPaths: [],
      isBaseUrlAllowed: true,
      isUrlScrapable: true,
    };
    const result = await service.scrapeLogo(url, metadata, robots);
    expect(result).toBe(metadata.ogImage);
  });

});

