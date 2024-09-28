import puppeteer from 'puppeteer';
import axios from 'axios';
describe('making requests', () => {


jest.setTimeout(180000); // Set a global timeout of 3 minutes for all tests

describe('Scraper API Tests for all endpoints', () => {
  const baseUrl = 'https://capstone-wee.dns.net.za/api/scraper'; // Base URL for the scraper API
  const urlsToTest = [
    'https://wee-test-site-1.netlify.app/',
    'https://wee-test-site-2.netlify.app/'
  ];

  // Helper function to perform GET request and assert 200 status
  const performRequest = async (endpoint, url) => {
    try {

      const response = await axios.get(`${baseUrl}/${endpoint}?url=${encodeURIComponent(url)}`);
      expect(response.status).toBe(200);

    } catch (error) {
      console.error(`Error for ${endpoint} and URL: ${url}`, error.message);
      throw error;
    }
  };

  // Test for the /api/scraper/read-robots endpoint
  test.each(urlsToTest)('Read robots.txt for URL %s and expect status 200', async (url) => {
    await performRequest('read-robots', url); // Calling /read-robots endpoint
  });

  // Test for the /api/scraper/scrape-metadata endpoint
  test.each(urlsToTest)('Scrape metadata for URL %s and expect status 200', async (url) => {
    await performRequest('scrape-metadata', url); // Calling /scrape-metadata endpoint
  });

  // Test for the /api/scraper/classify-industry endpoint
  test.each(urlsToTest)('Classify industry for URL %s and expect status 200', async (url) => {
    await performRequest('classify-industry', url); // Calling /classify-industry endpoint
  });

  // Test for the /api/scraper/scrape-images endpoint
  test.each(urlsToTest)('Scrape images for URL %s and expect status 200', async (url) => {
    await performRequest('scrape-images', url); // Calling /scrape-images endpoint
  });

  // Test for the /api/scraper/scrape-logo endpoint
  test.each(urlsToTest)('Scrape logos for URL %s and expect status 200', async (url) => {
    await performRequest('scrape-logo', url); // Calling /scrape-logo endpoint
  });

  // Test for the /api/scraper/screenshot endpoint
  test.each(urlsToTest)('Capture screenshot for URL %s and expect status 200', async (url) => {
    await performRequest('screenshot', url); // Calling /screenshot endpoint
  });

  // Test for the /api/scraper/scrape-contact-info endpoint
  test.each(urlsToTest)('Scrape contact info for URL %s and expect status 200', async (url) => {
    await performRequest('scrape-contact-info', url); // Calling /scrape-contact-info endpoint
  });

  // Test for the /api/scraper/scrape-addresses endpoint
  test.each(urlsToTest)('Scrape addresses for URL %s and expect status 200', async (url) => {
    await performRequest('scrape-addresses', url); // Calling /scrape-addresses endpoint
  });

  // Test for the /api/scraper/seo-analysis endpoint
  test.each(urlsToTest)('SEO analysis for URL %s and expect status 200', async (url) => {
    await performRequest('seo-analysis', url); // Calling /seo-analysis endpoint
  });

  // // Test for the /api/scraper/ord-analysis endpoint
  // test.each(urlsToTest)('Keyword analysis for URL %s and expect status 200', async (url) => {
  //   await performRequest('keyword-analysis', url); // Calling /keyword-analysis endpoint
  // });

  // Test for the /api/scraper/scrape-news endpoint
  test.each(urlsToTest)('Scrape news for URL %s and expect status 200', async (url) => {
    await performRequest('scrape-news', url); // Calling /scrape-news endpoint
  });

  // Test for the /api/scraper/shareCount endpoint
  test.each(urlsToTest)('Social media share count for URL %s and expect status 200', async (url) => {
    await performRequest('shareCount', url); // Calling /shareCount endpoint
  });

  // Test for the /api/scraper/scrape-reviews endpoint
  test.each(urlsToTest)('Scrape reviews for URL %s and expect status 200', async (url) => {
    await performRequest('scrape-reviews', url); // Calling /scrape-reviews endpoint
  });

  // // Test for the /api/scraper/keyword-status endpoint
  // test.each(urlsToTest)('Keyword status for URL %s and expect status 200', async (url) => {
  //   await performRequest('keyword-status', url); // Calling /keyword-status endpoint
  // });

    // Test for the /api/scraper endpoint
    test.each(urlsToTest)('Scrape URL for %s and expect status 200', async (url) => {
      await performRequest('', url); // Calling base /api/scraper
    });
});

})

describe('Scraping Functionality', () => {
  let browser;
  let page;

  const testUrls = [
    'https://wee-test-site-1.netlify.app/',
    'https://wee-test-site-2.netlify.app/'
  ];

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true }); // Set to true for headless mode
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should load the home page correctly', async () => {
    await page.goto('https://capstone-wee.dns.net.za/');
    const titleExists = await page.evaluate(() => {
      return !!document.querySelector('h1') && document.querySelector('h1').textContent.includes('The Web Exploration Engine');
    });
    expect(titleExists).toBe(true);
  });

  it('should handle URL validation errors', async () => {
    await page.goto('https://capstone-wee.dns.net.za/');
    await page.type('[data-testid="scraping-textarea-home"]', 'invalid-url');
    await page.click('[data-testid="btn-start-scraping"]');

    const errorExists = await page.evaluate(() => {
      return !!document.body.textContent.match(/Please enter valid URLs/i);
    });
    expect(errorExists).toBe(true);
  });
});

describe('Scraping and Results Page', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    await page.goto('https://capstone-wee.dns.net.za/');
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should start scraping and display results', async () => {
    const urlsToScrape = 'https://wee-test-site-1.netlify.app/, https://wee-test-site-2.netlify.app/';
    const encodedUrls = encodeURIComponent(urlsToScrape);

    await page.type('[data-testid="scraping-textarea-home"]', urlsToScrape);
    await page.click('[data-testid="btn-start-scraping"]');

    await page.waitForSelector('[data-testid="loading-indicator"]', { hidden: true });

    try {
      // Wait for the buttons to be present
      await page.waitForSelector('button[data-testid^="btnView"]', { timeout: 60000 });
      console.log('Buttons found, proceeding...');
  } catch (error) {
      console.error('Error: Buttons not found within the timeout period.');
      const pageContent = await page.content();
      console.log('Current page content:', pageContent);
      throw error; // Rethrow to fail the test properly
  }

  // Find the button associated with the specific URL
  const buttonExists = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button[data-testid^="btnView"]'));
      return buttons.find(button => {
          const row = button.closest('tr'); // Get the closest row to the button
          const link = row.querySelector('a'); // Find the anchor in the same row
          return link && link.href === 'https://wee-test-site-1.netlify.app';
      });
  });

  // Click the found button
  if (buttonExists) {
      await buttonExists.click();
      console.log('Button clicked.');

      // Verify various sections on the Overview tab
      expect(await page.evaluate(() => !!document.body.textContent.match(/Welcome to Astro/i))).toBe(true);
      expect(await page.evaluate(() => !!document.body.textContent.match(/domain tags/i))).toBe(true);
      expect(await page.evaluate(() => !!document.body.textContent.match(/crawlable/i))).toBe(true);
      expect(await page.evaluate(() => !!document.body.textContent.match(/yes/i))).toBe(true);
      expect(await page.evaluate(() => !!document.body.textContent.match(/status/i))).toBe(true);
      expect(await page.evaluate(() => !!document.body.textContent.match(/live/i))).toBe(true);
      expect(await page.evaluate(() => !!document.body.textContent.match(/industry/i))).toBe(true);
      expect(await page.evaluate(() => !!document.body.textContent.match(/aerospace/i))).toBe(true);
      expect(await page.evaluate(() => !!document.body.textContent.match(/confidence score/i))).toBe(true);
      expect(await page.evaluate(() => !!document.body.textContent.match(/entertainment and media/i))).toBe(true);
      expect(await page.evaluate(() => !!document.body.textContent.match(/automotive/i))).toBe(true);
      expect(await page.evaluate(() => !!document.body.textContent.match(/telecommunications/i))).toBe(true);
      expect(await page.evaluate(() => !!document.body.textContent.match(/information technology/i))).toBe(true);
      expect(await page.evaluate(() => !!document.body.textContent.match(/fitness and wellness/i))).toBe(true);
      expect(await page.evaluate(() => !!document.body.textContent.match(/Address/i))).toBe(true);
      expect(await page.evaluate(() => !!document.body.textContent.match(/No address available/i))).toBe(true);
      expect(await page.evaluate(() => !!document.body.textContent.match(/Email/i))).toBe(true);
      expect(await page.evaluate(() => !!document.body.textContent.match(/No email address available/i))).toBe(true);
      expect(await page.evaluate(() => !!document.body.textContent.match(/Phone/i))).toBe(true);
      expect(await page.evaluate(() => !!document.body.textContent.match(/No phone numbers available/i))).toBe(true);
      expect(await page.evaluate(() => !!document.body.textContent.match(/Social Links/i))).toBe(true);
      expect(await page.evaluate(() => !!document.body.textContent.match(/No social links available/i))).toBe(true);

      // Ensure the media tab is clicked
      await page.click('[data-testid="tab-media"]');
      expect(await page.evaluate(() => !!document.body.textContent.match(/images/i))).toBe(true);
      expect(await page.evaluate(() => !!document.body.textContent.match(/No images available/i))).toBe(true);

      // Navigate to the SEO Analysis Tab
      await page.click('[data-testid="tab-seo"]');
      expect(await page.evaluate(() => !!document.body.textContent.match(/images/i))).toBe(true);
      expect(await page.evaluate(() => !!document.body.textContent.match(/internal linking/i))).toBe(true);
      expect(await page.evaluate(() => !!document.body.textContent.match(/headings/i))).toBe(true);
      expect(await page.evaluate(() => !!document.body.textContent.match(/meta/i))).toBe(true);
      expect(await page.evaluate(() => !!document.body.textContent.match(/title tags/i))).toBe(true);
      expect(await page.evaluate(() => !!document.body.textContent.match(/unique content/i))).toBe(true);

      // Check image statistics
      expect(await page.evaluate(() => document.body.textContent.includes('0 Total Images'))).toBe(true);
      expect(await page.evaluate(() => document.body.textContent.includes('0 Missing Alt. Text'))).toBe(true);
      expect(await page.evaluate(() => document.body.textContent.includes('0 Non-Optimized Images'))).toBe(true);

      // Check internal linking
      expect(await page.evaluate(() => document.body.textContent.includes('Total Links 6'))).toBe(true);
      expect(await page.evaluate(() => document.body.textContent.includes('Unique Links 5'))).toBe(true);

      // Headings section
      expect(await page.evaluate(() => document.body.textContent.includes('Headings Count 1'))).toBe(true);
      expect(await page.evaluate(() => document.body.textContent.includes('List of Headings'))).toBe(true);

      // Meta description section
      expect(await page.evaluate(() => document.body.textContent.includes('Meta Description'))).toBe(true);
      expect(await page.evaluate(() => document.body.textContent.includes('Title Tag Length 0'))).toBe(true);
      expect(await page.evaluate(() => document.body.textContent.includes('Recommendations'))).toBe(true);

      // Title Tags section
      expect(await page.evaluate(() => document.body.textContent.includes('Title Tags Metadata Description Length 17'))).toBe(true);
      expect(await page.evaluate(() => document.body.textContent.includes('Is URL in description? No'))).toBe(true);

      // Unique Content section
      expect(await page.evaluate(() => document.body.textContent.includes('Unique Content Text Length 59'))).toBe(true);
      expect(await page.evaluate(() => document.body.textContent.includes('Repeated words'))).toBe(true);

      // Technical Analysis section
      expect(await page.evaluate(() => document.body.textContent.includes('Technical Analysis Canonical Tags No'))).toBe(true);

      // Site Speed section
      expect(await page.evaluate(() => document.body.textContent.includes('Site Speed'))).toBe(true);

      // XML Sitemap Analysis section
      expect(await page.evaluate(() => document.body.textContent.includes('XML Sitemap Analysis No'))).toBe(true);

      // Mobile Friendliness section
      expect(await page.evaluate(() => document.body.textContent.includes('Mobile Friendliness Yes'))).toBe(true);

      // Indexibility Analysis section
      expect(await page.evaluate(() => document.body.textContent.includes('Indexibility Analysis Yes'))).toBe(true);

      // Structured Data Analysis section
      expect(await page.evaluate(() => document.body.textContent.includes('Structured Data Analysis Recommendations 0'))).toBe(true);
    } else {
      console.log('Link not found');
    }
  });

  // it('should check sentiment analysis tab', async () => {
  //   await page.click('[data-testid="tab-sentiment"]');
  //   expect(await page.evaluate(() => !!document.body.textContent.match(/sentiment/i))).toBe(true);
  //   expect(await page.evaluate(() => !!document.body.textContent.match(/Positive and Negative Words/i))).toBe(true);
  //   expect(await page.evaluate(() => !!document.body.textContent.match(/Emotions Confidence Score/i))).toBe(true);

  //   // Emotion confidence scores and percentages
  //   expect(await page.evaluate(() => document.body.textContent.includes('Anger 1.0'))).toBe(true);
  //   expect(await page.evaluate(() => document.body.textContent.includes('Joy 0.0'))).toBe(true);
  //   expect(await page.evaluate(() => document.body.textContent.includes('Sadness 0.0'))).toBe(true);
  //   expect(await page.evaluate(() => document.body.textContent.includes('Fear 0.0'))).toBe(true);
  //   expect(await page.evaluate(() => document.body.textContent.includes('Love 0.0'))).toBe(true);
  //   expect(await page.evaluate(() => document.body.textContent.includes('Surprise 0.0'))).toBe(true);
  //   expect(await page.evaluate(() => document.body.textContent.includes('Trust 0.0'))).toBe(true);
  //   expect(await page.evaluate(() => document.body.textContent.includes('Confusion 0.0'))).toBe(true);
  // });
});
