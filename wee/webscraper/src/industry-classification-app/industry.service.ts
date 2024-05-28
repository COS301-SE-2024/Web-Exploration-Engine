import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { industries } from './classification';

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
  async scrapeMetadata(url: string): Promise<{ metadata: Metadata; industry: string | null }> {
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

    const industry: string | null = this.classifyIndustry(metadata);

    await browser.close();

    return {metadata, industry};
  }

  private classifyIndustry(metadata: Metadata): string | null {
    let maxMatchCount = 0;
    let industryName: string | null = null;

    industries.forEach(industry => {
        const matchCount = industry.keywords.filter(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, "i");
            return regex.test(metadata.title) || regex.test(metadata.description) || (metadata.keywords && regex.test(metadata.keywords));
        }).length;

        if (matchCount > maxMatchCount) {
            maxMatchCount = matchCount;
            industryName = industry.name;
        }
    });

    return industryName;
}
}
