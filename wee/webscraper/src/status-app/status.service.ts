import { Injectable } from '@nestjs/common';
import axios from 'axios';

/**
 * Service for handling website status related functionality.
 */
@Injectable()
export class StatusService {
    /**
     * Checks the status of a website at the given URL.
     * @param url The URL of the website to check.
     */
    async status(url: string): Promise<boolean> {
        try {
            const response = await axios.head(url);
            return response.status >= 200 && response.status < 300;
        } catch (error) {
            return false;
        }
    }

    /**
     * Calculates the percentage of live and parked URLs.
     * @param urls Array of URLs to check.
     */
    async calculatePercentages(urls: string[]): Promise<{ live: number; parked: number }> {
        const statuses = await Promise.all(urls.map(url => this.status(url)));
        const liveCount = statuses.filter(status => status).length;
        const parkedCount = statuses.length - liveCount;

        const livePercentage = (liveCount / statuses.length) * 100;
        const parkedPercentage = (parkedCount / statuses.length) * 100;

        return {
            live: livePercentage,
            parked: parkedPercentage,
        };
    }
}