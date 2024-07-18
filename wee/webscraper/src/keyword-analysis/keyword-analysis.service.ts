import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { URL } from 'url';

@Injectable()
export class KeywordAnalysisService {
    async getKeywordRanking(url, keyword) {
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
            ranking: ranking > 0 ? ranking : 'Not found',
            results: results//bring back results--> we can maybe give list of these if there is no ranking of the url found.
        };
    }
}
