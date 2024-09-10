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
    //console.log(`Scraped ${reviews.length} reviews.`);

    return reviews;
  }

  private async scrapeReviewsViaGoogle(businessName: string): Promise<string[]> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const reviews: string[] = [];

    try {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(businessName)}+reviews`;
      await page.goto(searchUrl, { waitUntil: 'networkidle2' });
      console.log(`Navigated to Google search results for "${businessName} reviews".`);

      const reviewUrls = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'));
        return links
          .map(link => link.href)
          .filter(href => href.includes('hellopeter.com'));
      });

      console.log(`Found review URLs: ${reviewUrls}`);

      for (const url of reviewUrls) {
        try {
          const reviewPage = await browser.newPage();
          await reviewPage.goto(url, { waitUntil: 'networkidle2' });

          let pageReviews: string[] = [];
          if (url.includes('hellopeter.com')) {
            pageReviews = await this.scrapeReviewsFromHelloPeter(reviewPage);
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
      await page.waitForSelector('span.has-text-weight-bold', { timeout: 15000 });
      console.log('Review content and elements loaded.');
  
      const { rating, reviewCount, trustindexRating, nps, recommendationStatus, reviewNumbers } = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('div.perf-card__head'));
        const ratingElement = document.querySelector('span.has-text-weight-bold'); 
        const reviewCountElement = document.querySelectorAll('span.has-text-weight-bold')[1]; 
        const trustindexRatingElement = document.querySelector('div.perf-card__head');
        const npsElement = elements.find(el => el?.textContent?.includes('NPS'));
        const recommendationStatusElement = document.querySelector('span.has-text-weight-bold.color-blue-v2'); 
        
        const reviewNumbersElements = Array.from(document.querySelectorAll('div.is-flex.falign-center.margin-bottom-10 span.fb__breakdown'));
        const reviewNumbers = reviewNumbersElements.map(el => (el as HTMLElement).innerText.trim());
        const rating = ratingElement ? (ratingElement as HTMLElement).innerText.trim() : 'No rating found';
        const reviewCount = reviewCountElement ? (reviewCountElement as HTMLElement).innerText.trim() : 'No review count found';
        const trustindexRating = trustindexRatingElement ? (trustindexRatingElement as HTMLElement).innerText.trim() : 'No Trustindex rating found';
        const nps = npsElement ? (npsElement as HTMLElement).innerText.trim() : 'No NPS found';
        const recommendationStatus = recommendationStatusElement ? (recommendationStatusElement as HTMLElement).innerText.trim() : 'No recommendation status found';
  
        return { rating, reviewCount, trustindexRating, nps, recommendationStatus, reviewNumbers };
      });
  
      console.log(`Extracted rating from Hello Peter: ${rating}`);
      console.log(`Extracted review count from Hello Peter: ${reviewCount}`);
      console.log(`Extracted Trustindex rating from Hello Peter: ${trustindexRating}`);
      console.log(`Extracted NPS from Hello Peter: ${nps}`);
      console.log(`Extracted recommendation status from Hello Peter: ${recommendationStatus}`);
      console.log(`Extracted review numbers from Hello Peter: ${reviewNumbers.join(', ')}`);
  
      return [
        `Rating: ${rating}`,
        `Number of reviews: ${reviewCount}`,
        `Trustindex rating: ${trustindexRating}`,
        `NPS: ${nps}`,
        `Recommendation status: ${recommendationStatus}`,
        `Review breakdown: ${reviewNumbers.join('; ')}`
      ];
    } catch (error) {
      throw new Error(`Failed to scrape reviews from Hello Peter: ${error.message}`);
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
