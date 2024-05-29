import axios from 'axios';
import RobotsParser from 'robots-parser';

export async function isCrawlingAllowed(url: string): Promise<boolean> {
    const robotsUrl = new URL('/robots.txt', url).href;

    try {
        const response = await axios.get(robotsUrl);
        const robots = RobotsParser(robotsUrl, response.data);
        return robots.isAllowed(url, 'User-agent: *');
    } catch (error) {
        if (error.response && (error.response.status === 404 || error.response.status === 522)) {
            console.error(`Robots.txt not accessible. Status code: ${error.response.status}`);
            return false;
        } else {
            console.error(`An error occurred: ${error.message}`);
            return false;
        }
    }
}
