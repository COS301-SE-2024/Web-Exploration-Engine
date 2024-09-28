import { Injectable } from '@nestjs/common';
import { SentimentClassification, Metadata } from '../models/ServiceModels';
import logger from '../../logging/webscraperlogger';
const serviceName = '[SentimentAnalysisService]';
import axios from 'axios';
import { performance } from 'perf_hooks';
import { error } from 'console';

@Injectable()
export class SentimentAnalysisService {
  private readonly HUGGING_FACE_SENTIMENT_API_URL =
    process.env.SENTIMENT_ANALYSIS_API_URL;
  private readonly HUGGING_FACE_TOKEN_CLASSIFICATION_API_URL =
    process.env.TOKEN_CLASSIFICATION_API_URL;
  private readonly SCORE_THRESHOLD = 0.4;
  private readonly HUGGING_FACE_EMOTION_API_URL = process.env.EMOTION_API_URL;

  // private readonly HUGGING_FACE_API_TOKEN = process.env.ACCESS_TOKEN;

  async classifySentiment(
    url: string,
    metadata: Metadata
  ): Promise<SentimentClassification> {
    try {
      const start = performance.now();
      const sentimentAnalysis = await this.sentimentAnalysis(metadata);
      const { positiveWords, negativeWords } =
        await this.getPositiveNegativeWords(metadata);
      const emotions = await this.analyzeEmotions(metadata);

      // Performance Logging
      const duration = performance.now() - start;
      console.log(`Duration of ${serviceName} : ${duration}, for url: ${url}`);
      logger.info(serviceName,'duration',duration,'url',url,'service',serviceName);

      return {
        sentimentAnalysis,
        positiveWords,
        negativeWords,
        emotions,
      };
    } catch (error) {
      logger.info(
        serviceName,
        'Error during sentiment classification:',
        error.message
      );
      return {
        sentimentAnalysis: {
          positive: 0,
          negative: 0,
          neutral: 0,
        },
        positiveWords: [],
        negativeWords: [],
        emotions: {},
      };
    }
  }
  async sentimentAnalysis(
    metadata: Metadata
  ): Promise<{ positive: number; negative: number; neutral: number }> {
    const inputText = `${metadata.title || ''} ${metadata.description || ''} ${
      metadata.keywords || ''
    }`.trim();

    //console.log(`Input text for sentiment analysis: "${inputText}"`);

    if (!inputText) {
      //console.log('Input text is empty, returning default sentiment scores.');
      return { positive: 0, negative: 0, neutral: 0 };
    }

    try {
      const response = await axios.post(
        this.HUGGING_FACE_SENTIMENT_API_URL,
        { text: inputText },
        {
          headers: {
            // Authorization: `Bearer ${this.HUGGING_FACE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // console.log('Response from Hugging Face sentiment analysis API:', response.data);

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
                console.log(`Unknown label: ${result.label}`);
            }
          }
        });

        return sentimentScores;
      } else {
        throw new Error(
          'Unexpected response format from sentiment analysis API'
        );
      }
    } catch (error) {
      logger.error(
        serviceName,
        'Error during sentiment analysis:',
        error.message
      );
      return { positive: 0, negative: 0, neutral: 0 };
    }
  }

  async getPositiveNegativeWords(
    metadata: Metadata
  ): Promise<{ positiveWords: string[]; negativeWords: string[] }> {
    const inputText = `${metadata.title || ''} ${metadata.description || ''} ${
      metadata.keywords || ''
    }`.trim();

    //console.log(`Input text for word-level sentiment analysis: "${inputText}"`);

    if (!inputText) {
      //console.log('Input text is empty, returning empty word lists.');
      return { positiveWords: [], negativeWords: [] };
    }

    try {
      const tokens: string[] = inputText
        .split(/\s+/)
        .filter((token) => token.length >= 4);
      const uniqueTokens: string[] = Array.from(new Set(tokens));

      if (uniqueTokens.length === 0) {
        //console.log('No tokens to analyze, returning empty word lists.');
        return { positiveWords: [], negativeWords: [] };
      }

      const BATCH_SIZE = 50;
      const batches: string[][] = [];
      for (let i = 0; i < uniqueTokens.length; i += BATCH_SIZE) {
        batches.push(uniqueTokens.slice(i, i + BATCH_SIZE));
      }

      const positiveWords: string[] = [];
      const negativeWords: string[] = [];

      for (const batch of batches) {
        const response = await axios.post(
          this.HUGGING_FACE_TOKEN_CLASSIFICATION_API_URL,
          { text: batch },
          {
            headers: {
              // Authorization: `Bearer ${this.HUGGING_FACE_API_TOKEN}`,
              'Content-Type': 'application/json',
            },
          }
        );

        // console.log(`Response for batch ${batch}:`, response.data);

        if (response.data && Array.isArray(response.data)) {
          for (const [index, tokenResponse] of response.data.entries()) {
            const token = batch[index];
            if (Array.isArray(tokenResponse)) {
              let maxScore = -1;
              let sentimentLabel = '';

              tokenResponse.forEach((result: any) => {
                if (result.score > maxScore) {
                  maxScore = result.score;
                  sentimentLabel = result.label;
                }
              });

              if (maxScore > this.SCORE_THRESHOLD) {
                switch (sentimentLabel) {
                  case '5 stars':
                  case '4 stars':
                    positiveWords.push(token);
                    break;
                  case '1 star':
                  case '2 stars':
                    negativeWords.push(token);
                    break;
                  default:
                    console.log(
                      `Token with neutral/unknown sentiment: ${token}`
                    );
                }
              }
            } else {
              logger.info(
                serviceName,
                `Unexpected response format for token: ${token}`,
                token
              );
            }
          }
        } else {
          throw new Error(
            'Unexpected response format from token classification API'
          );
        }
      }

      return { positiveWords, negativeWords };
    } catch (error) {
      logger.error(
        serviceName,
        'Error during word-level sentiment analysis:',
        error.message
      );
      return { positiveWords: [], negativeWords: [] };
    }
  }
  async analyzeEmotions(
    metadata: Metadata
  ): Promise<{ [emotion: string]: number }> {
    const inputText = `${metadata.title || ''} ${metadata.description || ''} ${
      metadata.keywords || ''
    }`.trim();

    //console.log(`Input text for emotion analysis: "${inputText}"`);

    if (!inputText) {
      //console.log('Input text is empty, returning empty emotions.');
      return {};
    }

    try {
      const response = await axios.post(
        this.HUGGING_FACE_EMOTION_API_URL,
        { text: inputText },
        {
          headers: {
            // Authorization: `Bearer ${this.HUGGING_FACE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // console.log('Response from Hugging Face emotion analysis API:', response.data);

      if (response.data && Array.isArray(response.data)) {
        const emotions: { [emotion: string]: number } = {};

        response.data[0].forEach((result: any) => {
          if (result.label && result.score) {
            // console.log(`Emotion: ${result.label}, Score: ${result.score}`);
            emotions[result.label] = result.score;
          }
        });

        return emotions;
      } else {
        throw new Error('Unexpected response format from emotion analysis API');
      }
    } catch (error) {
      logger.error('Error during emotion analysis:', error.message);
      return {};
    }
  }
}
