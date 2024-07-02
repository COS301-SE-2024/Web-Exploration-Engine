import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { RobotsResponse } from '../models/ServiceModels';

@Injectable()
export class ScreenshotService {
  /**
   * Captures a screenshot of the given URL.
   * @param url - The URL to capture a screenshot from.
   * @param robots - The RobotsResponse to check if the URL is scrapable.
   * @returns {Promise<string>} - Returns a promise that resolves to a base64-encoded screenshot.
   */
  async getScreenshot(url: string, robots: RobotsResponse): Promise<string> {
    // Check if the URL is allowed to be scraped
    if (!robots.isUrlScrapable) {
      console.error('Crawling not allowed for this URL');
      throw new Error('URL not allowed by robots.txt');
    }

    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2' });
      const screenshotBuffer = await page.screenshot({ fullPage: true });
      await browser.close();

      // Convert the screenshot buffer to a base64 string
      return screenshotBuffer.toString('base64');
    } catch (error) {
      console.error(`Failed to capture screenshot: ${error.message}`);
      throw new Error(`Failed to capture screenshot: ${error.message}`);
    }
  }
}
