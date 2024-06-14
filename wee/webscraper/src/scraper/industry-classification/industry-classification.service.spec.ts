import { Test, TestingModule } from '@nestjs/testing';
import { IndustryClassificationService } from './industry-classification.service';

describe('IndustryClassificationService', () => {
  let service: IndustryClassificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IndustryClassificationService],
    }).compile();

    service = module.get<IndustryClassificationService>(IndustryClassificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
