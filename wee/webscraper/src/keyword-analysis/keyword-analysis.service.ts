import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { URL } from 'url';

@Injectable()
export class KeywordAnalysisService {
    async getKeywordRanking(url: string, keyword: string) {
        // Normalize the URL
        const normalizedUrl = new URL(url).hostname;

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        // Perform a Google search for the keyword
        await page.goto(`https://www.google.com/search?q=${encodeURIComponent(keyword)}`);

        const results = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('div.g')).map(result => {
                const titleElement = result.querySelector('h3');
                const linkElement = result.querySelector('a');
                return {
                    title: titleElement ? titleElement.innerText : '',
                    link: linkElement ? linkElement.href : ''
                };
            });
        });
      
        // Find the ranking of the target URL
        const ranking = results.findIndex(result => {
            const resultUrl = new URL(result.link).hostname;
            return resultUrl.includes(normalizedUrl);
        }) + 1;
      
        await browser.close();
        
        return {
            ranking: ranking > 0 ? ranking : '',
            results: results
        };
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