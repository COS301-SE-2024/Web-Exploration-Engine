import { Injectable } from '@nestjs/common';
import { RobotsResponse } from '../models/ServiceModels';
import * as puppeteer from 'puppeteer';
import { performance } from 'perf_hooks';
import logger from '../../logging/webscraperlogger';

const serviceName = "[ScrapeAddressService]";
@Injectable()
export class ScrapeAddressService {
  /**
   * Scrapes addresses from the given URL.
   * @param url - The URL to scrape addresses from.
   * @param robots - The robots response to check if crawling is allowed.
   * @returns {Promise<{ addresses: string[] }>} 
   */
  async scrapeAddress(url: string, robots: RobotsResponse, page: puppeteer.Page): Promise<{ addresses: string[] }> {
    logger.debug(`${serviceName}`);
    const start = performance.now();

    if (!robots.isBaseUrlAllowed) {
      logger.warn(serviceName,`Crawling not allowed for this URL`,'url',url);
       return { addresses: [] };
    }

    try {
      const addresses = await page.evaluate(() => {
      const addressPattern = /\d+\s[\w\s]+(?:Ave|Avenue|Blvd|Boulevard|St|Street|Rd|Road|Dr|Drive|Lane|Way|Circle|Square|Pl|Place|Court|Crescent|Terrace|Park|Close|Mews|Row)\b(?:,?[\w\s]+){0,2}/g;
      const textContent = document.body.innerText;
      return Array.from(textContent.matchAll(addressPattern), match => match[0].trim());
      });

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

      // Performance Logging
      const duration = performance.now() - start;
      logger.info(serviceName,'duration',duration,'url',url,'service',serviceName);

      return { addresses: validAddresses };
    } catch (error) {
      logger.error(serviceName,` Failed to scrape addresses `,error.message);

      // Performance Logging
      const duration = performance.now() - start;
      logger.info(serviceName,'duration',duration,'url',url,'service',serviceName);
       return { addresses: [] };
    } 
  }
}
