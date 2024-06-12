import { Test, TestingModule } from '@nestjs/testing';
import { ScrapeMetadataService } from './scrape-metadata.service';

describe('ScrapeMetadataService', () => {
  let service: ScrapeMetadataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScrapeMetadataService],
    }).compile();

    service = module.get<ScrapeMetadataService>(ScrapeMetadataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
