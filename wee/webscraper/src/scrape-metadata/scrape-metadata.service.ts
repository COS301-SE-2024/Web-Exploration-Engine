import { Injectable } from '@nestjs/common';
import { Metadata, RobotsResponse, ErrorResponse } from '../models/ServiceModels';
import puppeteer from 'puppeteer';
// eslint-disable-next-line @nx/enforce-module-boundaries
import logger from '../../../services/webscraperlogger';
const serviceName = "[ScrapeMetadataService]";

@Injectable()
export class ScrapeMetadataService {
  async scrapeMetadata(
    url: string, data: RobotsResponse
  ): Promise<Metadata | ErrorResponse> {

    logger.debug(`${serviceName}`);
    
    // Possible improvement: first scrape given URL, if no metadata found, scrape root URL

    const allowed = data.isBaseUrlAllowed;

    if (!allowed) {
      logger.warn(`${serviceName} Not allowed to scrape root URL for metadata`)
      return {
        errorStatus: 403,
        errorCode: '403 Forbidden',
        errorMessage: 'Not allowed to scrape root URL for metadata',
      } as ErrorResponse;
    }

    let browser;

    try {
      browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.goto(url, { waitUntil: 'domcontentloaded' });

      const getMetaTagContent = (name: string) => {
        const element =
          document.querySelector(`meta[name='${name}']`) ||
          document.querySelector(`meta[property='og:${name}']`);
        return element ? element.getAttribute('content') : null;
      };

      const getMetaTagContentString = getMetaTagContent.toString();

      const metadata = await page.evaluate((getMetaTagContentStr) => {
        const getMetaTagContent = new Function('return ' + getMetaTagContentStr)();

        return {
          title: document.title,
          description: getMetaTagContent('description'),
          keywords: getMetaTagContent('keywords'),
          ogTitle: getMetaTagContent('title'),
          ogDescription: getMetaTagContent('description'),
          ogImage: getMetaTagContent('image'),
        } as Metadata;
      }, getMetaTagContentString);

      if (!metadata) {
        return {
          title: null,
          description: null,
          keywords: null,
          ogTitle: null,
          ogDescription: null,
          ogImage: null,
        } as Metadata;
      }

      return { ...metadata };

    } catch (error) {
      logger.error(`${serviceName} Error scraping metadata: ${error.message}`)
      return {
        errorStatus: 500,
        errorCode: '500 Internal Server Error',
        errorMessage: `Error scraping metadata: ${error.message}`,
      } as ErrorResponse;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  // Expose the function for testing
  getMetaTagContent(name: string) {
    const element =
      document.querySelector(`meta[name='${name}']`) ||
      document.querySelector(`meta[property='og:${name}']`);
    return element ? element.getAttribute('content') : null;
  }
}
