import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';

interface Metadata {
  title: string | null;
  description: string | null;
  keywords: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
}

@Injectable()
export class ScrapingService {
  async scrapeMetadata(url: string): Promise<Metadata> {
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
