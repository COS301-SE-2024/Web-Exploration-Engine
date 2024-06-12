import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';

@Injectable()
export class HtmlParserService {
  parse(html: string) {
    const $ = cheerio.load(html);
    return $;
  }
}
