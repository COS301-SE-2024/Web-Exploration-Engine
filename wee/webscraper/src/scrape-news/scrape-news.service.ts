import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import xml2js from 'xml2js';
import logger from '../../logging/webscraperlogger';

const serviceName = "[NewsScraperService]";

@Injectable()
export class NewsScraperService {

  async fetchNewsArticles(url: string): Promise<{ title: string; link: string }[]> {
    try {
      console.log(`${serviceName} Starting fetchNewsArticles for URL: ${url}`);

      const businessName = this.extractBusinessName(url);
      console.log(`${serviceName} Extracted business name: ${businessName}`);

      if (!businessName) {
        logger.error(`${serviceName} Failed to extract business name from URL: ${url}`);
        throw new Error('Could not extract business name from URL');
      }

      // Construct RSS feed URL
      const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(businessName)}`;
      console.log(`${serviceName} Constructed Google News RSS feed URL: ${rssUrl}`);

      // Fetch RSS feed
      const response = await fetch(rssUrl);
      if (!response.ok) {
        logger.error(`${serviceName} Failed to fetch Google News RSS feed for ${businessName}`);
        throw new Error(`Failed to fetch news for ${businessName}`);
      }

      // Parse RSS feed
      const xmlData = await response.text();
      console.log(`${serviceName} Successfully fetched RSS feed.`);

      const parser = new xml2js.Parser();
      const parsedData = await parser.parseStringPromise(xmlData);
      console.log(`${serviceName} RSS feed parsed successfully.`);

      // Extract titles and links
      const articles = parsedData.rss.channel[0].item.map((item: any) => ({
        title: item.title[0],
        link: item.link[0],
      }));

      // Limit to first 10 articles
      const limitedArticles = articles.slice(0, 10);
      console.log(`${serviceName} Total articles fetched: ${limitedArticles.length}`);
      return limitedArticles;

    } catch (error) {
      logger.error(`${serviceName} Error fetching news articles: ${error.message}`);
      console.error(`${serviceName} Error fetching news articles: ${error.message}`);
      throw new Error(`Error fetching news articles: ${error.message}`);
    }
  }

  private extractBusinessName(url: string): string | null {
    try {
      const parsedUrl = new URL(url);
      const domainParts = parsedUrl.hostname.split('.');
      const filteredParts = domainParts.filter(part => part !== 'www');
      const commonDomains = ['com', 'org', 'net', 'co', 'gov', 'edu'];

      if (filteredParts.length > 2 && commonDomains.includes(filteredParts[filteredParts.length - 2])) {
        return filteredParts[filteredParts.length - 3];
      }

      const businessName = filteredParts.length > 1 ? filteredParts[filteredParts.length - 2] : filteredParts[0];
      console.log(`${serviceName} Business name extracted from URL: ${businessName}`);
      return businessName;
    } catch (error) {
      logger.error(`${serviceName} Invalid URL provided: ${url}`);
      console.error(`${serviceName} Invalid URL provided: ${url}`);
      return null;
    }
  }
}
