import { Injectable } from '@nestjs/common';
import { extractAllowedPaths } from './robots';

@Injectable()
export class RobotsService {
  async getAllowedPaths(baseUrl: string): Promise<Set<string>> {
    return extractAllowedPaths(baseUrl);
  }
}
