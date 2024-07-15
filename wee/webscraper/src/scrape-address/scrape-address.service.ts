import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { RobotsResponse } from '../models/ServiceModels';

@Injectable()
export class ScrapeAddressService {
  /**
   * Scrapes addresses from the given URL.
   * @param url - The URL to scrape addresses from.
   * @param robots - The robots response to check if crawling is allowed.
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
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      const addresses = await page.evaluate(() => {
      const addressPattern = /\d+\s[\w\s]+(?:Ave|Avenue|Blvd|Boulevard|St|Street|Rd|Road|Dr|Drive|Lane|Way|Circle|Square|Pl|Place|Court|Crescent|Terrace|Park|Close|Mews|Row)\b(?:,?[\w\s]+){0,2}/g;
      const textContent = document.body.innerText;
      return Array.from(textContent.matchAll(addressPattern), match => match[0].trim());
      });

      await browser.close();

      //newline removed
      const cleanAddresses = addresses.map(address => address.replace(/\n/g, ' '));

      // Blacklisted words
      const blacklist = ['Country Road'];

      const validAddresses = cleanAddresses.filter(address => {
        const minLength = 10; 
        const containsNumber = /\d/.test(address); 
        const notBlacklisted = !blacklist.some(blacklistedWord => address.includes(blacklistedWord));
        return address.length >= minLength && containsNumber && notBlacklisted;
      });

      return { addresses: validAddresses };
    } catch (error) {
      console.error(`Failed to scrape addresses: ${error.message}`);
      return { addresses: [] };
    }
  }
}
