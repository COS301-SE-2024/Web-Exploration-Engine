// Function to check the status of the job
export async function checkJobStatus(url: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:3002/api';
    console.log('API URL:', apiUrl);
    const response = await fetch(`${apiUrl}/scraper/status?type=scrape&url=${encodeURIComponent(url)}`);
    if (!response.ok) {
      throw new Error(`Error fetching job status: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in checkJobStatus:', error);
    throw error;
  }
}

// Function to poll for the result of the scraping job
export async function pollForResult(url: string) {
  return new Promise((resolve, reject) => {
    const intervalId = setInterval(async () => {
      try {
        const jobData = await checkJobStatus(url);
        if (jobData.status === 'completed') {
          clearInterval(intervalId); // Stop polling once the job is completed
          resolve(jobData.result);
        } else if (jobData.status === 'error') {
          clearInterval(intervalId); // Stop polling if the job failed
          reject(new Error('Job failed'));
        } else {
          console.log('Job status:', jobData.status);
        }
      } catch (error) {
        clearInterval(intervalId); // Stop polling on error
        reject(error);
      }
    }, 5000); // Poll every 5 seconds
  });
}

// SEO Keyword
// Function to check the status of the keyword job
export async function checkKeywordJobStatus(url: string, keyword: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:3002/api';
    console.log('API KEYWORD URL:', apiUrl, url, keyword);

    const response = await fetch(`${apiUrl}/scraper/keyword-status?url=${encodeURIComponent(url)}&keyword=${encodeURIComponent(keyword)}`);
    if (!response.ok) {
      throw new Error(`Error fetching keyword job status: ${response.statusText}`);
    }
    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error in checkKeywordJobStatus:', error);
    throw error;
  }
}

// Function to poll for the result of the keyword job
export async function pollForKeyWordResult(url: string, keyword: string) {
  return new Promise((resolve, reject) => {
    const intervalId = setInterval(async () => {
      try {
        const jobData = await checkKeywordJobStatus(url, keyword);
        if (jobData.status === 'completed') {
          clearInterval(intervalId); // Stop polling once the job is completed
          resolve(jobData.result);
        } else if (jobData.status === 'error') {
          clearInterval(intervalId); // Stop polling if the job failed
          reject(new Error('Job failed'));
        } else {
          console.log('Job status:', jobData.status);
        }
      } catch (error) {
        clearInterval(intervalId); // Stop polling on error
        reject(error);
      }
    }, 5000); // Poll every 5 seconds
  });
}