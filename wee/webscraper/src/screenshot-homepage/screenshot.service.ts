/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { RobotsResponse, ErrorResponse } from '../models/ServiceModels';
import * as puppeteer from 'puppeteer';
import logger from '../../logging/webscraperlogger';
import { performance } from 'perf_hooks';
import * as fs from 'fs/promises';
const serviceName = "[ScreenshotService]";

@Injectable()
export class ScreenshotService {
  async captureScreenshot(url: string, robots: RobotsResponse, page: puppeteer.Page): Promise<{ screenshot: string } | ErrorResponse> {
    logger.debug(`${serviceName}`);
    const start = performance.now();

    if (!robots.isUrlScrapable) {
      logger.warn('${serviceName} Crawling not allowed for this URL');
      return {
        errorStatus: 403,
        errorCode: '403 Forbidden',
        errorMessage: 'Not allowed to scrape this URL',
      } as ErrorResponse;
    }

    // proxy authentication
    const username = process.env.PROXY_USERNAME;
    const password = process.env.PROXY_PASSWORD;

    if (!username || !password) {
      return {
        errorStatus: 500,
        errorCode: '500 Internal Server Error',
        errorMessage: 'Proxy username or password not set',
      } as ErrorResponse;
    }

    try {
      const screenshotBuffer = await page.screenshot({ fullPage: true });

      // Convert the screenshot to base64
      const screenshotBase64 = screenshotBuffer.toString('base64');
      //logger.info("Screenshot", url, typeof screenshotBase64);
      // Performance Logging
      const duration = performance.now() - start;
      logger.info(serviceName,'duration',duration,'url',url,'service',serviceName);
      return { screenshot: screenshotBase64 };

    } catch (error) {
      logger.error(serviceName,'Failed to capture screenshot', error);
      // Performance Logging
      const duration = performance.now() - start;
      logger.info(serviceName,'duration',duration,'url',url,'service',serviceName);
      return {
        screenshot: '',
      }
    }
  }
}
