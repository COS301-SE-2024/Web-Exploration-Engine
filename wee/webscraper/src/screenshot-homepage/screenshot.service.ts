import { Injectable } from '@nestjs/common';
import { RobotsResponse, ErrorResponse } from '../models/ServiceModels';
import * as puppeteer from 'puppeteer';


@Injectable()
export class ScreenshotService {
  async captureScreenshot(url: string, robots: RobotsResponse, browser: puppeteer.Browser): Promise<{ screenshot: string } | ErrorResponse> {
    if (!robots.isUrlScrapable) {
      return {
        errorStatus: 403,
        errorCode: '403 Forbidden',
        errorMessage: 'Not allowed to scrape this URL',
      } as ErrorResponse;
    }

    try {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2' });
      const screenshotBuffer = await page.screenshot({ fullPage: true });
      await page.close();

      // Convert the screenshot to base64
      const screenshotBase64 = screenshotBuffer.toString('base64');
      return { screenshot: screenshotBase64 };

    } catch (error) {
      console.error('Failed to capture screenshot', error);
      return {
        errorStatus: 500,
        errorCode: '500 Internal Server Error',
        errorMessage: 'Failed to capture screenshot',
      } as ErrorResponse;
    }
  }
}
