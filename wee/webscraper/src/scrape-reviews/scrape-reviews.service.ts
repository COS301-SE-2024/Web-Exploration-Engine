import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class ScrapeReviewsService {
  async scrapeReviews(url: string): Promise<string[]> {
    console.log(`Starting review scraping for URL: ${url}`);

    const businessName = this.extractBusinessNameFromUrl(url);
    if (!businessName) {
      console.error('Failed to extract business name from URL');
      return [];
    }
    console.log(`Extracted business name: ${businessName}`);

    const reviews = await this.scrapeReviewsViaGoogle(businessName);
    console.log(`Scraped ${reviews.length} reviews.`);

    return reviews.slice(0, 50); // Limit to the first 50 reviews
  }

  private async scrapeReviewsViaGoogle(businessName: string): Promise<string[]> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const reviews: string[] = [];

    try {
      // Perform Google search with a direct URL
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(businessName)}+reviews`;
      await page.goto(searchUrl, { waitUntil: 'networkidle2' });
      console.log(`Navigated to Google search results for "${businessName} reviews".`);

      // Extract URLs from search results
      const reviewUrls = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'));
        return links
          .map(link => link.href)
          .filter(href => href.includes('hellopeter.com') || href.includes('trustpilot.com') || href.includes('reddit.com'));
      });

      console.log(`Found review URLs: ${reviewUrls}`);

      // Scrape reviews from extracted URLs
      for (const url of reviewUrls) {
        try {
          const reviewPage = await browser.newPage();
          await reviewPage.goto(url, { waitUntil: 'networkidle2' });

          let pageReviews: string[] = [];
          if (url.includes('hellopeter.com')) {
            pageReviews = await this.scrapeReviewsFromHelloPeter(reviewPage);
          } else if (url.includes('trustpilot.com')) {
            pageReviews = await this.scrapeReviewsFromTrustpilot(reviewPage);
          } else if (url.includes('reddit.com')) {
            pageReviews = await this.scrapeReviewsFromReddit(reviewPage);
          }

          reviews.push(...pageReviews);
          await reviewPage.close();
        } catch (error) {
          console.error(`Failed to scrape reviews from ${url}: ${error.message}`);
        }
      }

      return reviews;
    } catch (error) {
      console.error(`Failed to perform Google search: ${error.message}`);
      return [];
    } finally {
      await page.close();
      await browser.close();
    }
  }

  private async scrapeReviewsFromHelloPeter(page: puppeteer.Page): Promise<string[]> {
    try {
    //   await page.waitForSelector('.review-content', { timeout: 15000 });
    //   console.log('Review content loaded.');

    //   const reviews = await page.evaluate(() => {
    //     const reviewElements = document.querySelectorAll('.review-content'); // Adjust based on actual review class
    //     return Array.from(reviewElements).map(review => (review as HTMLElement).innerText.trim());
    //   });

      // Extract rating if available
      const rating = await page.evaluate(() => {
        const ratingElement = document.querySelector('span.has-text-weight-bold'); // Adjust based on actual class or selector
        return ratingElement ? (ratingElement as HTMLElement).innerText.trim() : 'No rating found';
      });

      console.log(`Extracted rating from Hello Peter: ${rating}`);

      return [ `Rating: ${rating}`];
    } catch (error) {
      throw new Error(`Failed to scrape reviews from Hello Peter: ${error.message}`);
    }
  }

  private async scrapeReviewsFromTrustpilot(page: puppeteer.Page): Promise<string[]> {
    try {
      await page.waitForSelector('.review-content', { timeout: 15000 });
      console.log('Review content loaded.');

      const reviews = await page.evaluate(() => {
        const reviewElements = document.querySelectorAll('.review-content'); // Adjust based on actual review class
        return Array.from(reviewElements).map(review => (review as HTMLElement).innerText.trim());
      });

      return reviews;
    } catch (error) {
      throw new Error(`Failed to scrape reviews from Trustpilot: ${error.message}`);
    }
  }

  private async scrapeReviewsFromReddit(page: puppeteer.Page): Promise<string[]> {
    try {
      await page.waitForSelector('div[data-test-id="comment"]', { timeout: 15000 });
      console.log('Review content loaded.');

      const reviews = await page.evaluate(() => {
        const reviewElements = document.querySelectorAll('div[data-test-id="comment"]'); // Adjust based on actual review class
        return Array.from(reviewElements).map(review => (review as HTMLElement).innerText.trim());
      });

      return reviews;
    } catch (error) {
      throw new Error(`Failed to scrape reviews from Reddit: ${error.message}`);
    }
  }

  private extractBusinessNameFromUrl(url: string): string {
    try {
      const hostname = new URL(url).hostname;
      const businessName = hostname.replace('www.', '').split('.')[0].replace(/-/g, ' ');

      console.log(`Business name extracted from URL: ${businessName}`);
      return businessName;
    } catch (error) {
      console.error(`Failed to extract business name from URL: ${error.message}`);
      return '';
    }
  }
}
