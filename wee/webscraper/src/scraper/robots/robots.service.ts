import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ErrorResponse } from '../models/ServiceModels';
import { RobotsResponse } from '../models/ServiceModels';

import fetch from 'node-fetch';


@Injectable()
export class RobotsService {
  // Returns all the paths user agent can scrape in the form of an array
  async extractAllowedPaths(baseUrl: string): 
  Promise<{allowedPaths: string[], disallowedPaths: string[]}> {
    // Extract base URL
    const domain = this.extractDomain(baseUrl);
    // Construct the URL for the robots.txt file
    const robotstxtUrl = `${domain}/robots.txt`;

    try {
      const response = await fetch(robotstxtUrl);

      // Check if website has a robots.txt file -- if not, return an empty set
      if (response.status === 404) {
        console.warn(`robots.txt does not exist for ${robotstxtUrl}`);
        return {
          allowedPaths: [],
          disallowedPaths: [],
        };
      }

      // Check if error occured
      if (!response.ok) {
        throw new Error(`An error occurred while fetching robots.txt from ${robotstxtUrl}`);
      }

      // Parse the robots.txt file
      const robotstxt = await response.text();
      if (!robotstxt) {
        console.warn(`robots.txt content is empty for ${robotstxtUrl}`);
        return {
          allowedPaths: [],
          disallowedPaths: [],
        };
      }

      let isGlobalUserAgent = false;

      const lines = robotstxt.split('\n');
      const allowedPaths = new Set<string>();
      const disallowedPaths = new Set<string>();

      lines.forEach((line) => {
        line = line.trim();
        if (line.startsWith('User-agent:')) {
          const userAgent = line.substring(11).trim();
          isGlobalUserAgent = userAgent === '*';
        } else if ((line.startsWith('Disallow:') || line.startsWith('disallow:')) && isGlobalUserAgent) {
          const path = line.substring(9).trim();
          if (path.startsWith('/')) {
            disallowedPaths.add(path);
          }
        } else if ((line.startsWith('Allow:') || line.startsWith('allow:')) && isGlobalUserAgent) {
          const path = line.substring(6).trim();
          if (path.startsWith('/')) {
            allowedPaths.add(path);
          }
        }
      });

      return {allowedPaths: Array.from(allowedPaths), disallowedPaths: Array.from(disallowedPaths)};
    } catch (error) {
      throw new Error('An error occurred while interpreting robots.txt file');
    }
  }

  extractDomain(url: string): string {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.origin;
    } catch (error) {
      throw new Error('Invalid URL');
    }
  }

  async isCrawlingAllowed(url: string, paths: Set<string>): Promise<boolean> {
    try {
  
      const urlObject = new URL(url);
      const path = urlObject.pathname;
  
      // Direct match for the path
      if (paths.has(path) || paths.has('/')) {
        return true;
      }
  
      // Match with wildcards
      for (const allowedPath of paths) {
        const escapedPath = allowedPath.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
        const regex = new RegExp(`^${escapedPath}$`);
  
        if (regex.test(path)) {
          return true;
        }
      }
  
      return false;
    } catch (error) {
      if (error.message.includes("Failed to fetch")) {
        throw new HttpException(`Failed to fetch robots.txt for URL: ${url}`, HttpStatus.INTERNAL_SERVER_ERROR);
      } else if (error.message.includes("Invalid URL")) {
        throw new HttpException(`Invalid URL: ${url}`, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException(`An error occurred while checking if crawling is allowed: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  isRootPathAllowed(disallowedPaths: Set<string>): boolean {
    return !disallowedPaths.has('/');
  }

  async readRobotsFile(url: string): Promise<RobotsResponse | ErrorResponse> {
    // Check if the URL parameter is provided
    if (!url) {
      return {
        errorStatus: 400,
        errorCode: '400 Bad Request',
        errorMessage: 'URL parameter is required'
      } as ErrorResponse;
    }

    try {
      const baseUrl = this.extractDomain(url);
      const {allowedPaths, disallowedPaths} = await this.extractAllowedPaths(baseUrl);
      const isBaseUrlAllowed = this.isRootPathAllowed(new Set(disallowedPaths));
      return {
        baseUrl,
        allowedPaths,
        disallowedPaths,
        isBaseUrlAllowed,
      } as RobotsResponse;
    } catch (error) {
      // return error response if error encountered
      return {
        errorStatus: 500,
        errorCode: '500 Internal Server Error',
        errorMessage: error.message,
      } as ErrorResponse;
    }
  }

}