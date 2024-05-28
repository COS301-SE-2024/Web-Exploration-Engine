import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class ScrapingService {
    async scrapeImages(url: string): Promise<string[]> {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        const imageUrls = await page.evaluate(() => {
            const images = document.querySelectorAll('img');
            return Array.from(images).map((img: HTMLImageElement) => img.src);
        });
        await browser.close();
        return imageUrls;
    }

    async scrapeLogos(url: string): Promise<string> { 
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

        // Return the first logo image URL, or null if none found
        return imageUrls.length > 0 ? imageUrls[0] : null;
    }
}
