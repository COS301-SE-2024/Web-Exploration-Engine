import { Injectable } from '@nestjs/common';
import axios from 'axios';
/**
 * Service for handling website status related functionality.
 */
@Injectable()
export class ScrapingService {
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
}