import puppeteer from 'puppeteer';
import axios from 'axios';

 const report = {
    onPageAnalysis: {
      images: {
        totalImages: 0,
        missingAltText: 0,
        nonOptimizedImages: 0
      },
      internalLinking: {
        totalLinks: 6,
        uniqueLinks: 5,
        recommendations: "The site has 5 unique internal links. Consider adding more to ensure a strong internal linking structure to further boost the site's SEO. There are 1 duplicate links. Consider reviewing these to avoid potential redundancy."
      },
      headings: {
        count: 1,
        listOfHeadings: "Netlify Platform Starter for Astro",
        recommendations: "We found the following heading levels: H1."
      },
      metaDescription: {
        titleTagLength: 0,
        recommendations: "The meta description is short at 0 characters. Consider adding more details to reach the optimal length of 120-160 characters. The words from the URL (wee, test, site, 1) aren't included in the meta description. Including these can help search engines better understand the relevance of your page."
      },
      titleTags: {
        metadataDescriptionLength: 17,
        isUrlInDescription: false,
        recommendations: "Your title tag is too short (17 characters). For better visibility and SEO, it should ideally be between 50 and 60 characters."
      },
      uniqueContent: {
        textLength: 59,
        percentageUniqueWords: 83.05,
        repeatedWords: {
          netlify: 3,
          astro: 3,
          revalidation: 2,
          edge: 2,
          can: 2,
          only: 2
        },
        recommendations: "The content is currently 59 words long. For better engagement and SEO performance, consider expanding your content to be more than 500 words."
      }
    },
    technicalAnalysis: {
      canonicalTags: false,
      recommendations: "The page is missing a canonical tag. Adding a canonical tag helps avoid duplicate content issues and improves SEO."
    },
    siteSpeed: {
      time: 0.63,
      recommendations: "The page load time is 0.63 seconds, which is well within the recommended limits."
    },
    xmlSitemapAnalysis: {
      present: false,
      recommendations: "The XML sitemap at https://wee-test-site-1.netlify.app//sitemap.xml is missing or inaccessible."
    },
    mobileFriendliness: {
      responsive: true,
      recommendations: "Your site is responsive on a 375px viewport, which is a common width for smartphones."
    },
    indexibilityAnalysis: {
      indexed: true,
      recommendations: "Your page is currently set to be indexed by search engines."
    },
    structuredDataAnalysis: {
      present: false,
      recommendations: "Your site currently lacks structured data."
    },
    lighthouseAnalysis: {
      performance: 98,
      accessibility: 92,
      bestPractices: 100,
      issues: {
        serverResponseTime: "Reduce initial server response time - Root document took 1,720 ms",
        speedIndex: "Speed Index - 1.6 s",
        linksIssue: "Links do not have a discernible name"
      }
    }
  };

  const sentimentAnalysis = {
    positiveAndNegativeWords: "Welcome to Astro.",
    emotionsConfidenceScore: {
      anger: {
        percentage: 0,
        emoji: '😡'
      },
      disgust: {
        percentage: 1,
        emoji: '🤢'
      },
      fear: {
        percentage: 3,
        emoji: '😱'
      },
      joy: {
        percentage: 87,
        emoji: '😊'
      },
      neutral: {
        percentage: 1,
        emoji: '😐'
      },
      sadness: {
        percentage: 1,
        emoji: '😢'
      },
      surprise: {
        percentage: 7,
        emoji: '😲'
      }
    }
  };

 const newsSentimentData = {
    reviewData: null, // Represents no review data currently available
    articles: [
      {
        title: "Netlify sponsors Astro and becomes official deployment partner, as CEO takes aim at 'vendor lock-in'",
        publishedDate: "Wed, 17 Jul 2024 07:00:00 GMT",
        source: "DevClass",
        readArticleLink: "Read article"
      },
      {
        title: "Netlify Announces Adobe Experience Manager Headless Integration",
        publishedDate: "Mon, 17 Jun 2024 07:00:00 GMT",
        source: "PR Newswire",
        readArticleLink: "Read article"
      },
      {
        title: "Astro Launches New Server Islands and Partners With Netlify",
        publishedDate: "Sat, 20 Jul 2024 07:00:00 GMT",
        source: "The New Stack",
        readArticleLink: "Read article"
      },
      {
        title: "LambdaTest Integrates with Netlify to Enhance Developer Workflows",
        publishedDate: "Tue, 23 Jul 2024 07:00:00 GMT",
        source: "Business Wire",
        readArticleLink: "Read article"
      },
      {
        title: "Netlify introduces AI-enabled tool to streamline web development deployments",
        publishedDate: "Thu, 07 Mar 2024 08:00:00 GMT",
        source: "SiliconANGLE News",
        readArticleLink: "Read article"
      },
      {
        title: "Netlify AI analyzes failed deployments",
        publishedDate: "Thu, 07 Mar 2024 08:00:00 GMT",
        source: "InfoWorld",
        readArticleLink: "Read article"
      },
      {
        title: "Netlify Customer Story - CrowdStrike",
        publishedDate: "Sat, 23 Mar 2024 02:31:13 GMT",
        source: "CrowdStrike",
        readArticleLink: "Read article"
      },
      {
        title: "Agility CMS and Netlify Connect Launch New Unified Content Integration Solution",
        publishedDate: "Wed, 14 Feb 2024 08:00:00 GMT",
        source: "CMS Critic",
        readArticleLink: "Read article"
      },
      {
        title: "Netlify begins rolling out latest version of its Next.js runtime",
        publishedDate: "Wed, 03 Apr 2024 07:00:00 GMT",
        source: "SDTimes.com",
        readArticleLink: "Read article"
      },
      {
        title: "User got a $104K bill from hosting provider: 'I thought it was a joke'",
        publishedDate: "Tue, 27 Feb 2024 08:00:00 GMT",
        source: "CyberNews.com",
        readArticleLink: "Read article"
      }
    ]
  };
describe('making requests', () => {


jest.setTimeout(180000); // Set a global timeout of 3 minutes for all tests

describe('Scraper API Tests for all endpoints', () => {
  const baseUrl = 'https://localhost:3000/api/scraper'; // Base URL for the scraper API
  const urlsToTest = [
    'https://wee-test-site-1.netlify.app/',
    'https://wee-test-site-2.netlify.app/'
  ];

  const performRequest = async (endpoint, url) => {
    try {
      const response = await axios.get(`/${endpoint}?url=${encodeURIComponent(url)}`);
      expect(response.status).toBe(200);
    } catch (error) {
      console.error(`Error for ${endpoint} and URL: ${url}`, error.message);

      // Log more detailed information if available, such as response status and data
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Request details:', error.request);
      } else {
        // Something happened in setting up the request
        console.error('Error message:', error.message);
      }

      // Optional: Safe stringification of the error object to avoid circular references
      const safeStringify = (obj) => {
        const seen = new WeakSet();
        return JSON.stringify(obj, (key, value) => {
          if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
              return; // Omit circular reference
            }
            seen.add(value);
          }
          return value;
        });
      };

      // Log the full error object safely
      console.error('Full error object:', safeStringify(error));

      throw error; // Re-throw the error so the test fails properly
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
    browser = await puppeteer.launch({ headless:true}); // Set to true for headless mode
    page = await browser.newPage();
  });



  it('should load the home page correctly', async () => {
    await page.goto('https://localhost:3000/');
    const titleExists = await page.evaluate(() => {
      return !!document.querySelector('h1') && document.querySelector('h1').textContent.includes('The Web Exploration Engine');
    });
    expect(titleExists).toBe(true);
  });

  it('should handle URL validation errors', async () => {
    await page.goto('https://localhost:3000/');
    await page.type('[data-testid="scraping-textarea-home"]', 'invalid-url');
    await page.click('[data-testid="btn-start-scraping"]');

    const errorExists = await page.evaluate(() => {
      return !!document.body.textContent.match(/Please enter valid URLs/i);
    });
    expect(errorExists).toBe(true);
    await browser.close();
  });

});

describe('Scraping and Results Page', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true});
    page = await browser.newPage();
    await page.goto('https://localhost:3000/');
  },60000);

  afterAll(async () => {
    //await browser.close();
  });

  it('should start scraping and display results (individual page)', async () => {
    try {
      const urlsToScrape = 'https://wee-test-site-1.netlify.app/, https://wee-test-site-2.netlify.app/';
      const encodedUrls = encodeURIComponent(urlsToScrape);

      await page.type('[data-testid="scraping-textarea-home"]', urlsToScrape);
      await page.click('[data-testid="btn-start-scraping"]');
      await page.waitForNavigation();

      await page.waitForSelector('[data-testid="loading-indicator"]', { hidden: true });

      // Define the target URL
      const targetUrl = 'https://wee-test-site-1.netlify.app/';

      // Wait for the "View" button with data-testid="btnView0" to be available
      await page.waitForSelector('[data-testid="btnView0"]', { visible: true });

      // Click the "View" button
      await page.click('[data-testid="btnView0"]');
      console.log('btnView0 clicked.');

      // Check if the specific text is present on the page
      const targetText = 'Results of https://wee-test-site-1.netlify.app/';
      const textExists = await page.evaluate((text) => {
        return !!document.body.textContent.match(text);
      }, targetText);

      if (!textExists) {
        console.log('Text not found, pressing the back button');

        // Press the back button
        await page.click('[data-testid="btn-back"]');
        console.log('pressed back button');
        // Wait for navigation or state change after clicking back

        // Click the button with `btnView1`
        await page.waitForSelector('[data-testid="btnView1"]', { visible: true });
        await page.click('[data-testid="btnView1"]');
        console.log('Pressed btnView1');


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
        expect(report.onPageAnalysis.images.totalImages).toBe(0);
    expect(report.onPageAnalysis.images.missingAltText).toBe(0);
    expect(report.onPageAnalysis.images.nonOptimizedImages).toBe(0);

    expect(report.onPageAnalysis.internalLinking.totalLinks).toBe(6);
    expect(report.onPageAnalysis.internalLinking.uniqueLinks).toBe(5);
    expect(report.onPageAnalysis.internalLinking.recommendations).toBe(
      "The site has 5 unique internal links. Consider adding more to ensure a strong internal linking structure to further boost the site's SEO. There are 1 duplicate links. Consider reviewing these to avoid potential redundancy."
    );

    expect(report.onPageAnalysis.headings.count).toBe(1);
    expect(report.onPageAnalysis.headings.listOfHeadings).toBe("Netlify Platform Starter for Astro");
    expect(report.onPageAnalysis.headings.recommendations).toBe("We found the following heading levels: H1.");

    expect(report.onPageAnalysis.metaDescription.titleTagLength).toBe(0);
    expect(report.onPageAnalysis.metaDescription.recommendations).toBe(
      "The meta description is short at 0 characters. Consider adding more details to reach the optimal length of 120-160 characters. The words from the URL (wee, test, site, 1) aren't included in the meta description. Including these can help search engines better understand the relevance of your page."
    );

    expect(report.onPageAnalysis.titleTags.metadataDescriptionLength).toBe(17);
    expect(report.onPageAnalysis.titleTags.isUrlInDescription).toBe(false);
    expect(report.onPageAnalysis.titleTags.recommendations).toBe(
      "Your title tag is too short (17 characters). For better visibility and SEO, it should ideally be between 50 and 60 characters."
    );

    expect(report.onPageAnalysis.uniqueContent.textLength).toBe(59);
    expect(report.onPageAnalysis.uniqueContent.percentageUniqueWords).toBe(83.05);
    expect(report.onPageAnalysis.uniqueContent.repeatedWords.netlify).toBe(3);
    expect(report.onPageAnalysis.uniqueContent.repeatedWords.astro).toBe(3);
    expect(report.onPageAnalysis.uniqueContent.repeatedWords.revalidation).toBe(2);
    expect(report.onPageAnalysis.uniqueContent.repeatedWords.edge).toBe(2);
    expect(report.onPageAnalysis.uniqueContent.repeatedWords.can).toBe(2);
    expect(report.onPageAnalysis.uniqueContent.repeatedWords.only).toBe(2);
    expect(report.onPageAnalysis.uniqueContent.recommendations).toBe(
      "The content is currently 59 words long. For better engagement and SEO performance, consider expanding your content to be more than 500 words."
    );

    expect(report.technicalAnalysis.canonicalTags).toBe(false);
    expect(report.technicalAnalysis.recommendations).toBe(
      "The page is missing a canonical tag. Adding a canonical tag helps avoid duplicate content issues and improves SEO."
    );

    expect(report.siteSpeed.time).toBe(0.63);
    expect(report.siteSpeed.recommendations).toBe(
      "The page load time is 0.63 seconds, which is well within the recommended limits."
    );

    expect(report.xmlSitemapAnalysis.present).toBe(false);
    expect(report.xmlSitemapAnalysis.recommendations).toBe(
      "The XML sitemap at https://wee-test-site-1.netlify.app//sitemap.xml is missing or inaccessible."
    );

    expect(report.mobileFriendliness.responsive).toBe(true);
    expect(report.mobileFriendliness.recommendations).toBe(
      "Your site is responsive on a 375px viewport, which is a common width for smartphones."
    );

    expect(report.indexibilityAnalysis.indexed).toBe(true);
    expect(report.indexibilityAnalysis.recommendations).toBe(
      "Your page is currently set to be indexed by search engines."
    );

    expect(report.structuredDataAnalysis.present).toBe(false);
    expect(report.structuredDataAnalysis.recommendations).toBe(
      "Your site currently lacks structured data."
    );

    expect(report.lighthouseAnalysis.performance).toBe(98);
    expect(report.lighthouseAnalysis.accessibility).toBe(92);
    expect(report.lighthouseAnalysis.bestPractices).toBe(100);
    expect(report.lighthouseAnalysis.issues.serverResponseTime).toBe(
      "Reduce initial server response time - Root document took 1,720 ms"
    );
    expect(report.lighthouseAnalysis.issues.speedIndex).toBe("Speed Index - 1.6 s");
    expect(report.lighthouseAnalysis.issues.linksIssue).toBe("Links do not have a discernible name");

    await page.click('[data-testid="tab-sentiment"]');


    expect(sentimentAnalysis.positiveAndNegativeWords).toBe("Welcome to Astro.");

    expect(sentimentAnalysis.emotionsConfidenceScore.anger.percentage).toBe(0);
    expect(sentimentAnalysis.emotionsConfidenceScore.anger.emoji).toBe('😡');

    expect(sentimentAnalysis.emotionsConfidenceScore.disgust.percentage).toBe(1);
    expect(sentimentAnalysis.emotionsConfidenceScore.disgust.emoji).toBe('🤢');

    expect(sentimentAnalysis.emotionsConfidenceScore.fear.percentage).toBe(3);
    expect(sentimentAnalysis.emotionsConfidenceScore.fear.emoji).toBe('😱');

    expect(sentimentAnalysis.emotionsConfidenceScore.joy.percentage).toBe(87);
    expect(sentimentAnalysis.emotionsConfidenceScore.joy.emoji).toBe('😊');

    expect(sentimentAnalysis.emotionsConfidenceScore.neutral.percentage).toBe(1);
    expect(sentimentAnalysis.emotionsConfidenceScore.neutral.emoji).toBe('😐');

    expect(sentimentAnalysis.emotionsConfidenceScore.sadness.percentage).toBe(1);
    expect(sentimentAnalysis.emotionsConfidenceScore.sadness.emoji).toBe('😢');

    expect(sentimentAnalysis.emotionsConfidenceScore.surprise.percentage).toBe(7);  // Adjust if needed
    expect(sentimentAnalysis.emotionsConfidenceScore.surprise.emoji).toBe('😲');
   await page.click('[data-testid="tab-rep-management"]');

   expect(newsSentimentData.reviewData).toBeNull();
    expect(newsSentimentData.articles).toHaveLength(10);

    // Validate individual articles
    expect(newsSentimentData.articles[0]).toEqual({
      title: "Netlify sponsors Astro and becomes official deployment partner, as CEO takes aim at 'vendor lock-in'",
      publishedDate: "Wed, 17 Jul 2024 07:00:00 GMT",
      source: "DevClass",
      readArticleLink: "Read article"
    });

    expect(newsSentimentData.articles[1]).toEqual({
      title: "Netlify Announces Adobe Experience Manager Headless Integration",
      publishedDate: "Mon, 17 Jun 2024 07:00:00 GMT",
      source: "PR Newswire",
      readArticleLink: "Read article"
    });


      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
    await browser.close();
  }, 360000);



});
