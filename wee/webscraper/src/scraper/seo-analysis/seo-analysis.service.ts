import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import axios from 'axios';

@Injectable()
export class SeoAnalysisService {
  async seoAnalysis(url: string) {
    const htmlContent = await this.fetchHtmlContent(url);

    const [
      titleTagsAnalysis,
      metaDescriptionAnalysis,
      headingAnalysis,  
      imageAnalysis,

    ] = await Promise.all([
      this.analyzeMetaDescription(htmlContent, url),
      this.analyzeTitleTag(htmlContent),
      this.analyzeHeadings(htmlContent),
      this.analyzeImageOptimization(htmlContent),
    ]);

    return {
      titleTagsAnalysis,
      metaDescriptionAnalysis,
      headingAnalysis,
      imageAnalysis,

    };
  }

  async analyzeMetaDescription(htmlContent: string, url: string) {
    const $ = cheerio.load(htmlContent);
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const length = metaDescription.length;
    const isOptimized = length >= 120 && length <= 160;

    // Extract words from the URL
    const urlWords = this.extractWordsFromUrl(url);

    // Check if all words from the URL are in the meta description
    const isUrlWordsInDescription = this.areUrlWordsInDescription(urlWords, metaDescription);

    let recommendations = '';
    if (!isOptimized) {
      recommendations += 'Meta description length should be between 120 and 160 characters. ';
    }
    if (!isUrlWordsInDescription) {
      recommendations += `Consider including words from the URL in the meta description: ${urlWords.join(' ')}.`;
    }

    return {
      metaDescription,
      length,
      isOptimized,
      isUrlWordsInDescription,
      recommendations: recommendations.trim(),
    };
  }


  extractWordsFromUrl(url: string): string[] {
    // Extract the main part of the URL 
    const mainUrlPart = url.replace(/^(https?:\/\/)?(www\.)?/, '').split('.')[0];
    // Split the main part into words based on non-alphanumeric characters
    return mainUrlPart.split(/[^a-zA-Z0-9]+/).filter(word => word.length > 0);
  }

  areUrlWordsInDescription(urlWords: string[], description: string): boolean {
    const lowerDescription = description.toLowerCase();
    return urlWords.every(word => lowerDescription.includes(word.toLowerCase()));
  }

  async fetchHtmlContent(url: string): Promise<string> {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching HTML from ${url}: ${error.message}`);
    }
  }

  async analyzeTitleTag(htmlContent: string) {
    const $ = cheerio.load(htmlContent);
    const titleTag = $('title').text();
    const length = titleTag.length;
    const isOptimized = length >= 50 && length <= 60;
    const recommendations = isOptimized ? '' : 'Title tag length should be between 50 and 60 characters.';

    return {
      titleTag,
      length,
      isOptimized,
      recommendations,
    };
  }

  async analyzeHeadings(htmlContent: string) {
    const $ = cheerio.load(htmlContent);
    const headings = $('h1, h2, h3, h4, h5, h6').toArray().map(el => $(el).text().trim());
    const count = headings.length;
    const recommendations = count > 0 ? '' : 'No headings (H1-H6) found. Add headings to improve structure.';

    return {
      headings,
      count,
      recommendations,
    };
  }
  async analyzeImageOptimization(htmlContent: string) {
    const $ = cheerio.load(htmlContent);
    const images = $('img').toArray();
    
    let missingAltTextCount = 0;
    let nonOptimizedCount = 0;
    const recommendations = [];

    images.forEach((img, index) => {
      const altText = $(img).attr('alt') || '';
      const src = $(img).attr('src') || '';

      if (!altText) {
        missingAltTextCount++;
        recommendations.push(`Missing alt text for image ${index + 1}. URL: ${src}`);
      }
      if (src && !this.isImageOptimized(src)) {
        nonOptimizedCount++;
        recommendations.push(`Image ${index + 1} may not be optimized for faster loading. URL: ${src}`);
      }
    });

    return {
      missingAltTextCount,
      nonOptimizedCount,
      recommendations: recommendations.join(' '),
    };
  }
  async isImageOptimized(src: string): Promise<boolean> {
    const lowerSrc = src.toLowerCase();
    const optimizedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg']; // Include SVG as it's often optimized
    const isOptimizedExtension = optimizedExtensions.some(ext => lowerSrc.endsWith(ext));
  
    if (!isOptimizedExtension) {
      return false;
    }
  
    try {
      // Fetch the image to analyze its size and properties
      const response = await axios.head(src); // Use HEAD request to get headers without downloading the entire image
      const contentLength = parseInt(response.headers['content-length'], 10);
      const contentType = response.headers['content-type'];
  
      // Check if the image size is reasonable for its type
      if (contentType.includes('image') && contentLength > 0) {
        //Check if JPEG size is below a certain threshold
        if (lowerSrc.endsWith('.jpg') || lowerSrc.endsWith('.jpeg')) {
          const maxSizeForJpeg = 1024 * 1024; // 1MB (adjust as needed)
          if (contentLength > maxSizeForJpeg) {
            return false;
          }
        }
      }
  
      return true;
    } catch (error) {
      console.error(`Error checking image optimization for ${src}:`, error);
      return false; 
    }
  }

}
