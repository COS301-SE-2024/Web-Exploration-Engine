import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { RobotsResponse } from '../models/ServiceModels';
// eslint-disable-next-line @nx/enforce-module-boundaries
import logger from '../../../services/webscraperlogger';

import * as fs from 'fs/promises';
const serviceName = "[ScreenshotService]";
@Injectable()
export class ScreenshotService {
  async captureScreenshot(url: string, robots: RobotsResponse): Promise<{ screenshot: string }> {
    logger.debug(`${serviceName}`);
    if (!robots.isUrlScrapable) {
      logger.warn('${serviceName} Crawling not allowed for this URL');
      throw new Error('Crawling not allowed for this URL');
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const screenshotBuffer = await page.screenshot({ fullPage: true });
    await browser.close();

    // Convert the screenshot to base64
    const screenshotBase64 = screenshotBuffer.toString('base64');

 

    return { screenshot: screenshotBase64 };
  }
}
