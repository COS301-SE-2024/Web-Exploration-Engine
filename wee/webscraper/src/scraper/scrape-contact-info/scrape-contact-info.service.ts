import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { RobotsResponse } from '../models/ServiceModels';

@Injectable()
export class ScrapeContactInfoService {
  /**
   * Scrapes contact information from the given URL.
   * @param url - The URL to scrape contact information from.
   * @param robots - Response object indicating if URL is scrapable.
   * @returns {Promise<{ emails: string[], phones: string[] }>} - Returns a promise that resolves to an object containing arrays of email addresses and phone numbers found.
   */
  async scrapeContactInfo(url: string, robots: RobotsResponse): Promise<{ emails: string[], phones: string[] }> {
    try {
      if (!robots.isUrlScrapable) {
        console.error('Crawling not allowed for this URL');
        return { emails: [], phones: [] };
      }

      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url);

      // Extract text content from the page
      const textContent = await page.evaluate(() => document.body.innerText);

      // Define more specific regex patterns for emails and phones
      const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const phonePattern = /(?:\+\d{1,3}[-.\s]?)?(?:\(\d{3}\)[-.\s]?)?\d{3,}[-.\s]?\d{3,}[-.\s]?\d{4}\b/g;

      // Extract emails and phones using the defined patterns
      const emails = textContent.match(emailPattern) || [];
      const phones = textContent.match(phonePattern) || [];

      await browser.close();

      return { emails, phones };
    } catch (error) {
      console.error(`Failed to scrape contact info: ${error.message}`);
      return { emails: [], phones: [] };
    }
  }
}
