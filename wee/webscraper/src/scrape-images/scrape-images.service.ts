import { Injectable } from '@nestjs/common';
import { RobotsResponse } from '../models/ServiceModels';
import * as puppeteer from 'puppeteer';
import { performance } from 'perf_hooks';
import logger from '../../logging/webscraperlogger';
const serviceName = "[ScrapeImagesService]";

@Injectable()
export class ScrapeImagesService {
   /**
     * Scrapes images from the given URL.
     * @param url - The URL to scrape images from.
     * @returns {Promise<string[]>} - Returns a promise that resolves to an array of image URLs.
     */
   async scrapeImages(url: string, robots: RobotsResponse, page: puppeteer.Page): Promise<string[]> {
    logger.debug(`${serviceName}`);  
    const start = performance.now();

    // Possible improvement: scrape current URL first, if no images found, scrape root URL
    // Check if the URL is allowed to be scraped
    if (!robots.isUrlScrapable) {
        logger.error(serviceName,` Crawling not allowed for this URL`,url);  
        return [];
    }
    
    try {
        const imageUrls = await page.evaluate(() => {
            const images = document.querySelectorAll('img');
            if (!images) {
                return [];
            }
           
            return Array.from(images).map((img: HTMLImageElement) => img.src);
        });

        return imageUrls.slice(0, 50);
    } catch (error) {
        logger.error(serviceName,` Failed to scrape images: ${error.message}`);  
        return [];
    } finally {
        // Performance Logging
        const duration = performance.now() - start;
        console.log(`Duration of ${serviceName} : ${duration}, for url: ${url}`);
        logger.info(serviceName,'duration',duration,'url',url,'service',serviceName);
    }
}
}