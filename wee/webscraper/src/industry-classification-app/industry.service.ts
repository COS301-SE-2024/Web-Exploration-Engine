import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { industries } from '../industry-classification-app/classification';
import { extractAllowedPaths } from '../robots-app/robots'; //import the correct one once robot-checker is merged


interface Metadata {
  title: string | null;
  description: string | null;
  keywords: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
}

@Injectable()
export class IndustryService {
  //this function scrapes the website and returns metadata and metadata
  async scrapeMetadata(
    url: string
  ): Promise<{ metadata: Metadata; industry: string}> {
    //  const paths = extractAllowedPaths(url);

    const allowed = await this.checkAllowed(url);
    if (!allowed) {
      throw new Error('cannot scrape this website');
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    try {
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

    const industry: string = this.classifyIndustry(metadata);

    await browser.close();

    return { metadata, industry };
  } catch (error) {
    throw new Error('Error scraping metadata');
  } finally {
    await browser.close();
  }
}
  private classifyIndustry(metadata: Metadata): string {
    let maxMatchCount = 0;
    let industryName = "No classification";

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
