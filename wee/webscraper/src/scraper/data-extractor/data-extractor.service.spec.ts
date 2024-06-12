import { Test, TestingModule } from '@nestjs/testing';
import { DataExtractorService } from './data-extractor.service';

describe('DataExtractorService', () => {
  let service: DataExtractorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataExtractorService],
    }).compile();

    service = module.get<DataExtractorService>(DataExtractorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
