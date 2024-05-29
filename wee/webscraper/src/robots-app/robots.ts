import fetch from 'node-fetch';

//retruns all the paths user agent can scrape in a form of array
export async function extractAllowedPaths(url: string): Promise<Set<string>> {
  const domain = extractDomain(url);
  const robotstxtUrl = `${domain}/robots.txt`;

  const response = await fetch(robotstxtUrl);
  const robotstxt = await response.text();

  let isGlobalUserAgent = false;

  const lines = robotstxt.split('\n');
  const allowedPaths = new Set<string>();

  lines.forEach((line) => {
    line = line.trim();
    if (line.startsWith('User-agent:')) {
      const userAgent = line.substring(11).trim();
      isGlobalUserAgent = userAgent === '*';
    } else if (line.startsWith('Allow:') && isGlobalUserAgent) {
      let path = line.substring(6).trim();
      if (path.includes('*')) {
        // Remove everything after the asterisk (*) - handle this differently in the future
        path = path.substring(0, path.indexOf('*'));
      }
      if (path.startsWith('/')) {
        allowedPaths.add(path);
      }
    }
  });

  return allowedPaths;
}

//cleans up the url to get the domain name 
function extractDomain(url: string): string {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.origin;
  } catch (error) {
    console.error('Invalid URL:', error);
    throw new Error('Invalid URL');
  }
}

