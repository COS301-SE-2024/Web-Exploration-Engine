import { Injectable } from '@nestjs/common';
import { RobotsResponse } from '../models/ServiceModels';
import * as puppeteer from 'puppeteer';
import { performance } from 'perf_hooks';
import logger from '../../logging/webscraperlogger';
const serviceName = '[ScrapeContactInfoService]';
@Injectable()
export class ScrapeContactInfoService {
  /**
   * Scrapes contact information from the given URL.
   * @param url - The URL to scrape contact information from.
   * @param robots - Response object indicating if URL is scrapable.
   * @returns {Promise<{ emails: string[], phones: string[] , socialLinks:string[]}>}
   */

  async scrapeContactInfo(
    url: string,
    robots: RobotsResponse,
    browser: puppeteer.Browser
  ): Promise<{ emails: string[]; phones: string[]; socialLinks: string[] }> {
    logger.debug(`${serviceName}`);
    const start = performance.now();

    // Check if the URL is allowed to be scraped
    if (!robots.isUrlScrapable) {
      logger.warn(serviceName, ` Crawling not allowed for this URL`);
      console.error('Crawling not allowed for this URL');
      return { emails: [], phones: [], socialLinks: [] };
    }

    // proxy authentication
    const username = process.env.PROXY_USERNAME;
    const password = process.env.PROXY_PASSWORD;

    if (!username || !password) {
      console.error('Proxy username or password not set');
      return { emails: [], phones: [], socialLinks: [] };
    }

    let page;

    try {
      page = await browser.newPage();

      // authenticate page with proxy
      await page.authenticate({
        username,
        password,
      });

      await page.goto(url);

      // Extract text content from the page
      const textContent = await page.evaluate(() => document.body.innerText);
      const links = await page.evaluate(() =>
        Array.from(document.querySelectorAll('a'), (a) => a.href)
      );

      const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const phonePattern =
        /(?:\+\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?\d{2,4}[-.\s]?\d{3,4}[-.\s]?\d{3,4}\b/g;

      const emails = textContent.match(emailPattern) || [];
      const phones = textContent.match(phonePattern) || [];
      const socialLinks = links.filter((link) =>
        /facebook|twitter|linkedin|instagram/.test(link.toLowerCase())
      );

      return { emails, phones, socialLinks };
    } catch (error) {
      console.error(
        `${serviceName} Failed to scrape contact info: ${error.message}`
      );
      console.error(`Failed to scrape contact info: ${error.message}`);

      return { emails: [], phones: [], socialLinks: [] };
    } finally {
      if (page) {
        await page.close();
      }

      // Performance Logging
      const duration = performance.now() - start;
      console.log(`Duration of ${serviceName} : ${duration}`);
      logger.info(serviceName, 'duration', duration);
    }
  }
}
