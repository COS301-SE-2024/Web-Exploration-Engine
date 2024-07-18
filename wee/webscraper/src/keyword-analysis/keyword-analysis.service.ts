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
        
        // Extract search results
        const results = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('div.g')).map(result => ({
                title: result.querySelector('h3')?.innerText,
                link: result.querySelector('a')?.href,
            }));
        });
      
        // Find the ranking of the target URL
        const ranking = results.findIndex(result => {
            const resultUrl = new URL(result.link).hostname;
            return resultUrl.includes(normalizedUrl);
        }) + 1;
      
        await browser.close();
        
        return {
            ranking: ranking > 0 ? ranking : '',
            results: results // Bring back results; we can maybe give a list of these if there is no ranking of the URL found.
        };
    }

    async getKeywordDensity(url: string, keyword: string) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        // Navigate to the target URL
        await page.goto(url);
        
        // Extract page content and calculate keyword density
        const keywordDensity = await page.evaluate((keyword) => {
            const bodyText = document.body.innerText;
            const keywordCount = (bodyText.match(new RegExp(keyword, 'gi')) || []).length;
            const totalWords = bodyText.split(/\s+/).length;
            const density = (keywordCount / totalWords) * 100;
            return {
                keywordCount,
                totalWords,
                density: density.toFixed(2)
            };
        }, keyword);
      
        await browser.close();
        
        return keywordDensity;
    }
    
}