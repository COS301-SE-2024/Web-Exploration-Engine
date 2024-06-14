import { Injectable } from '@nestjs/common';
import { Metadata, RobotsResponse, ErrorResponse } from '../models/ServiceModels';
import puppeteer from 'puppeteer';
import axios from 'axios';


@Injectable()
export class ScrapeMetadataService {
  async scrapeMetadata(
    url: string, data: RobotsResponse | ErrorResponse
  ): Promise< Metadata | ErrorResponse> {

    if ("status" in data) {
      throw new Error('Error fetching robots.txt');
    }

    const allowed = data.isBaseUrlAllowed;
    if (!allowed) {
      throw new Error('URL cannot be scraped');
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      const metadata = await page.evaluate(() => {
        const getMetaTagContent = (name: string) => {
          const element =
            document.querySelector(`meta[name='${name}']`) ||
            document.querySelector(`meta[property='og:${name}']`);
          return element ? element.getAttribute('content') : null;
        };

        return {
          title: document.title,
          description: getMetaTagContent('description'),
          keywords: getMetaTagContent('keywords'),
          ogTitle: getMetaTagContent('title'),
          ogDescription: getMetaTagContent('description'),
          ogImage: getMetaTagContent('image'),
        } as Metadata;
      });

      await browser.close();

      return { ...metadata };

    } catch (error) {
      return {
        status: 500,
        code: 'INTERNAL_SERVER_ERROR',
        message: `Error scraping metadata: ${error.message}`,
      } as ErrorResponse;
    } finally {
      await browser.close();
    }
  }

}
