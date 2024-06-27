import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { RobotsResponse } from '../models/ServiceModels';

@Injectable()
export class ScrapeAddressService {
  /**
   * Scrapes addresses from the given URL.
   * @param url - The URL to scrape addresses from.
   * @returns {Promise<{ addresses: string[] }>} 
   */
  async scrapeAddress(url: string, robots: RobotsResponse): Promise<{ addresses: string[] }> {
    try {
      if (!robots.isBaseUrlAllowed) {
        console.error('Crawling not allowed for this URL');
        return { addresses: [] };
      }

      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2' });

      const addresses = await page.evaluate(() => {
        const addressPattern = /\d{1,5}\s\w+\s\w+(\s\w+)?/g; 
        return Array.from(document.body.innerText.matchAll(addressPattern), match => match[0]);
      });

      await browser.close();

      return { addresses: addresses as string[] };
    } catch (error) {
      console.error(`Failed to scrape addresses: ${error.message}`);
      return { addresses: [] };
    }
  }
}
