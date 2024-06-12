import { Test, TestingModule } from '@nestjs/testing';
import { HtmlParserService } from './html-parser.service';

describe('HtmlParserService', () => {
  let service: HtmlParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HtmlParserService],
    }).compile();

    service = module.get<HtmlParserService>(HtmlParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
