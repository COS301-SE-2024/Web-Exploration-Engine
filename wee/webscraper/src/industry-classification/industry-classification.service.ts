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

  private readonly CANDIDATE_LABELS = [
    'Mining and Minerals', 'Agriculture', 'Manufacturing', 'Finance and Banking',
    'Information Technology', 'Construction', 'Transportation and Logistics',
    'Health Care', 'Education', 'Entertainment and Media', 'Forestry and Paper',
    'Biotechnology', 'Aerospace', 'Marine and Shipping', 'Chemicals',
    'Textiles and Apparel', 'Petroleum and Gas', 'Agribusiness', 'Sports and Recreation',
    'Retail and Consumer Goods', 'Environmental Services', 'Real Estate and Property Development',
    'Telecommunications', 'Utilities', 'Defense and Security', 'Automotive', 'Pharmaceuticals',
    'Hospitality', 'Construction Materials', 'Renewable Energy', 'Marine Resources',
    'Logistics and Supply Chain Management', 'Arts and Culture', 'Social Services', 'Travel and Tourism','Restaurants',
    'Insurance','Legal Services','Fitness and Wellness','Jewelry'
   ];

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
    const batches = this.createLabelBatches(this.CANDIDATE_LABELS, 10);

    try {
      const allResults = [];

      // First pass
      for (const batch of batches) {
        const response = await axios.post(
          this.HUGGING_FACE_ZERO_SHOT_API_URL,
          {
            inputs: inputText,
            parameters: { candidate_labels: batch }
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
          allResults.push(...results);
        }

        console.log('Batch results:', allResults);
      }

      // Determine the top 10 
      const topResults = allResults
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      console.log('Top 10 results:', topResults);

      // Second pass
      const secondPassResults = [];
      const secondPassBatches = this.createLabelBatches(topResults.map(r => r.label), 10);

      for (const batch of secondPassBatches) {
        const response = await axios.post(
          this.HUGGING_FACE_ZERO_SHOT_API_URL,
          {
            inputs: inputText,
            parameters: { candidate_labels: batch }
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
          secondPassResults.push(...results);
        }

        console.log('Second pass batch results:', secondPassResults);
      }

      const topSecondPassResults = secondPassResults
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      console.log('Top results after second pass:', topSecondPassResults);

      return topSecondPassResults;
    } catch (error) {
      throw new Error(`Error classifying industry: ${error.message}`);
    }
  }

  private createLabelBatches(labels: string[], batchSize: number): string[][] {
    const batches = [];
    for (let i = 0; i < labels.length; i += batchSize) {
      batches.push(labels.slice(i, i + batchSize));
    }
    return batches;
  }
}
