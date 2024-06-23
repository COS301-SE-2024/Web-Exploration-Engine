import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { isCrawlingAllowed } from './robot';
import * as puppeteer from 'puppeteer';

@Injectable()
export class SloganService {
    async scrapeSlogans(url: string): Promise<string[]> {
        if (!(await isCrawlingAllowed(url))) {
            throw new HttpException('Crawling not allowed or robots.txt not accessible.', HttpStatus.FORBIDDEN);
        }

        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(url);

            const metadata = await page.evaluate(() => {
                const getMetaTagContent = (name: string) => {
                    const element = document.querySelector(`meta[name='${name}']`) || document.querySelector(`meta[property='og:${name}']`);
                    return element ? element.getAttribute('content') : null;
                };

                return {
                    title: document.title,
                    description: getMetaTagContent('description'),
                    keywords: getMetaTagContent('keywords'),
                };
            });

            await browser.close();

            const slogans = [];
            if (metadata.title) {
                slogans.push(metadata.title);
            }
            
            return slogans.filter(slogan => slogan !== null && slogan !== undefined && slogan.trim() !== '');
        } catch (error) {
            throw new HttpException(`Failed to scrape slogans: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
