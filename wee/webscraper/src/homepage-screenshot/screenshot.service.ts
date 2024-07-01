import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { extractAllowedPaths } from '../robots-app/robots'; // Import the correct one once robot-checker is merged


@Injectable()
export class ScreenshotService {
  static async checkAllowed(url: string): Promise<boolean> {
    const paths = await extractAllowedPaths(url);
    const urlObject = new URL(url);
    const path = urlObject.pathname;

    if (paths.has(path)) {
      return true;
    }

    for (const allowedPath of paths) {
      const escapedPath = allowedPath
        .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
        .replace(/\*/g, '.*');
      const regex = new RegExp(`^${escapedPath}$`);

      if (regex.test(path)) {
        return true;
      }
    }

    return false;
  }

  async getScreenshot(url: string): Promise<Buffer> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const screenshotBuffer = await page.screenshot({ fullPage: true });
    await browser.close();
    return screenshotBuffer;
  }
}
