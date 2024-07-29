import { Injectable } from '@nestjs/common';
import { SentimentClassification, Metadata } from '../models/ServiceModels';
import axios from 'axios';

@Injectable()
export class SentimentAnalysisService {
  private readonly HUGGING_FACE_SENTIMENT_API_URL =
    'https://api-inference.huggingface.co/models/finiteautomata/bertweet-base-sentiment-analysis';

  private readonly HUGGING_FACE_API_TOKEN = process.env.access_token;

  async classifySentiment(url: string, metadata: Metadata): Promise<SentimentClassification> {
    try {
      const sentimentAnalysis = await this.sentimentAnalysis(metadata);

      return { sentimentAnalysis };
    } catch (error) {
      console.log(error.message);
      return {
        sentimentAnalysis: {
          positive: 0,
          negative: 0,
          neutral: 0,
        },
      };
    }
  }

  async sentimentAnalysis(metadata: Metadata): Promise<{ positive: number, negative: number, neutral: number }> {
    const inputText = `${metadata.title || ''} ${metadata.description || ''} ${metadata.keywords || ''}`.trim();
  
    console.log(`Input text for sentiment analysis: "${inputText}"`);
  
    if (!inputText) {
      console.log('Input text is empty, returning default sentiment scores.');
      return { positive: 0, negative: 0, neutral: 0 };
    }
  
    try {
      const response = await axios.post(
        this.HUGGING_FACE_SENTIMENT_API_URL,
        { inputs: inputText },
        {
          headers: {
            Authorization: `Bearer ${this.HUGGING_FACE_API_TOKEN}`,
          },
        }
      );
  
      console.log('Response from Hugging Face sentiment analysis API:', response.data);
  
      if (response.data && Array.isArray(response.data)) {
        const sentimentScores = {
          positive: 0,
          negative: 0,
          neutral: 0,
        };
  
        response.data[0].forEach((result: any) => {
          if (result.label && result.score) {
            console.log(`Label: ${result.label}, Score: ${result.score}`);
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
        throw new Error('Unexpected response format from sentiment analysis API');
      }
    } catch (error) {
      console.error('Error during sentiment analysis:', error.message);
      return { positive: 0, negative: 0, neutral: 0 };
    }
  }

}
