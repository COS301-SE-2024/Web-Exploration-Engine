import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { ReviewData } from '../models/ServiceModels';
import { performance } from 'perf_hooks';
const serviceName = "[ScrapeReviewsService]";
import logger from '../../logging/webscraperlogger';

@Injectable()
export class ScrapeReviewsService {
  async scrapeReviews(url: string, browser: puppeteer.Browser): Promise<ReviewData> {
    console.log(`Starting review scraping for URL: ${url}`);
    logger.debug(`${serviceName}`);  
    const start = performance.now();

    const businessName = this.extractBusinessNameFromUrl(url);
    if (!businessName) {
      console.error('Failed to extract business name from URL');
      return null;
    }
    console.log(`Extracted business name: ${businessName}`);

    const reviews = await this.scrapeReviewsViaGoogle(businessName, browser);
    //console.log(`Scraped ${reviews.length} reviews.`);
    // Performance Logging
    const duration = performance.now() - start;
    console.log(`Duration of ${serviceName} : ${duration}`);
    logger.info(serviceName,'duration',duration,'url',url,'service',serviceName);

    return reviews;
  }

  private async scrapeReviewsViaGoogle(businessName: string, browser: puppeteer.Browser): Promise<ReviewData> {

    // proxy authentication
    const username = process.env.PROXY_USERNAME;
    const password = process.env.PROXY_PASSWORD;

    if (!username || !password) {
      console.error('Proxy username or password not set');
      return null;
    }
    let page;
    let reviews: ReviewData = null

    try {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(businessName)}+reviews`;

      page = await browser.newPage();

      // authenticate page with proxy
      await page.authenticate({
        username,
        password,
      });
      
      await page.goto(searchUrl, { waitUntil: 'networkidle2' });

      console.log(`Navigated to Google search results for "${businessName} reviews".`);

      const reviewUrls = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'));
        return links
          .map(link => link.href)
          .filter(href => href.includes('hellopeter.com'));
      });

      console.log(`Found review URLs: ${reviewUrls}`);

      // just use first url
      const url = reviewUrls[0];

      try {
        const reviewPage = await browser.newPage();
        await reviewPage.goto(url, { waitUntil: 'networkidle2' });

        if (url.includes('hellopeter.com')) {
          reviews = await this.scrapeReviewsFromHelloPeter(reviewPage);
        }
      } catch (error) {
        console.error(`Failed to scrape reviews from ${url}: ${error.message}`);
      }
      

      return reviews;
    } catch (error) {
      console.error(`Failed to perform Google search: ${error.message}`);
      return null;
    } finally {
      await browser.close();
    }
  }
  private async scrapeReviewsFromHelloPeter(page: puppeteer.Page): Promise<ReviewData> {
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


      // format correctly
      // change rating to number
      let ratingNumber = 0;
      if (rating !== 'No rating found') {
        ratingNumber = parseFloat(rating);
        // check if NaN
        if (isNaN(ratingNumber)) {
          ratingNumber = 0;
        }
      }

      // change review count to number
      let reviewCountNumber = 0;
      if (reviewCount !== 'No review count found') {
        const cleanReviewCount = reviewCount.replace(/,/g, ''); 
        reviewCountNumber = parseInt(cleanReviewCount, 10); 
        // check if NaN
        if (isNaN(reviewCountNumber)) {
          reviewCountNumber = 0;
        }
}

      // change trustindex rating to number
      let trustindexRatingNumber = 0;
      if (trustindexRating !== 'No Trustindex rating found') {
        trustindexRatingNumber = parseFloat(trustindexRating);
        // check if NaN
        if (isNaN(trustindexRatingNumber)) {
          trustindexRatingNumber = 0;
        }
      }

      // change NPS to number
      let npsNumber = 0;
      if (nps !== 'No NPS found') {
        npsNumber = parseFloat(nps);
        // check if NaN
        if (isNaN(npsNumber)) {
          npsNumber = 0;
        }
      }

      // change review numbers to number
      const numericValues = reviewNumbers.map(review => {
        return parseInt(review.replace(/[^\d]/g, '').trim());
      });
      
      const [fiveStars = 0, fourStars= 0, threeStars= 0, twoStars= 0, oneStar= 0] = numericValues;
  
      return {
        rating: ratingNumber,
        numberOfReviews: reviewCountNumber,
        trustIndex: trustindexRatingNumber,
        NPS: npsNumber,
        recommendationStatus,
        starRatings: [
          { stars: 5, numReviews: fiveStars },
          { stars: 4, numReviews: fourStars },
          { stars: 3, numReviews: threeStars },
          { stars: 2, numReviews: twoStars },
          { stars: 1, numReviews: oneStar },
        ],
      }
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