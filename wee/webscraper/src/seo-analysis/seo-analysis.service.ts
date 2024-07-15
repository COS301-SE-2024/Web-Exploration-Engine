import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import axios from 'axios';
import puppeteer from 'puppeteer';
import { RobotsResponse } from '../models/ServiceModels';
import { spawn } from 'child_process';
@Injectable()
export class SeoAnalysisService {
  private readonly API_KEY = process.env.api_key;
  async seoAnalysis(url: string, robots: RobotsResponse) {
    if (!robots.isUrlScrapable) {
      console.error('Crawling not allowed for this URL');
      return {
        error: 'Crawling not allowed for this URL',
      };
    }
    const htmlContent = await this.fetchHtmlContent(url);
    const [
      titleTagsAnalysis,
      metaDescriptionAnalysis,
      headingAnalysis,
      imageAnalysis,
      uniqueContentAnalysis,
      internalLinksAnalysis,
      siteSpeedAnalysis,
      mobileFriendlinessAnalysis,
      structuredDataAnalysis,
      indexabilityAnalysis,
      XMLSitemapAnalysis,
      canonicalTagAnalysis,
      lighthouseAnalysis,

    ] = await Promise.all([
      this.analyzeMetaDescription(htmlContent, url),
      this.analyzeTitleTag(htmlContent),
      this.analyzeHeadings(htmlContent),
      this.analyzeImageOptimization( url),
      this.analyzeImageOptimization( htmlContent),
      this.analyzeInternalLinks( htmlContent),
      this.analyzeSiteSpeed(url),
      this.analyzeMobileFriendliness(url),
      this.analyzeStructuredData(htmlContent),
      this.analyzeIndexability(htmlContent),
      this.analyzeXmlSitemap(url),
      this.analyzeCanonicalTags(htmlContent),
      this.runLighthouse(url),
    ]);

    return {
      titleTagsAnalysis,
      metaDescriptionAnalysis,
      headingAnalysis,
      imageAnalysis,
      uniqueContentAnalysis,
      internalLinksAnalysis,
      siteSpeedAnalysis,
      mobileFriendlinessAnalysis,
      structuredDataAnalysis,
      indexabilityAnalysis,
      XMLSitemapAnalysis,
      canonicalTagAnalysis,
      lighthouseAnalysis,
    };
  }

  async analyzeMetaDescription(htmlContent: string, url: string) {
    const $ = cheerio.load(htmlContent);
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const length = metaDescription.length;
    const isOptimized = length >= 120 && length <= 160;

    const urlWords = this.extractWordsFromUrl(url);
    const isUrlWordsInDescription = this.areUrlWordsInDescription(urlWords, metaDescription);

    let recommendations = '';
    if (!isOptimized) {
      recommendations += 'Meta description length should be between 120 and 160 characters. ';
    }
    if (!isUrlWordsInDescription) {
      recommendations += `Consider including words from the URL in the meta description: ${urlWords.join(' ')}. `;
    }

    return {
      metaDescription,
      length,
      // isOptimized,
      // isUrlWordsInDescription,
      recommendations: recommendations.trim(),
    };
  }

  extractWordsFromUrl(url: string): string[] {
    const mainUrlPart = url.replace(/^(https?:\/\/)?(www\.)?/, '').split('.')[0];
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
      //isOptimized,
      recommendations,
    };
  }

  async analyzeHeadings(htmlContent: string) {
    const $ = cheerio.load(htmlContent);
    const headings = $('h1, h2, h3, h4, h5, h6')
      .toArray()
      .map(el => $(el).text().trim())
      .filter(text => text.length > 0);
    
    const count = headings.length;
    const recommendations = count > 0 ? '' : 'No headings (H1-H6) found. Add headings to improve structure.';
  
    return {
      headings,
      count,
      recommendations,
    };
  }
  async analyzeImageOptimization(url: string) {
    const browser = await puppeteer.launch();
    
  
    try {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle0' });
  
      const images = await page.$$eval('img', imgs => imgs.map(img => ({
        src: img.getAttribute('src') || '',
        alt: img.getAttribute('alt') || '',
      })));
  
      let missingAltTextCount = 0;
      let nonOptimizedCount = 0;
      const totalImages = images.length;
      const reasonsMap = {
        format: [] as string[],
        size: [] as string[],
        other: [] as string[],
      };
      const errorUrls: string[] = [];
  
      for (const img of images) {
        if (!img.alt) {
          missingAltTextCount++;
        }
  
        const imageUrl = new URL(img.src, url).toString();
  
        try {
          const { optimized, reasons } = await this.isImageOptimized(imageUrl);
          if (!optimized) {
            nonOptimizedCount++;
            let reasonFound = false;
            reasons.forEach(reason => {
              if (reason.includes('format')) {
                reasonsMap.format.push(imageUrl);
                reasonFound = true;
              } else if (reason.includes('size')) {
                reasonsMap.size.push(imageUrl);
                reasonFound = true;
              }
            });
  
            if (!reasonFound) {
              reasonsMap.other.push(imageUrl);
            }
  
            errorUrls.push(`Error optimizing image: ${img.src}. ${reasons.join(', ')}`);
          }
        } catch (error) {
          console.error(`Error checking optimization for image ${img.src}: ${error.message}`);
          nonOptimizedCount++;
          reasonsMap.other.push(imageUrl);  // Categorize as "other"
          errorUrls.push(`Error checking optimization for image: ${img.src}. ${error.message}`);
        }
      }
  
      let recommendations = '';
      if (missingAltTextCount > 0) {
        recommendations += `${missingAltTextCount} images are missing alt text. `;
      }
      if (nonOptimizedCount > 0) {
        recommendations += `${nonOptimizedCount} images are not optimized. `;
      }
  
      return {
        totalImages,
        missingAltTextCount,
        nonOptimizedCount,
        reasonsMap,
        recommendations: recommendations.trim(),
        errorUrls,
      };
    } catch (error) {
      console.error(`Error analyzing images using Puppeteer: ${error.message}`);
      return {
        error: `Error analyzing images using Puppeteer: ${error.message}`,
      };
    } finally {
      await browser.close();
    }
  }

  async isImageOptimized(imageUrl: string): Promise<{ optimized: boolean; reasons: string[] }> {
    try {
      // Check if the URL ends with a supported image format
      if (!/\.(png|jpe?g|webp|svg)$/i.test(imageUrl)) {
        return {
          optimized: true,
          reasons: [],
        };
      }

      // Attempt to fetch image info with GET request
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer', // Ensure we receive binary data
      });

      const contentType = response.headers['content-type'];
      const contentLength = Number(response.headers['content-length']);

      const reasons: string[] = [];

      // Check if image is in a web-friendly format
      if (!contentType || !contentType.startsWith('image/')) {
        reasons.push('format');
      }

      // Check if image size exceeds 500 KB
      if (contentLength && contentLength > 500 * 1024) {
        reasons.push('size');
      }

      const optimized = reasons.length === 0;

      return {
        optimized,
        reasons,
      };
    } catch (error) {
      console.error(`Error checking optimization for image ${imageUrl}: ${error.message}`);
      return {
        optimized: false,
        reasons: [],
      };
    }
  }
   async analyzeContentQuality(htmlContent: string) {
    const $ = cheerio.load(htmlContent);

    const text = $('body').text();
    const textWords = text.split(/\s+/)
      .filter(word => /^[a-zA-Z]+$/.test(word)); 
    const textLength = textWords.length;
    const wordCounts = new Map<string, number>();

    textWords.forEach(word => {
      const lowerCaseWord = word.toLowerCase();
      if (wordCounts.has(lowerCaseWord)) {
        wordCounts.set(lowerCaseWord, wordCounts.get(lowerCaseWord)! + 1);
      } else {
        wordCounts.set(lowerCaseWord, 1);
      }
    });

    const repeatedWords = [...wordCounts.entries()]
      .filter(([_, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));

    const uniqueWordsPercentage = new Set(textWords).size / textWords.length*100;

    let recommendations = '';
    if (textLength < 500) {
      recommendations += 'Content length should ideally be more than 500 characters. ';
    }
    if (uniqueWordsPercentage < 0.5) {
      recommendations += 'Unique words percentage is very low, consider revising your content to increase its uniqueness. ';
    }

    return {
      textLength,
      uniqueWordsPercentage,
      repeatedWords,
      recommendations: recommendations.trim(),
    };
  }
  async analyzeInternalLinks(htmlContent: string) {
    const $ = cheerio.load(htmlContent);
    const internalLinks = $('a[href^="/"], a[href^="' + $('base').attr('href') + '"]')
      .toArray()
      .map(el => $(el).attr('href'));

    const uniqueLinks = new Set(internalLinks).size;

    let recommendations = '';
    if (uniqueLinks < 5) {
      recommendations += 'Internal linking is sparse. Consider adding more internal links to aid navigation and SEO. ';
    }

    return {
      totalLinks: internalLinks.length,
      uniqueLinks,
      recommendations: recommendations.trim(),
    };
  }
  async analyzeSiteSpeed(url: string) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const start = Date.now();
  
    try {
      await page.goto(url, { waitUntil: 'networkidle2' });
      const loadTimeMs = Date.now() - start;
      const loadTime = loadTimeMs / 1000; // Convert milliseconds to seconds
  
      let recommendations = '';
      if (loadTime > 3) {
        recommendations += 'Page load time is above 3 seconds. Consider optimizing resources to improve site speed.';
      }
  
      return {
        loadTime,
        recommendations: recommendations.trim(),
      };
    } catch (error) {
      console.error(`Error analyzing site speed: ${error.message}`);
      throw new Error(`Error analyzing site speed: ${error.message}`);
    } finally {
      await browser.close();
    }
  }
  
  async analyzeMobileFriendliness(url: string) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
      await page.setViewport({
        width: 375,
        height: 667,
        isMobile: true,
        hasTouch: true,
      });

      await page.goto(url, { waitUntil: 'networkidle2' });

      const isResponsive = await page.evaluate(() => {
        return window.innerWidth === 375;
      });

      let recommendations = '';
      if (!isResponsive) {
        recommendations += 'Site is not fully responsive. Ensure that the site provides a good user experience on mobile devices.';
      }

      return {
        isResponsive,
        recommendations: recommendations.trim(),
      };
    } catch (error) {
      console.error(`Error analyzing mobile-friendliness: ${error.message}`);
    } finally {
      await browser.close();
    }
  }
  async analyzeStructuredData(htmlContent: string) {
    const $ = cheerio.load(htmlContent);
    const structuredData = $('script[type="application/ld+json"]').toArray().map(el => $(el).html());

    const count = structuredData.length;
    const recommendations = count > 0 ? '' : 'No structured data found. Add structured data to improve SEO.';

    return {
     // structuredData,
      count,
      recommendations,
    };
  }

  async analyzeIndexability(htmlContent: string) {
    const $ = cheerio.load(htmlContent);
    const metaRobots = $('meta[name="robots"]').attr('content') || '';
    const isIndexable = !metaRobots.includes('noindex');

    const recommendations = isIndexable ? '' : 'Page is marked as noindex. Remove the noindex directive to ensure it is indexed by search engines.';

    return {
      isIndexable,
      recommendations,
    };
  }
  async analyzeXmlSitemap(url: string) {
    try {
      const sitemapUrl = new URL('/sitemap.xml', url).toString();
      const response = await axios.get(sitemapUrl);

      const isSitemapValid = response.status === 200;
      const recommendations = isSitemapValid ? '' : 'XML sitemap is missing or inaccessible. Ensure it is present and accessible.';

      return {
        isSitemapValid,
        recommendations,
      };
    } catch (error) {
      console.error(`Error fetching XML sitemap: ${error.message}`);
      return {
        isSitemapValid: false,
        recommendations: 'XML sitemap is missing or inaccessible. Ensure it is present and accessible.',
      };
    }
  }
  async analyzeCanonicalTags(htmlContent: string) {
    const $ = cheerio.load(htmlContent);
    const canonicalTag = $('link[rel="canonical"]').attr('href') || '';

    const isCanonicalTagPresent = !!canonicalTag;
    const recommendations = isCanonicalTagPresent ? '' : 'Canonical tag is missing. Add a canonical tag to avoid duplicate content issues.';

    return {
      canonicalTag,
      isCanonicalTagPresent,
      recommendations,
    };
  }
  async runLighthouse(url: string) {
    const lighthouseCmd = `lighthouse ${url} --output=json --chrome-flags="--headless"`;

    return new Promise((resolve, reject) => {
      const lighthouseProcess = spawn(lighthouseCmd, { shell: true });

      let lighthouseOutput = '';

      lighthouseProcess.stdout.on('data', (data) => {
        lighthouseOutput += data.toString();
      });

      lighthouseProcess.stderr.on('data', (data) => {
        console.error(`Lighthouse error: ${data.toString()}`);
      });

      lighthouseProcess.on('close', (code) => {
        if (code === 0) {
          try {
            const lighthouseResult = JSON.parse(lighthouseOutput);
            const recommendations = this.extractLighthouseRecommendations(lighthouseResult);
            resolve(recommendations);
          } catch (error) {
            reject(new Error(`Error parsing Lighthouse JSON: ${error.message}`));
          }
        } else {
          reject(new Error(`Lighthouse process exited with code ${code}`));
        }
      });
    });
  }

  extractLighthouseRecommendations(lighthouseResult: any) {
    const categoriesToInclude = ['performance', 'accessibility', 'best-practices', 'seo'];
    const categoryRecommendations: any = {};

    for (const category of categoriesToInclude) {
      if (lighthouseResult.categories[category]) {
        categoryRecommendations[category] = this.getRecommendationsForCategory(lighthouseResult, category);
      }
    }

    return categoryRecommendations;
  }

  getRecommendationsForCategory(lighthouseResult: any, category: string) {
    const audits = lighthouseResult.categories[category].auditRefs.map((ref: any) => lighthouseResult.audits[ref.id]);
    const recommendations = audits
      .filter((audit: any) => audit.score !== 1) // filter out perfect scores
      .map((audit: any) => ({
        id: audit.id,
        title: audit.title,
        description: audit.description,
        score: audit.score,
        details: audit.details?.items || [],
      }));

    return recommendations;
  }

}
