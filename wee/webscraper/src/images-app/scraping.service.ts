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

    async scrapeLogos(url: string): Promise<string | null> { 
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);

        const metadata = await page.evaluate(() => {
            const getMetaTagContent = (name: string) => {
                const element = document.querySelector(`meta[name='${name}']`) || document.querySelector(`meta[property='og:${name}']`);
                return element ? element.getAttribute('content') : null;
            };
            return {
                ogImage: getMetaTagContent('image'),
            };
        });

        if (metadata.ogImage && metadata.ogImage.toLowerCase().includes('logo')) {
            await browser.close();
            return metadata.ogImage;
        }

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

    async scrapeMetadata(url: string): Promise<any> {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        const metadata = await page.evaluate(() => {
            const getMetaTagContent = (name: string) => {
                const element = document.querySelector(`meta[name='${name}']`) || document.querySelector(`meta[property='og:${name}']`);
                return element ? element.getAttribute('content') : null;
            };

            return {
                title: document.title,
                description: getMetaTagContent('description'),
                keywords: getMetaTagContent('keywords'),
                ogTitle: getMetaTagContent('title'),
                ogDescription: getMetaTagContent('description'),
                ogImage: getMetaTagContent('image'),
            };
        });

        await browser.close();
        return metadata;
    }

}
