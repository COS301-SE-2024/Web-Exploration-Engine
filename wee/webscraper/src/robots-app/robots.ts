import fetch from 'node-fetch';

export async function extractAllowedPaths(url: string): Promise<Set<string>> {

  const domain = extractDomain(url);
  const robotstxtUrl = `${domain}/robots.txt`;

  const response = await fetch(robotstxtUrl);
  const robotstxt = await response.text();

  const lines = robotstxt.split('\n');
  const allowedPaths = new Set<string>();

  lines.forEach((line) => {
    if (line.startsWith('Allow:')) {
      let path = line.substring(6).trim();
      if (path.includes('*')) {
        // Remove everything after the asterisk (*) also handle this differently in the future
        path = path.substring(0, path.indexOf('*'));
    }
      if (path.startsWith('/')) {
        allowedPaths.add(path);
      }
    }
  });

  console.log('Extracted Paths:');
  allowedPaths.forEach((path) => {
    console.log(path);
  });

  return allowedPaths;
}

function extractDomain(url: string): string {
  try {
      const parsedUrl = new URL(url);
      return parsedUrl.origin;
  } catch (error) {
      console.error('Invalid URL:', error);
      throw new Error('Invalid URL');
  }
}
