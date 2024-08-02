import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { RobotsResponse } from '../models/ServiceModels';
import logger from '../../../services/webscraperlogger';

const serviceName = "[ScrapeContactInfoService]";

@Injectable()
export class ScrapeContactInfoService {
  /**
   * Scrapes contact information from the given URL.
   * @param url - The URL to scrape contact information from.
   * @param robots - Response object indicating if URL is scrapable.
   * @returns {Promise<{ emails: string[], phones: string[] ,socialLinks:string[]}>} 
   */
  async scrapeContactInfo(url: string, robots: RobotsResponse): Promise<{ emails: string[], phones: string[], socialLinks: string[] }> {
    logger.debug(`${serviceName}`);
    try {
      if (!robots.isUrlScrapable) {
        logger.warn(`${serviceName} Crawling not allowed for this URL`);
        console.error('Crawling not allowed for this URL');
        return { emails: [], phones: [], socialLinks: [] };
      }

      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url);

      // Extract text content from the page
      const textContent = await page.evaluate(() => document.body.innerText);
      const links = await page.evaluate(() => Array.from(document.querySelectorAll('a'), a => a.href));

      const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const phonePattern = /(?:\+\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?\d{2,4}[-.\s]?\d{3,4}[-.\s]?\d{3,4}\b/g;

      const emails = textContent.match(emailPattern) || [];
      const phones = textContent.match(phonePattern) || [];
      const socialLinks = links.filter(link => /facebook|twitter|linkedin|instagram/.test(link.toLowerCase()));

      await browser.close();

      return { emails, phones, socialLinks };
    } catch (error) {
      console.error(`${serviceName} Failed to scrape contact info: ${error.message}`);
      console.error(`Failed to scrape contact info: ${error.message}`);
      return { emails: [], phones: [], socialLinks: [] };
    }
  }
}