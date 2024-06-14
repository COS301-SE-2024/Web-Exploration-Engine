import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ErrorResponse } from '../models/ServiceModels';

/**
 * Service for handling website status related functionality.
 */

@Injectable()
export class ScrapeStatusService {
  /**
   * Checks the status of a website at the given URL.
   * @param url The URL of the website to check.
  */
  async scrapeStatus(url: string): Promise<string | ErrorResponse> {
    // possible improvements:
      // - check if landing page is autogerated (e.g. by next.js) and return parked
      // - differentiate between parked and under construction/not working

    if (!url) {
        return {
          errorStatus: 400,
          errorCode: '400 Bad Request',
          errorMessage: 'URL parameter is required',
        };
    }
    try {
        const response = await axios.head(url);
        const state = response.status >= 200 && response.status < 300;
        return state ? 'live' : 'parked';
    } catch (error) {
        return 'parked';
    }
  }

  /**
   * Calculates the percentage of live and parked URLs.
   * @param urls Array of URLs to check.
  */
  // async calculateSummary(urls: string[]): Promise<{ live: number; parked: number }> {
  //   const statuses = await Promise.all(urls.map(url => this.status(url)));
  //   const liveCount = statuses.filter(status => status).length;
  //   const parkedCount = statuses.length - liveCount;

  //   const livePercentage = (liveCount / statuses.length) * 100;
  //   const parkedPercentage = (parkedCount / statuses.length) * 100;

  //   return {
  //       live: liveCount,
  //       parked: parkedCount,
  //   };
  // }
}
