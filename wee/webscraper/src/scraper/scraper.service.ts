import { Injectable } from '@nestjs/common';
import { HttpService } from './http/http.service';
import { HtmlParserService } from './html-parser/html-parser.service';
import { DataExtractorService } from './data-extractor/data-extractor.service';

@Injectable()
export class ScraperService {
  constructor(
    private readonly httpService: HttpService,
    private readonly htmlParserService: HtmlParserService,
    private readonly dataExtractorService: DataExtractorService
  ) {}

  async scrape(url: string) {
    const html = await this.httpService.fetch(url);
    const $ = this.htmlParserService.parse(html);
    const data = this.dataExtractorService.extract($);
    return data;
  }
}
