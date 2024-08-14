import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import axios from 'axios';
import * as puppeteer from 'puppeteer';
import { RobotsResponse } from '../models/ServiceModels';
@Injectable()
export class SeoAnalysisService {
  private readonly API_KEY = process.env.api_key;
  async seoAnalysis(url: string, robots: RobotsResponse, browser: puppeteer.Browser) {
    if (!robots.isUrlScrapable) {
      //console.error('Crawling not allowed for this URL');
      return {
        error: 'Crawling not allowed for this URL',
      };
    }

    let htmlContent
    try {
      htmlContent = await this.fetchHtmlContent(url);
    } catch (error) {
      //console.error(`Error fetching HTML content: ${error.message}`);
      return {
        error: `Error fetching HTML content: ${error.message}`,
      };
    }
    
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
      this.analyzeTitleTag(htmlContent),
      this.analyzeMetaDescription(htmlContent, url),
      this.analyzeHeadings(htmlContent),
      this.analyzeImageOptimization(url, browser),
      this.analyzeContentQuality( htmlContent),
      this.analyzeInternalLinks( htmlContent),
      this.analyzeSiteSpeed(url),
      this.analyzeMobileFriendliness(url, browser),
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
      if (length < 120) {
        recommendations += `The meta description is short at ${length} characters. Consider adding more details to reach the optimal length of 120-160 characters. `;
      } else if (length > 160) {
        recommendations += `The meta description is ${length} characters long, which is over the optimal range. Trim it down a bit to keep it concise and within 120-160 characters. `;
      }
    } else {
      recommendations += `The meta description (${length} characters long) is within the optimal length range of 120-160 characters. `;
    }
  
    if (!isUrlWordsInDescription) {
      recommendations += `The words from the URL (${urlWords.join(', ')}) aren't included in the meta description. Including these can help search engines better understand the relevance of your page. `;
    } else {
      recommendations += `There is key terms included from the URL in the meta description. `;
    }

    return {
      metaDescription,
      length,
      // isOptimized,
      isUrlWordsInDescription,
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
    const titleTag = $('title').text().trim();
    const length = titleTag.length;
    let recommendations;
  
    if (length >= 50 && length <= 60) {
      recommendations = `Title tag length (${length} characters) is in the optimal range.`;
    } else if (length < 50) {
      recommendations = `Your title tag is too short (${length} characters). For better visibility and SEO, it should ideally be between 50 and 60 characters.`;
    } else {
      recommendations = `Your title tag is too long (${length} characters). For better visibility and SEO, it should ideally be between 50 and 60 characters.`;
    }
  
    return {
      titleTag,
      length,
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
  
    let recommendations;
    if (count > 0) {
      const headingTags = $('h1, h2, h3, h4, h5, h6').toArray().map(el => el.tagName.toUpperCase());
      const uniqueTags = [...new Set(headingTags)];
      recommendations = `We found the following heading levels: ${uniqueTags.join(', ')}.`;
    } else {
      recommendations = 'No headings (H1-H6) found. Consider adding headings to improve content structure and SEO.';
    }
  
    return {
      headings,
      count,
      recommendations,
    };
  }  
  async analyzeImageOptimization(url: string, browser: puppeteer.Browser) {    
    // proxy authentication
    const username = process.env.PROXY_USERNAME;
    const password = process.env.PROXY_PASSWORD;
  
    if (!username || !password) {
      //console.error('Proxy username or password not set');
      return {
        error: 'Proxy username or password not set',
      };
    }
  
    let page: puppeteer.Page;
    try {
      page = await browser.newPage();
  
      // authenticate page with proxy
      await page.authenticate({
        username,
        password
      });
  
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
        recommendations += `We found ${missingAltTextCount} images without alt text. Adding descriptive alt text helps with accessibility and improves SEO. `;
      }
      if (nonOptimizedCount > 0) {
        recommendations += `We detected ${nonOptimizedCount} non-optimized images. Optimizing images can significantly improve page load times. `;
  
        if (reasonsMap.format.length > 0) {
          recommendations += `Some images are in non-optimized formats. Consider converting them to modern formats like WebP for better performance. `;
        }
        if (reasonsMap.size.length > 0) {
          recommendations += `Some images are too large. Consider resizing them to fit the actual display size on the webpage to reduce load times. `;
        }
        if (reasonsMap.other.length > 0) {
          recommendations += `There are other issues with image optimization. Reviewing these images for potential improvements might be beneficial. `;
        }
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
      if (page) {
        await page.close();
      }
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
      //console.error(`Error checking optimization for image ${imageUrl}: ${error.message}`);
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
  
    const uniqueWordsPercentage = new Set(textWords).size / textWords.length * 100;
  
    let recommendations = '';
  
    if (textLength < 500) {
      recommendations += `The content is currently ${textLength} words long. For better engagement and SEO performance, consider expanding your content to be more than 500 words. This allows you to cover topics more comprehensively and improves your chances of ranking higher in search results. `;
    }else {
      recommendations += `The content is ${textLength} words long, which is ideal for covering topics comprehensively.`;
    }
  
    if (uniqueWordsPercentage < 50) {
      recommendations += `The unique words percentage in your content is ${uniqueWordsPercentage.toFixed(2)}%, which indicates that your content may be repetitive. Try revising your content to introduce more variety in your language. `;
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
    const baseHref = $('base').attr('href') || '';
    const internalLinks = $('a[href^="/"], a[href^="' + baseHref + '"]')
      .toArray()
      .map(el => $(el).attr('href'));
  
    const uniqueLinks = new Set(internalLinks).size;
    const totalLinks = internalLinks.length;
  
    let recommendations = '';
    
    if (uniqueLinks < 5) {
      recommendations += `The site has ${uniqueLinks} unique internal links. Consider adding more to improve navigation and help users discover more of the content. `;
    } else if (uniqueLinks < 10) {
      recommendations += `The site has ${uniqueLinks} unique internal links. Consider adding more to ensure a strong internal linking structure to further boost the site's SEO. `;
    } else {
      recommendations += `The site has ${uniqueLinks} unique internal links, the site has a solid internal linking structure. `;
    }
  
    if (totalLinks > uniqueLinks) {
      const duplicateLinks = totalLinks - uniqueLinks;
      recommendations += `There are ${duplicateLinks} duplicate links. Consider reviewing these to avoid potential redundancy. `;
    }
  
    return {
      totalLinks,
      uniqueLinks,
      recommendations: recommendations.trim(),
    };
  }
  
  async analyzeSiteSpeed(url: string) {
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${this.API_KEY}`;
  
    try {
      const response = await axios.get(apiUrl);
      const data = response.data;
  
      const loadTime = data.lighthouseResult.audits['speed-index'].numericValue / 1000; // Convert milliseconds to seconds
  
      let recommendations = '';
      
      if (loadTime > 5) {
        recommendations += `The page load time is ${loadTime.toFixed(2)} seconds, which is quite high. Users might experience noticeable delays. Consider optimizing images, reducing server response times, and leveraging browser caching to improve loading speed. `;
      } else if (loadTime > 3) {
        recommendations += `The page load time is ${loadTime.toFixed(2)} seconds, which is above the recommended 3 seconds. Try to streamline your page by minimizing the size of resources and improving server performance for a better user experience. `;
      } else {
        recommendations += `The page load time is ${loadTime.toFixed(2)} seconds, which is well within the recommended limits. `;
      }
  
      return {
        loadTime,
        recommendations: recommendations.trim(),
      };
    } catch (error) {
      // console.error(`Error analyzing site speed: ${error.message}`);
      // throw new Error(`Error analyzing site speed: ${error.message}`);
    }
  }
  
  async analyzeMobileFriendliness(url: string, browser: puppeteer.Browser) {
    // Proxy authentication
    const username = process.env.PROXY_USERNAME;
    const password = process.env.PROXY_PASSWORD;
  
    if (!username || !password) {
      console.error('Proxy username or password not set');
      return {
        error: 'Proxy username or password not set',
      };
    }
  
    const page = await browser.newPage();
    // Authenticate page with proxy
    await page.authenticate({
      username,
      password,
    });
  
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
        recommendations += `The site isn't fully responsive on a 375px viewport, which is a common width for smartphones. `;
        recommendations += `Review your CSS media queries and viewport meta tag to ensure better mobile compatibility. `;
      } else {
        recommendations += `Your site is responsive on a 375px viewport, which is a common width for smartphones.`;
        //recommendations += `Keep up the good work and continue testing on different devices.`;
      }
  
      return {
        isResponsive,
        recommendations: recommendations.trim(),
      };
    } catch (error) {
      console.error(`Error analyzing mobile-friendliness: ${error.message}`);
      // return {
      //   error: `Error analyzing mobile-friendliness: ${error.message}`,
      // };
    } finally {
      if (page) {
        await page.close();
      }
    }
  }
  
  async analyzeStructuredData(htmlContent: string) {
    const $ = cheerio.load(htmlContent);
    const structuredData = $('script[type="application/ld+json"]').toArray().map(el => $(el).html());
  
    const count = structuredData.length;
    let recommendations = '';
  
    if (count === 0) {
      recommendations += `Your site currently lacks structured data, which can help search engines understand your content better. `;
      recommendations += `Consider implementing structured data using Schema.org to enhance visibility and improve your SEO. `;
    } else {
      recommendations += `Your site includes ${count} ${count > 1 ? 'structured data elements' : 'structured data element'}. `;
      //recommendations += `Review your structured data to ensure it's correctly implemented and covers relevant content types. `;
      //recommendations += `Adding more detailed structured data can further improve your search engine results and rich snippets.`;
    }
  
    return {
      count,
      recommendations: recommendations.trim(),
    };
  }
  async analyzeIndexability(htmlContent: string) {
    const $ = cheerio.load(htmlContent);
    const metaRobots = $('meta[name="robots"]').attr('content') || '';
    const isIndexable = !metaRobots.includes('noindex');
  
    let recommendations = '';
  
    if (isIndexable) {
      recommendations += `Your page is currently set to be indexed by search engines, which is great for visibility. `;
    } else {
      recommendations += `The page is marked as "noindex," meaning it won't be indexed by search engines. `;
      recommendations += `If you want this page to appear in search results, remove the "noindex" directive from the meta robots tag. `;
    }
  
    return {
      isIndexable,
      recommendations: recommendations.trim(),
    };
  }
  
  async analyzeXmlSitemap(url: string) {
    try {
      const sitemapUrl = new URL('/sitemap.xml', url).toString();
      const response = await axios.get(sitemapUrl);
  
      const isSitemapValid = response.status === 200;
      const recommendations = isSitemapValid 
        ? `The XML sitemap at ${sitemapUrl} is present and accessible.`
        : `The XML sitemap at ${sitemapUrl} is missing or inaccessible. Ensure it is present and accessible.`;
  
      return {
        isSitemapValid,
        recommendations,
      };
    } catch (error) {
      return {
        isSitemapValid: false,
        recommendations: `The XML sitemap at ${url}/sitemap.xml is missing or inaccessible. Ensure it is present and accessible. If the problem persists, check the server configuration or permissions.`,
      };
    }
  }
  
  async analyzeCanonicalTags(htmlContent: string) {
    const $ = cheerio.load(htmlContent);
    const canonicalTag = $('link[rel="canonical"]').attr('href') || '';
  
    const isCanonicalTagPresent = !!canonicalTag;
    const recommendations = isCanonicalTagPresent 
      ? `The canonical tag for the page is set to ${canonicalTag}.`
      : `The page is missing a canonical tag. Adding a canonical tag helps avoid duplicate content issues and improves SEO.`;
  
    return {
      canonicalTag,
      isCanonicalTagPresent,
      recommendations,
    };
  }
  
  async runLighthouse(url: string) {
    try {
      const response = await axios.get(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${this.API_KEY}&category=performance&category=accessibility&category=best-practices&strategy=desktop`);
      const data = response.data;
  
      const getCategoryScore = (category: string) => {
        const categoryData = data.lighthouseResult?.categories?.[category];
        if (categoryData?.score !== undefined) {
          return categoryData.score * 100;
        } else {
          console.warn(`Category score for ${category} is not available.`);
          return null;
        }
      };
  
      const getDiagnostics = (category: string) => {
        const audits = data.lighthouseResult?.audits;
        const diagnostics = [];
        for (const auditKey in audits) {
          const audit = audits[auditKey];
          if (audit.score !== null && audit.score !== 1 && audit.scoreDisplayMode !== 'notApplicable') {
            const descriptionWithoutBrackets = audit.description.replace(/\[.*?\]|\(.*?\)/g, '');
            diagnostics.push({
              title: audit.title,
              description: descriptionWithoutBrackets.trim(),
              score: audit.score,
              displayValue: audit.displayValue
            });
          }
        }
        return diagnostics;
      };
  
      const scores = {
        performance: getCategoryScore('performance'),
        accessibility: getCategoryScore('accessibility'),
        bestPractices: getCategoryScore('best-practices'), 
      };
  
      const diagnostics = {
        //recommendations for performance, accessibility and best-pratices will be the same. That is why I just do it for performance.
        recommendations: getDiagnostics('performance'),
        // accessibility: getDiagnostics('accessibility'),
        // bestPractices: getDiagnostics('best-practices'),
      };
  
      // Debugging logs to verify the output
      // console.log('Lighthouse Scores:', scores);
      // console.log('Lighthouse Diagnostics:', diagnostics);
  
      return { scores, diagnostics }; 
    } catch (error) {
      // console.error(`Error fetching Lighthouse data: ${error.message}`);
      // throw new Error(`Error fetching Lighthouse data: ${error.message}`);
    }
  }
  
  
  
}
