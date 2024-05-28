import axios from 'axios';

export async function status(url: string): Promise<boolean> {
    try {
        const response = await axios.head(url);
        return response.status >= 200 && response.status < 300;
    } catch (error) {
        return false;
    }
}

