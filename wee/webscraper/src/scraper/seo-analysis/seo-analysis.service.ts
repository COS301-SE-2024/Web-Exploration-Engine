import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';

@Injectable()
export class SeoAnalysisService {
  async analyzeTitleTag(htmlContent: string) {
    const $ = cheerio.load(htmlContent);
    const titleTag = $('title').text();
    const length = titleTag.length;
    const isOptimized = length >= 50 && length <= 60;
    const recommendations = isOptimized ? '' : 'Title tag length should be between 50 and 60 characters.';

    return {
      titleTag,
      length,
      isOptimized,
      recommendations,
    };
  }
}
