import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { RobotsResponse } from '../models/ServiceModels';


@Injectable()
export class ScrapeImagesService {
   /**
     * Scrapes images from the given URL.
     * @param url - The URL to scrape images from.
     * @returns {Promise<string[]>} - Returns a promise that resolves to an array of image URLs.
     */
   async scrapeImages(url: string, robots: RobotsResponse): Promise<string[]> {
    // Possible improvement: scrape current URL first, if no images found, scrape root URL
    // Check if the URL is allowed to be scraped
    if (!robots.isUrlScrapable) {
        console.error('Crawling not allowed for this URL');
        return [];
    }
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        const imageUrls = await page.evaluate(() => {
            const images = document.querySelectorAll('img');
            return Array.from(images).map((img: HTMLImageElement) => img.src);
        });
        await browser.close();
        return imageUrls.slice(0, 50);
    } catch (error) {
      console.error(`Failed to scrape images: ${error.message}`);
        return [];
    }
}
}
