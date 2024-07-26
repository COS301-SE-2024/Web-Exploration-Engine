import { Injectable } from '@nestjs/common';
import { IndustryClassification, Metadata } from '../models/ServiceModels';
import axios from 'axios';
import logger from '../../../services/webscraperlogger';

const serviceName = "[IndustryClassificationService]";

@Injectable()
export class IndustryClassificationService {
  private readonly HUGGING_FACE_API_URL =
    'https://api-inference.huggingface.co/models/sampathkethineedi/industry-classification-api';

  private readonly HUGGING_FACE_API_TOKEN = process.env.access_token;

  async classifyIndustry(url: string, metadata: Metadata): Promise<IndustryClassification> {

    logger.log(serviceName);

    try {
      const metadataClass = await this.metadataClassify(metadata);
      const domainClass = await this.domainClassify(url);
      return { metadataClass, domainClass };
    }
    catch (error) {
      logger.error(`${serviceName}, Error with metadata class ${error.message}`)
      return { 
        metadataClass: {
          label: 'Unknown',
          score: 0,
        },
        domainClass: {
          label: 'Unknown',
          score: 0,
        },
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
}
