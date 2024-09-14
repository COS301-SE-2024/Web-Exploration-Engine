import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { URL } from 'url';

@Injectable()
export class KeywordAnalysisService {
    async getKeywordRanking(url: string, keyword: string, browser: puppeteer.Browser) {
        // Normalize the URL
        const normalizedUrl = new URL(url).hostname;

        // proxy authentication
        const username = process.env.PROXY_USERNAME;
        const password = process.env.PROXY_PASSWORD;

        if (!username || !password) {
            console.error('Proxy username or password not set');
            return { 
                url,
                keyword,
                ranking: 'Not ranked in the top results', 
                topTen: {},
                recommendation: 'The URL is not ranked in the top search results for the keyword. Consider optimizing the content, improving on-page SEO, and possibly targeting less competitive keywords. Here are the top 10 URLs for this keyword: example.com, example2.com.' };
        }
        
        let page;

        try {
            page = await browser.newPage();

            // authenticate page with proxy
            await page.authenticate({
                username,
                password,
            });
        
            // Perform a Google search for the keyword
            await page.goto(`https://www.google.com/search?q=${encodeURIComponent(keyword)}`);
        
            const results = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('div.g')).map(result => {
                    const linkElement = result.querySelector('a');
                    return {
                        link: linkElement ? linkElement.href : ''
                    };
                });
            });
        
            // Find the ranking of the target URL
            const ranking = results.findIndex(result => {
                const resultUrl = new URL(result.link).hostname;
                return resultUrl.includes(normalizedUrl);
            }) + 1;
        
            // get the top 10 search results
            const topTenUrls = results.slice(0, 10).map((result) => {
                return new URL(result.link).hostname;
            });

            let recommendation = '';
            if (ranking > 1) { 
                const higherRankedUrls = results.slice(0, ranking - 1).map(result => {
                    return new URL(result.link).hostname;
                });
            
                recommendation = `The URL is ranked at position ${ranking} for the keyword. However, the following URLs are ranked higher: ${higherRankedUrls.join(', ')}. Consider analyzing the content, backlinks, and SEO strategies of these competitors to improve the ranking.`;
            } else if (ranking === 1) {
                recommendation = `The URL is ranked at position 1 for the keyword. Continue analyzing the content, backlinks, and SEO strategies to maintain your top ranking.`;
            } else { 
                const topUrls = results.slice(0, 10).map(result => {
                    return new URL(result.link).hostname;
                });
            
                recommendation = `The URL is not ranked in the top search results for the keyword. Consider optimizing the content, improving on-page SEO, and possibly targeting less competitive keywords. Here are the top 10 URLs for this keyword: ${topUrls.join(', ')}.`;
            }    
            return {
                url,
                keyword,
                ranking: ranking > 0 ? ranking : 'Not ranked in the top results',
                topTen: topTenUrls,
                recommendation: recommendation
            };
        } catch (error) {
            console.error(`Failed to get keyword ranking: ${error.message}`);
            return { 
                url,
                keyword,
                ranking: 'Not ranked in the top results', 
                topTen: {},
                recommendation: 'The URL is not ranked in the top search results for the keyword. Consider optimizing the content, improving on-page SEO, and possibly targeting less competitive keywords. Here are the top 10 URLs for this keyword: example.com, example2.com.' };
        } finally {
            if (page) {
                await page.close();
            }
        }
    }    

    // async getKeywordDensity(url: string, keyword: string) {
    //     const browser = await puppeteer.launch();
    //     const page = await browser.newPage();
        
    //     await page.goto(url);
        
    //     const keywordDensity = await page.evaluate((keyword) => {
    //         const bodyText = document.body.innerText;
    //         const keywordCount = (bodyText.match(new RegExp(keyword, 'gi')) || []).length;
    //         const totalWords = bodyText.split(/\s+/).length;
    //         const density = (keywordCount / totalWords) * 100;
    //         return {
    //             keywordCount,
    //             totalWords,
    //             density: density.toFixed(2)
    //         };
    //     }, keyword);
      
    //     await browser.close();
        
    //     return keywordDensity;
    // }
    // async getKeywordInAnchorTexts(url: string, keyword: string) {
    //     const browser = await puppeteer.launch();
    //     const page = await browser.newPage();
        
    //     await page.goto(url);

    //     const anchorTextAnalysis = await page.evaluate((keyword) => {
    //         const anchors = document.querySelectorAll('a');
    //         const anchorDetails = Array.from(anchors).map(anchor => {
    //             const text = anchor.innerText;
    //             const href = anchor.href;
    //             const containsKeyword = text.includes(keyword) || href.includes(keyword);
                
    //             return {
    //                 text,
    //                 href,
    //                 containsKeyword
    //             };
    //         });
    
    //         const keywordInAnchorsCount = anchorDetails.filter(anchor => anchor.containsKeyword).length;
    //         const totalAnchors = anchorDetails.length;
    //         const keywordInAnchorsPercentage = totalAnchors > 0 ? (keywordInAnchorsCount / totalAnchors) * 100 : 0;
            
    //         return { 
    //             keywordInAnchorsPercentage: keywordInAnchorsPercentage.toFixed(2), 
    //             anchorDetails 
    //         };
    //     }, keyword);
      
    //     await browser.close();
        
    //     return anchorTextAnalysis;
    // }
    
    // async getKeywordInImageAlts(url: string, keyword: string) {
    //     const browser = await puppeteer.launch();
    //     const page = await browser.newPage();

    //     await page.goto(url);
        
    //     const imageAltAnalysis = await page.evaluate((keyword) => {
    //         const images = document.querySelectorAll('img');
    //         const totalImages = images.length;
    //         let keywordInAltsCount = 0;
    //         let keywordInSrcCount = 0;
    
    //         const imageDetails = Array.from(images).map(img => {
    //             const alt = img.alt;
    //             const src = img.src;
    //             const containsKeywordInAlt = alt.includes(keyword);
    //             const containsKeywordInSrc = src.includes(keyword);
    
    //             if (containsKeywordInAlt) keywordInAltsCount++;
    //             if (containsKeywordInSrc) keywordInSrcCount++;
    
    //             return {
    //                 alt,
    //                 src,
    //                 containsKeywordInAlt,
    //                 containsKeywordInSrc
    //             };
    //         });
    
    //         const percentageInAlts = totalImages > 0 ? ((keywordInAltsCount / totalImages) * 100).toFixed(2) : '0.00';
    //         const percentageInSrcs = totalImages > 0 ? ((keywordInSrcCount / totalImages) * 100).toFixed(2) : '0.00';
    
    //         return { 
    //             totalImages,
    //             keywordInAltsCount,
    //             keywordInSrcCount,
    //             percentageInAlts,
    //             percentageInSrcs,
    //             imageDetails 
    //         };
    //     }, keyword);
        
    //     await browser.close();
        
    //     return imageAltAnalysis;
    // }

}