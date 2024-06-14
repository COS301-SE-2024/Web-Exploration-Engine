import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import axios from 'axios';
import { Metadata } from '../models/ServiceModels';

@Injectable()
export class IndustryClassificationService {
  
  private readonly HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/sampathkethineedi/industry-classification-api';
  private readonly HUGGING_FACE_API_TOKEN = process.env.access_Token;

  private async tryClassifyIndustry(metadata: Metadata, url: string): Promise<string> {
    let attempt = 0;
    while (attempt < 2) {
      try {
        const industry: string = await this.classifyIndustry(metadata, url);
        return industry;
      } catch (error) {
        attempt++;
        if (attempt === 2) {
          return 'No classification';
        }
      }
    }
    return 'No classification';
  }
  private async classifyIndustry(metadata: Metadata, url: string):  Promise<string> {

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
      return response.data[0][0];
    } else {
      throw new Error('Failed to classify industry using Hugging Face model');
    }
  } catch (error) {

    throw new Error('Error classifying industry');
  }

  }

  async classifyIndustryFromMetadata(metadata: Metadata, url: string): Promise<string> {
    try {
      const industry: string = await this.tryClassifyIndustry(metadata, url);
      return industry;
    } catch (error) {
      return 'No classification';
    }
  }
}
