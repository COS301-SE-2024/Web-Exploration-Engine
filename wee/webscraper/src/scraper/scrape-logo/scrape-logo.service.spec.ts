import { Test, TestingModule } from '@nestjs/testing';
import { ScrapeLogoService } from './scrape-logo.service';

describe('ScrapeLogoService', () => {
  let service: ScrapeLogoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScrapeLogoService],
    }).compile();

    service = module.get<ScrapeLogoService>(ScrapeLogoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
