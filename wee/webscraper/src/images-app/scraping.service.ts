import { Injectable, NotFoundException } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import axios from 'axios';
import RobotsParser from 'robots-parser';

@Injectable()
export class ScrapingService {
    async scrapeImages(url: string): Promise<string[]> {
        if (!(await this.isCrawlingAllowed(url))) {
            throw new NotFoundException('Crawling is not allowed for this URL.');
        }

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        const imageUrls = await page.evaluate(() => {
            const images = document.querySelectorAll('img');
            return Array.from(images).map((img: HTMLImageElement) => img.src);
        });
        await browser.close();

        return imageUrls.slice(0, 50);
    }

    async scrapeLogos(url: string): Promise<string> {
        if (!(await this.isCrawlingAllowed(url))) {
            throw new NotFoundException('Crawling is not allowed for this URL.');
        }

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
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

        await browser.close();

        return imageUrls.length > 0 ? imageUrls[0] : null;
    }

    async isCrawlingAllowed(url: string): Promise<boolean> {
        try {
            const robotsUrl = new URL('/robots.txt', url).href;
            const response = await axios.get(robotsUrl);
            const robots = RobotsParser(robotsUrl, response.data);
            return robots.isAllowed(url, 'User-agent: *');
        } catch (error) {
            return false; 
        }
    }
}
