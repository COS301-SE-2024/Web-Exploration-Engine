import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class HttpService {
  async fetch(url: string): Promise<string> {
    const response = await axios.get(url);
    return response.data;
  }
}
