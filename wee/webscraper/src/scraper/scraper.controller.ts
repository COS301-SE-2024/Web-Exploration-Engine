import { Controller, Get, Query } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { HttpService } from './http/http.service';
import { HtmlParserService } from './html-parser/html-parser.service';
import { DataExtractorService } from './data-extractor/data-extractor.service';

@Controller('scraper')
export class ScraperController {
  constructor(
    private readonly scraperService: ScraperService,
    private readonly httpService: HttpService,
    private readonly htmlParserService: HtmlParserService,
    private readonly dataExtractorService: DataExtractorService
  ) {}

  @Get()
  async scrape(@Query('url') url: string) {
    return this.scraperService.scrape(url);
  }

  @Get('fetch')
  async fetch(@Query('url') url: string) {
    return this.httpService.fetch(url);
  }

  @Get('parse')
  async parse(@Query('html') html: string) {
    return this.htmlParserService.parse(html);
  }

  @Get('extract')
  async extract(@Query('html') html: string) {
    const $ = this.htmlParserService.parse(html);
    return this.dataExtractorService.extract($);
  }
}
