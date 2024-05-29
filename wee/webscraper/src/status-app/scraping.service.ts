import { Injectable } from '@nestjs/common';
import axios from 'axios';
@Injectable()
export class ScrapingService {
    async status(url: string): Promise<boolean> {
        try {
            const response = await axios.head(url);
            return response.status >= 200 && response.status < 300;
        } catch (error) {
            return false;
        }
    }
}