import fetch from 'node-fetch';

//returns all the paths user agent can scrape in a form of array
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

    const lines = robotstxt.split('\n');
    const allowedPaths = new Set<string>();

    lines.forEach((line) => {
      line = line.trim();
      if (line.startsWith('User-agent:')) {
        const userAgent = line.substring(11).trim();
        isGlobalUserAgent = userAgent === '*';
      } else if (line.startsWith('Allow:') && isGlobalUserAgent) {
        const path = line.substring(6).trim();

        if (path.startsWith('/')) {
          allowedPaths.add(path);
        }
      }
    });

    return allowedPaths;
  } catch (error) {
    throw new Error('An error occurred while fetching allowed paths');
  }
}

//cleans up the url to get the domain name
export function extractDomain(url: string): string {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.origin;
  } catch (error) {
    throw new Error('Invalid URL');
  }
}
