// Function to check the status of the job
export async function checkJobStatus(url: string) {
  try {
    const apiUrl = process.env.API_URL || 'http://localhost:3002/api';
    const response = await fetch(`${apiUrl}/scraper/status/scrape/${encodeURIComponent(url)}`);
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