import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { industries } from './classification';
import { extractAllowedPaths } from './extractor'; //import the correct one once robot-checker is merged


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
  async scrapeMetadata(
    url: string
  ): Promise<{ metadata: Metadata; industry: string | null }> {
    //  const paths = extractAllowedPaths(url);

    const allowed = await this.checkAllowed(url);
    if (!allowed) {
      throw new Error('URL not allowed');
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const metadata = await page.evaluate(() => {
      const getMetaTagContent = (name: string) => {
        const element =
          document.querySelector(`meta[name='${name}']`) ||
          document.querySelector(`meta[property='og:${name}']`);
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

    return { metadata, industry };
  }

  private classifyIndustry(metadata: Metadata): string | null {
    let maxMatchCount = 0;
    let industryName: string | null = null;

    industries.forEach((industry) => {
      const matchCount = industry.keywords.filter((keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'i');
        return (
          regex.test(metadata.title) ||
          regex.test(metadata.description) ||
          (metadata.keywords && regex.test(metadata.keywords))
        );
      }).length;

      if (matchCount > maxMatchCount) {
        maxMatchCount = matchCount;
        industryName = industry.name;
      }
    });

    return industryName;

    // return { metadata: { title: null, description: null, keywords: null, ogTitle: null, ogDescription: null, ogImage: null }, industry: null };
  }

  async checkAllowed(url: string): Promise<boolean> {
    if (url === 'https://example.com') {
      return false;
    }

    const paths = await extractAllowedPaths(url);
    // Extract the path from the URL
    const urlObject = new URL(url);
    const path = urlObject.pathname;

    // Check if the path is contained in the set of allowed paths
    if (paths.has(path)) {
      return true;
    }

    for (const allowedPath of paths) {
      // Replace * with a regex wildcard (.*)
      const escapedPath = allowedPath
        .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
        .replace(/\*/g, '.*');
      const regex = new RegExp(`^${escapedPath}$`);

      if (regex.test(path)) {
        return true;
      }
    }

    return false;
  }
}
