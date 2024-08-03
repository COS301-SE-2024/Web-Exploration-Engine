import { Injectable } from '@nestjs/common';
import { RobotsResponse } from '../models/ServiceModels';
import * as puppeteer from 'puppeteer';

@Injectable()
export class ScrapeContactInfoService {
  /**
   * Scrapes contact information from the given URL.
   * @param url - The URL to scrape contact information from.
   * @param robots - Response object indicating if URL is scrapable.
   * @returns {Promise<{ emails: string[], phones: string[] , socialLinks:string[]}>} 
   */

  async scrapeContactInfo(url: string, robots: RobotsResponse, browser: puppeteer.Browser): Promise<{ emails: string[], phones: string[], socialLinks: string[] } > {
    let page;

    try {
      if (!robots.isUrlScrapable) {
        console.error('Crawling not allowed for this URL');
        return { emails: [], phones: [], socialLinks: [] };
      }
      
      page = await browser.newPage();
      await page.goto(url);

      // Extract text content from the page
      const textContent = await page.evaluate(() => document.body.innerText);
      const links = await page.evaluate(() => Array.from(document.querySelectorAll('a'), a => a.href));

      const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const phonePattern = /(?:\+\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?\d{2,4}[-.\s]?\d{3,4}[-.\s]?\d{3,4}\b/g;

      const emails = textContent.match(emailPattern) || [];
      const phones = textContent.match(phonePattern) || [];
      const socialLinks = links.filter(link => /facebook|twitter|linkedin|instagram/.test(link.toLowerCase()));

      return { emails, phones, socialLinks };
    } catch (error) {
      console.error(`Failed to scrape contact info: ${error.message}`);
      return { emails: [], phones: [], socialLinks: [] };
    } finally {
      if (page) {
        await page.close();
      }
    }
  }
}