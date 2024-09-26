/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger } from '@nestjs/common';
import { ErrorResponse } from '../models/ServiceModels';
import { RobotsResponse } from '../models/ServiceModels';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { performance } from 'perf_hooks';
import logger from '../../logging/webscraperlogger';
import fetch from 'node-fetch';

const serviceName = "[RobotsService]";
@Injectable()
export class RobotsService {
  // Returns all the paths user agent can scrape in the form of an array
  async extractAllowedPaths(
    baseUrl: string
  ): Promise<{ allowedPaths: string[]; disallowedPaths: string[] }> {

    logger.debug(`${serviceName}`);
    const start = performance.now();

    // Extract base URL
    const domain = this.extractDomain(baseUrl);
    // Construct the URL for the robots.txt file
    const robotstxtUrl = `${domain}/robots.txt`;

    try {
      const response = await fetch(robotstxtUrl);

      // Check if website has a robots.txt file -- if not, return an empty set
      if (response.status === 404) {
        //console.warn(`robots.txt does not exist for ${robotstxtUrl}`);
        logger.warn(serviceName,` robots.txt does not exist for ${robotstxtUrl}`);
      // Performance Logging
      const duration = performance.now() - start;
      logger.info(serviceName,'duration',duration,'url',robotstxtUrl);

        return {
          allowedPaths: [],
          disallowedPaths: [],
        };
      }

      // Check if error occured
      if (!response.ok) {
        logger.error(serviceName,
          `An error occurred while fetching robots.txt from ${robotstxtUrl}`,robotstxtUrl
        );

        throw new Error(
          `An error occurred while fetching robots.txt from ${robotstxtUrl}`
        );
      }

      // Parse the robots.txt file
      const robotstxt = await response.text();
      //console.warn(`obtained robot txt file ${robotstxtUrl}`);


      if (!robotstxt) {
        //console.warn(`robots.txt content is empty for ${robotstxtUrl}`);
        logger.warn(serviceName,`robots.txt content is empty for ${robotstxtUrl} ${RobotsService}`);
      // Performance Logging
      const duration = performance.now() - start;
      logger.info(serviceName,'duration',duration,'url',robotstxtUrl);
        
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
        } else if (
          (line.startsWith('Disallow:') || line.startsWith('disallow:')) &&
          isGlobalUserAgent
        ) {
          const path = line.substring(9).trim();
          if (path.startsWith('/')) {
            disallowedPaths.add(path);
          }
        } else if (
          (line.startsWith('Allow:') || line.startsWith('allow:')) &&
          isGlobalUserAgent
        ) {
          const path = line.substring(6).trim();
          if (path.startsWith('/')) {
            allowedPaths.add(path);
          }
        }
      });
      // Performance Logging
      const duration = performance.now() - start;
      logger.info(serviceName,'duration',duration,'url',robotstxtUrl);

      return {
        allowedPaths: Array.from(allowedPaths),
        disallowedPaths: Array.from(disallowedPaths),
      };
    } catch (error) {
      throw new Error('An error occurred while interpreting robots.txt file');
    }
  }

  extractDomain(url: string): string {
    try {
      const parsedUrl = new URL(url);
      //logger.debug(`${serviceName} Parse url ${parsedUrl}`);

      return parsedUrl.origin;
    } catch (error) {
      logger.error(serviceName,` Extracting Domain Error ${error}`);
      throw new Error('Invalid URL');
    }
  }

  isCrawlingAllowed(
    url: string,
    disallowedPaths: string[],
    allowedPaths: string[]
  ): boolean {
    try {
      const urlObject = new URL(url);
      const path = urlObject.pathname;

      // Function to convert paths with wildcards to regex
      const pathToRegex = (path: string) => {
        const escapedPath = path
          .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
          .replace(/\*/g, '.*');
        return new RegExp(`^${escapedPath}$`);
      };

      // Check against disallowed paths
      for (const disallowedPath of disallowedPaths) {
        const regex = pathToRegex(disallowedPath);
        if (regex.test(path)) {
          return false;
        }
      }

      // Check against allowed paths
      for (const allowedPath of allowedPaths) {
        const regex = pathToRegex(allowedPath);
        if (regex.test(path)) {
          return true;
        }
      }

      // if not allowed or disallowed, default to allowed
      return true;
    } catch (error) {
      if (error.message.includes('Invalid URL')) {
        throw new Error(`Invalid URL: ${url}`);
      } else {
        throw new Error(
          `An error occurred while checking if crawling is allowed: ${error.message}`
        );
      }
    }
  }

  isRootPathAllowed(disallowedPaths: Set<string>): boolean {
    return !disallowedPaths.has('/');
  }

  async readRobotsFile(url: string): Promise<RobotsResponse | ErrorResponse> {
    const start = performance.now();
    // Check if the URL parameter is provided
    if (!url) {
      return {
        errorStatus: 400,
        errorCode: '400 Bad Request',
        errorMessage: 'URL parameter is required',
      } as ErrorResponse;
    }

    try {
      const baseUrl = this.extractDomain(url);
      const { allowedPaths, disallowedPaths } = await this.extractAllowedPaths(
        baseUrl
      );
      const isBaseUrlAllowed = this.isRootPathAllowed(new Set(disallowedPaths));
      const isUrlScrapable = this.isCrawlingAllowed(
        url,
        disallowedPaths,
        allowedPaths
      );

      // Performance Logging
      const duration = performance.now() - start;
      console.log(`Duration of ${serviceName} : ${duration}, for url: ${baseUrl}`);
      return {
        baseUrl,
        allowedPaths,
        disallowedPaths,
        isUrlScrapable,
        isBaseUrlAllowed,
      } as RobotsResponse;
    } catch (error) {
      // return error response if error encountered
      logger.error(serviceName,` 500 Internal Server Error ${error.message}`)
      return {
        errorStatus: 500,
        errorCode: '500 Internal Server Error',
        errorMessage: error.message,
      } as ErrorResponse;
    }
  }
}
