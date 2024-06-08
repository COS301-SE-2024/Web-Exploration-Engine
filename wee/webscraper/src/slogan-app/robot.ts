import { HttpException, HttpStatus } from '@nestjs/common';
import fetch from 'node-fetch';

/**
 * Extracts the allowed paths from robots.txt for a given URL.
 * @param url The URL for which to extract allowed paths.
 */
export async function extractAllowedPaths(url: string): Promise<Set<string>> {
  const domain = extractDomain(url);
  const robotstxtUrl = `${domain}/robots.txt`;

  try {
    const response = await fetch(robotstxtUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch robots.txt from ${robotstxtUrl}`);
    }
    const robotstxt = await response.text();
    if (!robotstxt) {
      throw new Error(`robots.txt content is empty for ${robotstxtUrl}`);
    }
    let isGlobalUserAgent = false;
    let rootDisallowed = false;

    const lines = robotstxt.split('\n');
    const allowedPaths = new Set<string>();

    lines.forEach((line) => {
      line = line.trim();
      if (line.startsWith('User-agent:')) {
        const userAgent = line.substring(11).trim();
        isGlobalUserAgent = userAgent === '*';
      } else if (line.startsWith('Disallow:') && isGlobalUserAgent) {
        const path = line.substring(9).trim();
        if (path === '/') {
          rootDisallowed = true;
        }
      } else if (line.startsWith('Allow:') && isGlobalUserAgent) {
        const path = line.substring(6).trim();
        if (path.startsWith('/')) {
          allowedPaths.add(path);
        }
      }
    });

    // If the root is not explicitly disallowed, add it to the allowed paths
    if (!rootDisallowed) {
      allowedPaths.add('/');
    }

    return allowedPaths;
  } catch (error) {
    throw new Error(`An error occurred while fetching allowed paths: ${error.message}`);
  }
}

/**
 * Extracts the domain from a given URL.
 * @param url The URL from which to extract the domain.
 * @returns The domain extracted from the URL.
 */
export function extractDomain(url: string): string {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.origin;
  } catch (error) {
    throw new Error('Invalid URL');
  }
}

/**
 * Checks if crawling is allowed for a given URL.
 * @param url The URL to check.
 * @returns A Promise that resolves to true if crawling is allowed, false otherwise.
 */
export async function isCrawlingAllowed(url: string): Promise<boolean> {
  try {
    const paths = await extractAllowedPaths(url);

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
