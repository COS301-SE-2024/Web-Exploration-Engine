import { Injectable } from '@nestjs/common';
import { SentimentClassification, Metadata } from '../models/ServiceModels';
import axios from 'axios';

@Injectable()
export class SentimentAnalysisService {
  private readonly HUGGING_FACE_SENTIMENT_API_URL =
    'https://api-inference.huggingface.co/models/finiteautomata/bertweet-base-sentiment-analysis';
  private readonly HUGGING_FACE_TOKEN_CLASSIFICATION_API_URL =
    'https://api-inference.huggingface.co/models/nlptown/bert-base-multilingual-uncased-sentiment';
  private readonly SCORE_THRESHOLD = 0.4;
  private readonly HUGGING_FACE_EMOTION_API_URL =
    'https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base';

  private readonly HUGGING_FACE_API_TOKEN = process.env.access_token;

  async classifySentiment(url: string, metadata: Metadata): Promise<SentimentClassification> {
    try {
      const sentimentAnalysis = await this.sentimentAnalysis(metadata);
      const { positiveWords, negativeWords } = await this.getPositiveNegativeWords(metadata);
      const emotions = await this.analyzeEmotions(metadata);

      return {
        sentimentAnalysis,
        positiveWords,
        negativeWords,
        emotions,
      };
    } catch (error) {
      console.log('Error during sentiment classification:', error.message);
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

  async getPositiveNegativeWords(metadata: Metadata): Promise<{ positiveWords: string[], negativeWords: string[] }> {
    const inputText = `${metadata.title || ''} ${metadata.description || ''} ${metadata.keywords || ''}`.trim();
  
    console.log(`Input text for word-level sentiment analysis: "${inputText}"`);
  
    if (!inputText) {
      console.log('Input text is empty, returning empty word lists.');
      return { positiveWords: [], negativeWords: [] };
    }
  
    try {
      const tokens = inputText.split(/\s+/).filter(token => token.length >= 4); // Filter words with 4 or more letters
  
      const positiveWords: string[] = [];
      const negativeWords: string[] = [];
      const analyzedWords: Set<string> = new Set(); // Track analyzed words
  
      // Analyze each token with a delay to avoid rate limiting
      for (const [index, token] of tokens.entries()) {
        if (index > 0 && index % 10 === 0) { 
          await this.delay(1000); // Delay for 1 second
        }
  
        if (analyzedWords.has(token)) {
          continue;
        }
  
        analyzedWords.add(token); 
  
        const response = await axios.post(
          this.HUGGING_FACE_TOKEN_CLASSIFICATION_API_URL,
          { inputs: token },
          {
            headers: {
              Authorization: `Bearer ${this.HUGGING_FACE_API_TOKEN}`,
            },
          }
        );
  
        console.log(`Response for token "${token}":`, response.data);
  
        if (response.data && Array.isArray(response.data)) {
          let maxScore = -1;
          let sentimentLabel = '';
  
          response.data[0].forEach((result: any) => {
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
                console.log(`Token with neutral/unknown sentiment: ${token}`);
            }
          }
        } else {
          throw new Error('Unexpected response format from token classification API');
        }
      }
  
      return { positiveWords, negativeWords };
    } catch (error) {
      console.error('Error during word-level sentiment analysis:', error.message);
      return { positiveWords: [], negativeWords: [] };
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async analyzeEmotions(metadata: Metadata): Promise<{ [emotion: string]: number }> {
    const inputText = `${metadata.title || ''} ${metadata.description || ''} ${metadata.keywords || ''}`.trim();
  
    console.log(`Input text for emotion analysis: "${inputText}"`);
  
    if (!inputText) {
      console.log('Input text is empty, returning empty emotions.');
      return {};
    }
  
    try {
      const response = await axios.post(
        this.HUGGING_FACE_EMOTION_API_URL,
        { inputs: inputText },
        {
          headers: {
            Authorization: `Bearer ${this.HUGGING_FACE_API_TOKEN}`,
          },
        }
      );
  
      console.log('Response from Hugging Face emotion analysis API:', response.data);
  
      if (response.data && Array.isArray(response.data)) {
        const emotions: { [emotion: string]: number } = {};
  
        response.data[0].forEach((result: any) => {
          if (result.label && result.score) {
            console.log(`Emotion: ${result.label}, Score: ${result.score}`);
            emotions[result.label] = result.score;
          }
        });
  
        return emotions;
      } else {
        throw new Error('Unexpected response format from emotion analysis API');
      }
    } catch (error) {
      console.error('Error during emotion analysis:', error.message);
      return {};
    }
  }


}