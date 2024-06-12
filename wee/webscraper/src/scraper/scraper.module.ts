// src/scraper/scraper.module.ts
import { Module } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { ScraperController } from './scraper.controller';
import { HttpService } from './http/http.service';
import { HtmlParserService } from './html-parser/html-parser.service';
import { DataExtractorService } from './data-extractor/data-extractor.service';

@Module({
  controllers: [ScraperController],
  providers: [ScraperService, HttpService, HtmlParserService, DataExtractorService],
})
export class ScraperModule {}
