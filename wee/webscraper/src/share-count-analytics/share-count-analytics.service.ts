/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import getLogger from 'webscraper/logging/webscraperlogger';
const serviceName = "[ShareCountService]";
const logger = getLogger();
logger.info(serviceName, 'Service started');

export class ShareCountService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.SHARE_COUNT_API_KEY as string;
    this.baseUrl = 'https://api.sharedcount.com/v1.1';
  }

  async getShareCount(url: string): Promise<any> {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          apikey: this.apiKey,
          url: url,
        },
      });
      // console.log(response.data);
      return response.data;
    } catch (error) {
      //console.error('Error fetching share count:', error);
      logger.error(serviceName,'Error fetching share count:', error.message);
      return null;
    }
  }
}
