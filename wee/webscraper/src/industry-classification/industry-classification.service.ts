import { Injectable } from '@nestjs/common';
import { IndustryClassification, Metadata } from '../models/ServiceModels';
import logger from '../../../services/webscraperlogger';
import axios from 'axios';
const serviceName = "[IndustryClassificationService]";

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
    'Insurance','Legal Services','Fitness and Wellness','Jewelry','Entertainment and Recreation'
  ];

 
  async classifyIndustry(url: string, metadata: Metadata): Promise<IndustryClassification> {
    logger.debug(`${serviceName}`);

    try {
      const metadataClass = await this.metadataClassify(metadata);
      //console.log('Metadata Classification:', metadataClass);
      const domainClass = await this.domainClassify(url);
      //console.log('Domain Classification:', domainClass);
      const zeroShotMetaDataClassify = await this.zeroShotMetaDataClassify(metadata);
      //console.log('Zero-Shot Metadata Classification:', zeroShotMetaDataClassify);
      const zeroShotDomainClassify = await this.zeroShotDomainClassify(url);
      //console.log('Zero-Shot Domain Classification:', zeroShotDomainClassify);
      return { metadataClass, domainClass, zeroShotMetaDataClassify , zeroShotDomainClassify };
    } 
    catch (error) {
      logger.error(`${serviceName} ${error.message}`);

      console.log(error.message);
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
        zeroShotDomainClassify: [
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
        logger.error(`${serviceName} Failed to classify industry using Hugging Face model`);
        throw new Error('Failed to classify industry using Hugging Face model');
      }
    } catch (error) {
      logger.error(`${serviceName} Error classifying industry: ${error.message}`);
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
        logger.error(`${serviceName} Failed to classify industry using Hugging Face model`);
        throw new Error('Failed to classify industry using Hugging Face model');
      }
    } catch (error) {
      logger.error(`${serviceName} Error classifying industry: ${error.message}`);
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

        console.log('Response:', response);
  
        if (response.data && response.data.labels && response.data.scores) {
          const results = response.data.labels.map((label: string, index: number) => ({
            label,
            score: response.data.scores[index]
          }));
          allResults.push(...results);
        }
  
        //console.log('Batch results:', allResults);
      }
  
      // Determine the top 3 
      const topResults = allResults
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
  
      //console.log('Top 3 results:', topResults);
  
      return topResults;
    } catch (error) {
      logger.debug(`${serviceName} Error classifying industry: ${error.message}`);
      throw new Error(`Error classifying industry: ${error.message}`);
    }
  }

  async zeroShotDomainClassify(url: string): Promise<{ label: string, score: number }[]> {
    if (!url) {
      return [
        { label: 'Unknown', score: 0 },
        { label: 'Unknown', score: 0 },
        { label: 'Unknown', score: 0 },
      ];
    }
  
    const inputText = `${url}`;
    const batches = this.createLabelBatches(this.CANDIDATE_LABELS, 10);
  
    try {
      const allResults = [];
  
      for (const batch of batches) {
        const response = await axios.post(
          this.HUGGING_FACE_ZERO_SHOT_API_URL,
          {
            inputs: inputText,
            parameters: { candidate_labels: batch },
          },
          {
            headers: {
              Authorization: `Bearer ${this.HUGGING_FACE_API_TOKEN}`,
            },
          }
        );

        // console.log('Response:', response);
  
        if (response.data && response.data.labels && response.data.scores) {
          const results = response.data.labels.map((label: string, index: number) => ({
            label,
            score: response.data.scores[index],
          }));
          allResults.push(...results);
        }
      }
  
      // Determine the top 3 
      const topResults = allResults
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
  
      return topResults;
    } catch (error) {
      logger.error(`${serviceName} Error classifying industry: ${error.message}`);      
      throw new Error(`Error classifying domain: ${error.message}`);
    }
  }
  
  createLabelBatches(labels: string[], batchSize: number): string[][] {
    const batches = [];
    for (let i = 0; i < labels.length; i += batchSize) {
      batches.push(labels.slice(i, i + batchSize));
    }
    return batches;
  }
}