import { Injectable } from '@nestjs/common';
import { CheerioAPI } from 'cheerio'; // Import the correct type

@Injectable()
export class DataExtractorService {
  extract($: CheerioAPI) { // Use CheerioAPI type
    const data = $('p').map((i, el) => $(el).text()).get();
    return data;
  }
}
