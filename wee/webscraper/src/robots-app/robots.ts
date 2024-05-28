import fetch from 'node-fetch';

export async function extractAllowedPaths(baseUrl: string): Promise<Set<string>> {
  const robotstxtUrl = `${baseUrl}/robots.txt`;

  const response = await fetch(robotstxtUrl);
  const robotstxt = await response.text();

  const lines = robotstxt.split('\n');
  const allowedPaths = new Set<string>();

  lines.forEach((line) => {
    if (line.startsWith('Allow:')) {
      const path = line.substring(6).trim();
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
