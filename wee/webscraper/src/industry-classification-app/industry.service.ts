import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { extractAllowedPaths } from '../robots-app/robots'; //import the correct one once robot-checker is merged
import axios from 'axios';

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

  private readonly HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/sampathkethineedi/industry-classification';
  private readonly HUGGING_FACE_API_TOKEN = process.env.access_Token;

  //this function scrapes the website and returns metadata and metadata
  async scrapeMetadata(
    url: string
  ): Promise<{ metadata: Metadata; industry: string }> {
    //  const paths = extractAllowedPaths(url);

    const allowed = await IndustryService.checkAllowed(url);
    console.log('Is scraping allowed?', allowed);

    if (!allowed) {
      throw new Error('URL IS NOT ALLOWED TO SCRAPE');
    }
    console.log(this.HUGGING_FACE_API_TOKEN);

    console.log(allowed);

    const browser = await puppeteer.launch();
    console.log('Browser launched');

    const page = await browser.newPage();
    console.log('New page created');

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      console.log('Page loaded');

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

      console.log('Metadata extracted:', metadata);

      const industry: string =await this.classifyIndustry(metadata);

      console.log('Industry classified:', industry);

      await browser.close();
      console.log('Browser closed');

       console.log(industry);
      return { metadata, industry };
    } catch (error) {
      throw new Error('Error scraping metadata');
    } finally {
      await browser.close();
    }
  }


  private async classifyIndustry(metadata: Metadata):  Promise<string> {
    console.log('Classifying industry with metadata:', metadata);

    const inputText = `${metadata.title} ${metadata.description} ${metadata.keywords}`;
    console.log('Input text for classification:', inputText);

    try {
    const response = await axios.post(
      this.HUGGING_FACE_API_URL,
      { inputs: inputText },
      {
        headers: {
          Authorization: `Bearer ${this.HUGGING_FACE_API_TOKEN}`,
        },
      }
    );

    console.log('Response from Hugging Face API:', response.data);

    if (response.data && response.data[0]) {
      return response.data[0].label;
    } else {
      throw new Error('Failed to classify industry using Hugging Face model');
    }
  } catch (error) {
    console.error('Error classifying industry:', error);
    throw new Error('Error classifying industry');
  }

  }

   static async  checkAllowed(url: string): Promise<boolean> {
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
