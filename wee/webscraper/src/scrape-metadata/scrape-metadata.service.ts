import { Injectable } from '@nestjs/common';
import { Metadata, RobotsResponse, ErrorResponse } from '../models/ServiceModels';
import * as puppeteer from 'puppeteer';
import logger from '../../logging/webscraperlogger';
import { performance } from 'perf_hooks';
const serviceName = "[ScrapeMetadataService]";

@Injectable()
export class ScrapeMetadataService {

  async scrapeMetadata( url: string, data: RobotsResponse, page: puppeteer.Page): Promise<Metadata | ErrorResponse> {
    logger.debug(`${serviceName}`);    
    const start = performance.now();
    const allowed = data.isBaseUrlAllowed;

    if (!allowed) {
      logger.warn(serviceName,`Not allowed to scrape root URL for metadata`)
      return {
        errorStatus: 403,
        errorCode: '403 Forbidden',
        errorMessage: 'Not allowed to scrape root URL for metadata',
      } as ErrorResponse;
    }

    try {
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
      // Performance Logging
      const duration = performance.now() - start;
      console.log(`Duration of ${serviceName} : ${duration}`);
      logger.info(serviceName,'duration',duration,'url',url,'service',serviceName);

      return { ...metadata };

    } catch (error) {
      logger.error(serviceName,` Error scraping metadata: ${error.message}`)
      return {
        errorStatus: 500,
        errorCode: '500 Internal Server Error',
        errorMessage: `Error scraping metadata: ${error.message}`,
      } as ErrorResponse;
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
