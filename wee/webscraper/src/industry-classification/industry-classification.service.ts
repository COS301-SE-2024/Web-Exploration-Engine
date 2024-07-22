import { Injectable } from '@nestjs/common';
import { IndustryClassification, Metadata } from '../models/ServiceModels';
import axios from 'axios';


@Injectable()
export class IndustryClassificationService {
  private readonly HUGGING_FACE_API_URL =
    'https://api-inference.huggingface.co/models/sampathkethineedi/industry-classification-api';

  private readonly HUGGING_FACE_ZERO_SHOT_API_URL =
    'https://api-inference.huggingface.co/models/facebook/bart-large-mnli';

  private readonly HUGGING_FACE_API_TOKEN = process.env.access_token;

  async classifyIndustry(url: string, metadata: Metadata): Promise<IndustryClassification> {
    try {
      const metadataClass = await this.metadataClassify(metadata);
      const domainClass = await this.domainClassify(url);
      const zeroShotMetaDataClassify = await this.zeroShotMetaDataClassify(metadata);
      return { metadataClass, domainClass, zeroShotMetaDataClassify };
    } 
    catch (error) {
      return {
        metadataClass: {
          label: 'Unknown',
          score: 0,
        },
        domainClass: {
          label: 'Unknown',
          score: 0,
        },
        zeroShotMetaDataClassify: [
          { label: 'Unknown', score: 0 },
          { label: 'Unknown', score: 0 },
          { label: 'Unknown', score: 0 },
        ],
      };
    }
  }

  async metadataClassify(metadata: Metadata): Promise<{label: string, score: number}> {
    if (!metadata.title && !metadata.description && !metadata.keywords) {
      return {
        label: 'Unknown',
        score: 0,
      };
    }
    const inputText = `${metadata.title} ${metadata.description} ${metadata.keywords}`;

    try {
      const response = await axios.post(
        this.HUGGING_FACE_API_URL,
        { inputs: inputText },
        {
          headers: {
            Authorization: `Bearer ${this.HUGGING_FACE_API_TOKEN}`,
          },
        }
      );

      if (response.data && response.data[0][0]) {
        const res = {
          label: response.data[0][0].label,
          score: response.data[0][0].score,
        };
        return res;
      } else {
        throw new Error('Failed to classify industry using Hugging Face model');
      }
    } catch (error) {
      throw new Error(`Error classifying industry: ${error.message}`);
    }
  }

  async domainClassify(url: string): Promise<{label: string, score: number}> {
    if (!url) {
      return {
        label: 'Unknown',
        score: 0,
      };
    }
    const inputText = `${url}`;
    
    try {
      const response = await axios.post(
        this.HUGGING_FACE_API_URL,
        { inputs: inputText },
        {
          headers: {
            Authorization: `Bearer ${this.HUGGING_FACE_API_TOKEN}`,
          },
        }
      );

      if (response.data && response.data[0][0]) {
        const res = {
          label: response.data[0][0].label,
          score: response.data[0][0].score,
        };
        return res;
      } else {
        throw new Error('Failed to classify industry using Hugging Face model');
      }
    } catch (error) {
      throw new Error(`Error classifying industry: ${error.message}`);
    }
  }

  async zeroShotMetaDataClassify(metadata: Metadata): Promise<{label: string, score: number}[]> {
    if (!metadata.title && !metadata.description && !metadata.keywords) {
      return [
        { label: 'Unknown', score: 0 },
        { label: 'Unknown', score: 0 },
        { label: 'Unknown', score: 0 },
      ];
    }
    
    const inputText = `${metadata.title} ${metadata.description} ${metadata.keywords}`;
    const labels = ['Finance', 'Health', 'Retail', 'Education']; 
  
    try {
      const response = await axios.post(
        this.HUGGING_FACE_ZERO_SHOT_API_URL,
        {
          inputs: inputText,
          parameters: { candidate_labels: labels }
        },
        {
          headers: {
            Authorization: `Bearer ${this.HUGGING_FACE_API_TOKEN}`,
          },
        }
      );
  
      if (response.data && response.data.labels && response.data.scores) {
        const results = response.data.labels.map((label: string, index: number) => ({
          label,
          score: response.data.scores[index]
        }));
  
        const topResults = results
          .sort((a, b) => b.score - a.score)
          .slice(0, 3);
  
        return topResults;
      } else {
        throw new Error('Failed to classify industry using zero-shot classification');
      }
    } catch (error) {
      throw new Error(`Error classifying industry: ${error.message}`);
    }
  }
  
}
