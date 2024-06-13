/* eslint-disable @typescript-eslint/no-unused-vars */
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

type LabelScore = {
  label: string;
  score: number;
};

@Injectable()
export class IndustryService {
  static scrapeMetadata(mockUrl: string) {
    throw new Error('Method not implemented.');
  }

  private readonly HUGGING_FACE_API_URL =
    'https://api-inference.huggingface.co/models/sampathkethineedi/industry-classification-api';

  private readonly HUGGING_FACE_API_TOKEN = process.env.access_Token;

  //this function scrapes the website and returns metadata and metadata
  async scrapeMetadata(
    url: string
  ): Promise<{ metadata: Metadata; industry: string; score: number }> {
    //  const paths = extractAllowedPaths(url);

    const allowed = await IndustryService.checkAllowed(url);

    if (!allowed) {
      throw new Error('URL IS NOT ALLOWED TO SCRAPE');
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

      const resp = await this.tryClassifyIndustry(metadata);

      await browser.close();

      const industry = resp.label;
      const score = resp.score;
      return { metadata, industry, score };
    } catch (error) {
      throw new Error('Error scraping metadata');
    } finally {
      await browser.close();
    }
  }

  private async tryClassifyIndustry(metadata: Metadata): Promise<LabelScore> {
    const data = {
      label: ' ',
      score: 0,
    };
    let attempt = 0;
    while (attempt < 2) {
      try {
        const results = await this.classifyIndustry(metadata);
        return results;
      } catch (error) {
        attempt++;
        if (attempt === 2) {
          return data;
        }
      }
    }
    return data;
  }

  private async classifyIndustry(metadata: Metadata): Promise<LabelScore> {
    const inputText = `${metadata.title} ${metadata.description} ${metadata.keywords}`;

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

      if (response.data && response.data[0][0]) {
        const res = {
          label: response.data[0][0].label,
          score: response.data[0][0].score,
        };
        return res;
      } else {
        throw new Error('Failed to classify industry using Hugging Face model');
      }
    } catch (error) {
      throw new Error('Error classifying industry');
    }
  }

  static async checkAllowed(url: string): Promise<boolean> {
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

  async calculateIndustryPercentages(
    urls: string
  ): Promise<{
    industryPercentages: { industry: string; percentage: string }[];
  }> {
    const urlArray = urls.split(',').map((url) => url.trim());

    try {
      const response = await axios.get(
        'http://localhost:3000/api/scrapeIndustry',
        { params: { urls } }
      );
      const data = response.data;

      const industryCounts: Record<string, number> = {};
      let noClassificationCount = 0;
      for (const item of data) {
        if (item.success && item.metadata && item.metadata.industry) {
          const industry = item.metadata.industry;
          industryCounts[industry] = (industryCounts[industry] || 0) + 1;
        } else {
          noClassificationCount++;
        }
      }

      const totalUrls = data.length;

      const industryPercentages = Object.entries(industryCounts).map(
        ([industry, count]) => ({
          industry,
          percentage: (((count as number) / totalUrls) * 100).toFixed(2),
        })
      );

      if (noClassificationCount > 0) {
        const noClassificationPercentage = (
          (noClassificationCount / totalUrls) *
          100
        ).toFixed(2);
        industryPercentages.push({
          industry: 'No classification',
          percentage: noClassificationPercentage,
        });
      }

      return { industryPercentages };
    } catch (error) {
      throw new Error('Error calculating industry percentages');
    }
  }

  // New function to classify industry based on URL
  async domainMatch(url: string): Promise<LabelScore> {
    try {
      const response = await axios.post(
        this.HUGGING_FACE_API_URL,
        { inputs: url },
        {
          headers: {
            Authorization: `Bearer ${this.HUGGING_FACE_API_TOKEN}`,
          },
        }
      );

      if (response.data && response.data[0][0]) {
        const res = {
          label: response.data[0][0].label,
          score: response.data[0][0].score,
        };
        return res;
      } else {
        throw new Error('Failed to classify industry using Hugging Face model');
      }
    } catch (error) {
      throw new Error('Error classifying industry based on URL');
    }
  }
  async compareIndustries(
    urls: string
  ): Promise<{
    comparisons: {
      url: string;
      scrapeIndustry: string;
      domainMatchIndustry: string;
      match: boolean;
    }[];
  }> {
    const urlArray = urls.split(',').map((url) => url.trim());
    const comparisons = [];

    for (const url of urlArray) {
      const { industry: scrapeIndustry, score: scrapeScore } = await this.scrapeMetadata(url);
      const domainMatchIndustry = await this.domainMatch(url);
      const match = scrapeIndustry === domainMatchIndustry.label;

      comparisons.push({
        url,
        scrapeMetadata: {
          scrapeIndustry,
          scrapeScore
        },
        domainMatchIndustry,
        match,
      });
    }

    return { comparisons };
  }
}
