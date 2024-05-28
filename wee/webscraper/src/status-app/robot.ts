import axios from 'axios';
import RobotsParser from 'robots-parser';

export async function isCrawlingAllowed(url: string): Promise<boolean> {
    const robotsUrl = new URL('/robots.txt', url).href;
    const response = await axios.get(robotsUrl);
    const robots =  RobotsParser(robotsUrl, response.data);
    return robots.isAllowed(url, 'User-agent: *');
}
