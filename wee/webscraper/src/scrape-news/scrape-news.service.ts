import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import logger from '../../logging/webscraperlogger';

const serviceName = "[NewsScraperService]";

@Injectable()
export class NewsScraperService {

  async fetchNewsArticles(url: string): Promise<{ title: string; link: string; snippet: string }[]> {
    try {
      console.log(`${serviceName} Starting fetchNewsArticles for URL: ${url}`);

      const businessName = this.extractBusinessName(url);
      console.log(`${serviceName} Extracted business name: ${businessName}`);

      if (!businessName) {
        logger.error(`${serviceName} Failed to extract business name from URL: ${url}`);
        throw new Error('Could not extract business name from URL');
      }

      const searchUrl = `https://news.google.com/search?q=${encodeURIComponent(businessName)}`;
      console.log(`${serviceName} Constructed Google News search URL: ${searchUrl}`);

      const response = await fetch(searchUrl);
      console.log(`${serviceName} Fetched response status: ${response.status}`);

      if (!response.ok) {
        logger.error(`${serviceName} Failed to fetch Google News for ${businessName}`);
        throw new Error(`Failed to fetch news for ${businessName}`);
      }

      const html = await response.text();
      console.log(`${serviceName} Successfully fetched HTML content.`);

      console.log(`${serviceName} HTML content:`, html);

      const dom = new JSDOM(html);
      const document = dom.window.document;
      const articles: { title: string; link: string; snippet: string }[] = [];

      const articleElements = document.querySelectorAll('article h3 a');
      console.log(`${serviceName} Found ${articleElements.length} article elements.`);

      articleElements.forEach((element, index) => {
        if (index < 10) {  
          const title = element.textContent?.trim() || 'Untitled';
          const href = element.getAttribute('href');
          const link = href ? `https://news.google.com${href.replace('.', '')}` : '#';

          const snippetElement = element.closest('article')?.querySelector('span[role="heading"]');
          const snippet = snippetElement ? this.extractSnippetContainingWord(snippetElement.textContent, businessName) : 'No snippet available';

          articles.push({ title, link, snippet });
          console.log(`${serviceName} Article added: Title - "${title}", Link - ${link}, Snippet - "${snippet}"`);
        }
      });

      console.log(`${serviceName} Total articles fetched: ${articles.length}`);
      return articles;

    } catch (error) {
      logger.error(`${serviceName} Error fetching news articles: ${error.message}`);
      console.error(`${serviceName} Error fetching news articles: ${error.message}`);
      throw new Error(`Error fetching news articles: ${error.message}`);
    }
  }


  private extractSnippetContainingWord(text: string, word: string): string {
    const regex = new RegExp(`([^.!?]*\\b${word}\\b[^.!?]*[.!?])`, 'i');  
    const match = regex.exec(text);
    return match ? match[0] : 'Snippet not found';
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
