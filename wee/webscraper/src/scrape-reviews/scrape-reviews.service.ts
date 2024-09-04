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
      // Wait for the elements to be available
      await page.waitForSelector('span.has-text-weight-bold', { timeout: 15000 });
      console.log('Review content and elements loaded.');

      // Extract rating, number of reviews, Trustindex rating, NPS, and recommendation status
      const { rating, reviewCount, trustindexRating, nps, recommendationStatus } = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('div.perf-card__head'));
        const ratingElement = document.querySelector('span.has-text-weight-bold'); // Adjust if needed
        const reviewCountElement = document.querySelectorAll('span.has-text-weight-bold')[1]; // Assuming it's the second one for review count
        const trustindexRatingElement = document.querySelector('div.perf-card__head'); // Adjust if needed
        const npsElement = elements.find(el => el.textContent.includes('NPS'));//(el => el.textContent.includes('NPS'));
        const recommendationStatusElement = document.querySelector('span.has-text-weight-bold.color-blue-v2'); // Adjust to target the recommendation status element

        const rating = ratingElement ? (ratingElement as HTMLElement).innerText.trim() : 'No rating found';
        const reviewCount = reviewCountElement ? (reviewCountElement as HTMLElement).innerText.trim() : 'No review count found';
        const trustindexRating = trustindexRatingElement ? (trustindexRatingElement as HTMLElement).innerText.trim() : 'No Trustindex rating found';
        const nps = npsElement ? (npsElement as HTMLElement).innerText.trim() : 'No NPS found';
        const recommendationStatus = recommendationStatusElement ? (recommendationStatusElement as HTMLElement).innerText.trim() : 'No recommendation status found';

        return { rating, reviewCount, trustindexRating, nps, recommendationStatus };
      });

      console.log(`Extracted rating from Hello Peter: ${rating}`);
      console.log(`Extracted review count from Hello Peter: ${reviewCount}`);
      console.log(`Extracted Trustindex rating from Hello Peter: ${trustindexRating}`);
      console.log(`Extracted NPS from Hello Peter: ${nps}`);
      console.log(`Extracted recommendation status from Hello Peter: ${recommendationStatus}`);

      return [
        `Rating: ${rating}`,
        `Number of reviews: ${reviewCount}`,
        `Trustindex rating: ${trustindexRating}`,
        `NPS: ${nps}`,
        `Recommendation status: ${recommendationStatus}`
      ];
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
