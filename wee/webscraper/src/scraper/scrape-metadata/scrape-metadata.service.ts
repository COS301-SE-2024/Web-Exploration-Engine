import { Injectable } from '@nestjs/common';
import { Metadata, RobotsResponse, ErrorResponse } from '../models/ServiceModels';
import puppeteer from 'puppeteer';

@Injectable()
export class ScrapeMetadataService {
  async scrapeMetadata(
    url: string, data: RobotsResponse
  ): Promise< Metadata | ErrorResponse> {

    const allowed = data.isBaseUrlAllowed;

    if (!allowed) {
      return {
        errorStatus: 403,
        errorCode: '403 Forbidden',
        errorMessage: 'Not allowed to scrape root URL for metadata',
      } as ErrorResponse;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let browser: any;

    try {
      // would Cheerio be a better option here? - is metadata always in the head?
      browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.goto(url, { waitUntil: 'domcontentloaded' });
      const metadata = await page.evaluate(() => {
        return {
          title: document.title,
          description: this.getMetaTagContent('description'),
          keywords: this.getMetaTagContent('keywords'),
          ogTitle: this.getMetaTagContent('title'),
          ogDescription: this.getMetaTagContent('description'),
          ogImage: this.getMetaTagContent('image'),
        } as Metadata;
      });

      if(!metadata) {
        return {
          title: null,
          description: null,
          keywords: null,
          ogTitle: null,
          ogDescription: null,
          ogImage: null,
        } as Metadata;
      }

      return { ...metadata };

    } catch (error) {
      return {
        errorStatus: 500,
        errorCode: '500 Internal Server Error',
        errorMessage: 'Error scraping metadata',
      } as ErrorResponse;
    } finally {
      if(browser) {
        await browser.close();
      }
    }
  }

  getMetaTagContent (name: string) {
    const element =
      document.querySelector(`meta[name='${name}']`) ||
      document.querySelector(`meta[property='og:${name}']`);
    return element ? element.getAttribute('content') : null;
  };

}
