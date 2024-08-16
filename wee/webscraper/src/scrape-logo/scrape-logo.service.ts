import { Injectable } from '@nestjs/common';
import { Metadata, RobotsResponse } from '../models/ServiceModels';
import * as puppeteer from 'puppeteer';

@Injectable()
export class ScrapeLogoService {
  /**
     * Scrapes the logo from the given URL.
     * @param  url - The URL to scrape the logo from.
     * @param metadata - The metadata object containing the ogImage property.
     * @returns {Promise<string>} - Returns a promise that resolves to the URL of the logo or and empty string if no logo is found.
     */
  async scrapeLogo(url: string, metadata: Metadata, robots: RobotsResponse, browser: puppeteer.Browser): Promise<string> {
    // proxy authentication
    const username = process.env.PROXY_USERNAME;
    const password = process.env.PROXY_PASSWORD;

    if (!username || !password) {
        console.error('Proxy username or password not set');
        return '';
    }

    let page;
    try {
        // Possible improvement: check if og image is a logo -- sometimes not the case 
        // Scrape for logo in given URL - if not found, scrape root URL
        if (metadata.ogImage && metadata.ogImage.trim() !== '') {
            return metadata.ogImage;
        }

        // Possible improvements: 
        // scrape images with 'logo' in the src or alt attribute
        // look for more keywords or patterns - e.g. 'brand', 'icon', 'logo'
        // return multiple images - order based on relevance
        if (!robots.isUrlScrapable) {
            console.error('Crawling not allowed for this URL');
            return '';
        }

        page = await browser.newPage();
        // authenticate page with proxy
        await page.authenticate({
            username,
            password,
        });
        
        await page.goto(url);

        const logoPattern = 'logo';
        const imageUrls = await page.evaluate((pattern) => {
            const images = document.querySelectorAll('img');
            const regex = new RegExp(pattern, 'i');
            return Array.from(images)
                .filter((img: HTMLImageElement) =>
                    regex.test(img.src) || regex.test(img.alt))
                .map((img: HTMLImageElement) => img.src);
        }, logoPattern);

        return imageUrls.length > 0 ? imageUrls[0] : '';
    } catch (error) {
        console.error(`Failed to scrape logo: ${error.message}`);
        return '';
    } finally {
        if (page) {
            await page.close();
        }
    }
 }
}
