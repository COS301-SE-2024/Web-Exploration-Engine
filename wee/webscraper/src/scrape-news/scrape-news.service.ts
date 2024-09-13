import { Injectable } from '@nestjs/common';
import axios from 'axios'; 
import xml2js from 'xml2js';
import logger from '../../logging/webscraperlogger';

const serviceName = "[NewsScraperService]";

//remember: changed to deployed version
// const HUGGING_FACE_SENTIMENT_API_URL = 'https://api-inference.huggingface.co/models/finiteautomata/bertweet-base-sentiment-analysis';
// const HUGGING_FACE_API_TOKEN = process.env.ACCESS_TOKEN;

@Injectable()
export class NewsScraperService {
  private readonly HUGGING_FACE_SENTIMENT_API_URL = process.env.SENTIMENT_ANALYSIS_API_URL;

  async fetchNewsArticles(url: string): Promise<{ title: string; link: string; source: string; pubDate: string; sentimentScores?: { positive: number; negative: number; neutral: number } }[]> {
    try {
      console.log(`${serviceName} Starting fetchNewsArticles for URL: ${url}`);

      const businessName = this.extractBusinessName(url);
      console.log(`${serviceName} Extracted business name: ${businessName}`);

      if (!businessName) {
        logger.error(`${serviceName} Failed to extract business name from URL: ${url}`);
        throw new Error('Could not extract business name from URL');
      }

      const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(businessName)}`;
      console.log(`${serviceName} Constructed Google News RSS feed URL: ${rssUrl}`);

      const response = await axios.get(rssUrl);
      if (response.status !== 200) {
        logger.error(`${serviceName} Failed to fetch Google News RSS feed for ${businessName}`);
        throw new Error(`Failed to fetch news for ${businessName}`);
      }

      const xmlData = response.data;
      console.log(`${serviceName} Successfully fetched RSS feed.`);

      const parser = new xml2js.Parser();
      const parsedData = await parser.parseStringPromise(xmlData);
      console.log(`${serviceName} RSS feed parsed successfully.`);

      const articles = parsedData.rss.channel[0].item.map((item: any) => ({
        title: item.title[0],
        link: item.link[0],
        source: item.source[0]._,
        pubDate: item.pubDate[0]
      }));

      const limitedArticles = articles.slice(0, 10);
      console.log(`${serviceName} Total articles fetched: ${limitedArticles.length}`);

      for (const article of limitedArticles) {
        const sentimentScores = await this.getSentiment(article.title);
        article.sentimentScores = sentimentScores;
      }

      limitedArticles.forEach((article, index) => {
        console.log(`Article ${index + 1}:`);
        console.log(`Title: ${article.title}`);
        console.log(`Link: ${article.link}`);
        console.log(`Source: ${article.source}`);
        console.log(`PubDate: ${article.pubDate}`);
        console.log(`Sentiment Scores:`, article.sentimentScores);
        console.log('-----------------------------');
      });

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

  private async getSentiment(inputText: string): Promise<{ positive: number; negative: number; neutral: number }> {
    try {
      const response = await axios.post(
        this.HUGGING_FACE_SENTIMENT_API_URL,
        { text: inputText },
        {
          headers: {
            // Authorization: `Bearer ${HUGGING_FACE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      //console.log('Response from Hugging Face sentiment analysis API:', response.data);

      if (response.data && Array.isArray(response.data)) {
        const sentimentScores = {
          positive: 0,
          negative: 0,
          neutral: 0,
        };

        response.data[0].forEach((result: any) => {
          if (result.label && result.score) {
            //console.log(`Label: ${result.label}, Score: ${result.score}`);
            switch (result.label) {
              case 'POS':
                sentimentScores.positive = result.score;
                break;
              case 'NEG':
                sentimentScores.negative = result.score;
                break;
              case 'NEU':
                sentimentScores.neutral = result.score;
                break;
              default:
                //console.log(`Unknown label: ${result.label}`);
            }
          }
        });

        return sentimentScores;
      } else {
        throw new Error('Unexpected response format from sentiment analysis API');
      }
    } catch (error) {
      console.error('Error during sentiment analysis:', error.message);
      return { positive: 0, negative: 0, neutral: 0 };
    }
  }
}
