import { TIMEOUT } from "dns";

describe('Scraping Functionality', () => {
  const testUrls = 'https://wee-test-site-1.netlify.app/, https://wee-test-site-2.netlify.app/';

  it('should load the home page correctly', () => {
  cy.visit('/');
  cy.contains(/The Web Exploration Engine/i).should('exist');
  });

  it('should display the scraping interface', () => {
    cy.visit('/');
    cy.get('[data-testid="scraping-textarea-home"]').should('exist');
    cy.get('[data-testid="btn-start-scraping"]').should('exist');
  });
  it('should scrape multiple URLs and redirect to results page', () => {

    cy.visit('/');


    // Enter the test URLs into the textarea
    cy.get('[data-testid="scraping-textarea-home"]').type('https://wee-test-site-1.netlify.app/, https://wee-test-site-2.netlify.app/');

    // Intercept the scraping requests without stubbing them
    cy.intercept('GET', '**/api/scraper**').as('startScraping');


    cy.get('[data-testid="btn-start-scraping"]').click();

    // Wait for the scraping request to complete
    cy.wait('@startScraping');

    // Now check for the status or result page
    cy.url().should('include', '/scraperesults');
  });


  it('should handle URL validation errors', () => {
    cy.visit('/');

    // Enter an invalid URL
    cy.get('[data-testid="scraping-textarea-home"]').type('invalid-url');

    // Click the "Start scraping" button
    cy.get('[data-testid="btn-start-scraping"]').click();

    // Assert that an error message is displayed
    cy.contains(/Please enter valid URLs/i).should('exist');
  });
});

describe('Scraping and Results Page', () => {
  beforeEach(() => {
    // Visit the home page before each test
    cy.visit('/');
  });

  it('should start scraping and display results', () => {
    // Type the URLs into the textarea
    cy.get('[data-testid="scraping-textarea-home"]')
      .type('https://wee-test-site-1.netlify.app/, https://wee-test-site-2.netlify.app/');

    // Click the start scraping button
    cy.get('[data-testid="btn-start-scraping"]').click();

    // Wait for the loading indicator to disappear
    cy.get('[data-testid="loading-indicator"]', { timeout: 20000 }).should('not.exist');

    // Verify that the results page shows results for both sites
    cy.get('[data-testid="btnView0"]', { timeout: 60000 }).should('exist').should('be.visible');
    cy.get('[data-testid="btnView1"]', { timeout: 60000 }).should('exist').should('be.visible');

    // Click the first view button
    cy.get('[data-testid="btnView0"]').click();

    // Assert that we are on the result page
    cy.url({ timeout: 10000 }).should('include', '/results');


    // General Overview Tab
    cy.contains(/overview/i).should('exist');
    cy.contains(/seo/i).should('exist');
    cy.contains(/contact details/i).should('exist');


    // Domain Tags section
    cy.contains('Domain Tags').should('exist').and('be.visible');
    cy.contains('SCRAPING CATEGORY').should('exist').and('be.visible');
    cy.contains('Crawlable').should('exist').and('be.visible');
    cy.contains('Yes').should('exist').and('be.visible');
    cy.contains('Status').should('exist').and('be.visible');
    cy.contains('Live').should('exist').and('be.visible');
    cy.contains('Industry').should('exist').and('be.visible');
    // cy.contains('Aerospace').should('exist').and('be.visible');

    // Confidence scores for categories
    cy.contains('Confidence Score: 94.92%',TIMEOUT).should('exist').and('be.visible');
    cy.contains('Entertainment and Media').should('exist').and('be.visible');
    cy.contains('Confidence Score: 23.16%').should('exist').and('be.visible');
    cy.contains('Automotive').should('exist').and('be.visible');
    cy.contains('Confidence Score: 17.96%').should('exist').and('be.visible');
    cy.contains('Domain match').should('exist').and('be.visible');
    cy.contains('Telecommunications').should('exist').and('be.visible');
    cy.contains('Confidence Score: 63.98%').should('exist').and('be.visible');
    cy.contains('Information Technology').should('exist').and('be.visible');
    cy.contains('Confidence Score: 21.94%').should('exist').and('be.visible');
    cy.contains('Fitness and Wellness').should('exist').and('be.visible');
    cy.contains('Confidence Score: 16.85%').should('exist').and('be.visible');

    // Address and contact details section
    cy.contains('Address and contact details').should('exist').and('be.visible');
    cy.contains('CONTACT DETAILS').should('exist').and('be.visible');
    cy.contains('Address').should('exist').and('be.visible');
    cy.contains('No address available').should('exist').and('be.visible');

    cy.contains('Email').should('exist').and('be.visible');
    cy.contains('No email address available').should('exist').and('be.visible');

    cy.contains('Phone').should('exist').and('be.visible');
    cy.contains('No phone numbers available').should('exist').and('be.visible');

    cy.contains('Social Links').should('exist').and('be.visible');
    cy.contains('No social links available').should('exist').and('be.visible');

    // Verify and navigate to the SEO tab
    cy.get('[data-testid="tab-seo"]').should('exist').click();
    cy.contains(/media/i).should('exist');
    cy.contains(/seo/i).should('exist');
    cy.contains(/export/i).should('exist');

    // Ensure the media tab is clicked
    cy.get('[data-testid="tab-media"]').click();

    // Wait for the content to be visible

    // Verify presence of the text and image
    // cy.contains(/screenshot/i).should('exist');
    // cy.contains(/screenshot available/i, { timeout: 10000 }).should('exist');
    cy.contains(/images/i).should('exist');
    cy.contains(/No images available/i).should('exist');

    // Navigate to the SEO Analysis Tab
    cy.get('[data-testid="tab-seo"]').click();
    cy.contains(/images/i).should('exist');
    cy.contains(/internal linking/i).should('exist');
    cy.contains(/headings/i).should('exist');
    cy.contains(/meta/i).should('exist');
    cy.contains(/title tags/i).should('exist');
    cy.contains(/unique content/i).should('exist');

    cy.contains('Keyword Analysis').should('exist').and('be.visible');
    cy.contains('Enter keywords').should('exist').and('be.visible');
    cy.contains('On-Page Analysis').should('exist').and('be.visible');
    cy.contains('Images').should('exist').and('be.visible');

    // Check image statistics
    cy.contains('0').should('exist').and('be.visible'); // Total Images
    cy.contains('Total Images').should('exist').and('be.visible');
    cy.contains('0').should('exist').and('be.visible'); // Missing Alt. Text
    cy.contains('Missing Alt. Text').should('exist').and('be.visible');
    cy.contains('0').should('exist').and('be.visible'); // Non-Optimized Images
    cy.contains('Non-Optimized Images').should('exist').and('be.visible');

    // Check internal linking
    cy.contains('Internal Linking').should('exist').and('be.visible');
    cy.contains('6').should('exist').and('be.visible'); // Total Links
    cy.contains('Total Links').should('exist').and('be.visible');
    cy.contains('5').should('exist').and('be.visible'); // Unique Links
    cy.contains('Unique Links').should('exist').and('be.visible');


    // Headings section
    cy.contains('Headings').should('exist').and('be.visible');
    cy.contains('Count').should('exist').and('be.visible');
    cy.contains('1').should('exist').and('be.visible'); // Count
    cy.contains('List of Headings').should('exist').and('be.visible');

    // Meta description section
    cy.contains('Meta Description').should('exist').and('be.visible');
    cy.contains('Title Tag').should('exist').and('be.visible');
    cy.contains('Length').should('exist').and('be.visible');
    cy.contains('0').should('exist').and('be.visible'); // Length
    cy.contains('Recommendations').should('exist').and('be.visible');

    // Title Tags section
    cy.contains('Title Tags').should('exist').and('be.visible');
    cy.contains('Metadata Description').should('exist').and('be.visible');
    cy.contains('Length').should('exist').and('be.visible');
    cy.contains('17').should('exist').and('be.visible'); // Length
    cy.contains('Is URL in description?').should('exist').and('be.visible');
    cy.contains('No').should('exist').and('be.visible');

    // Unique Content section
    cy.contains('Unique Content').should('exist').and('be.visible');
    cy.contains('59').should('exist').and('be.visible'); // Text Length
    cy.contains('83.05%').should('exist').and('be.visible'); // Unique words
    cy.contains('Repeated words').should('exist').and('be.visible');
    cy.contains('netlify: 3').should('exist').and('be.visible');
    cy.contains('astro: 3').should('exist').and('be.visible');
    cy.contains('revalidation: 2').should('exist').and('be.visible');
    cy.contains('edge: 2').should('exist').and('be.visible');
    cy.contains('can: 2').should('exist').and('be.visible');
    cy.contains('only: 2').should('exist').and('be.visible');

    // Technical Analysis section
    cy.contains('Technical Analysis').should('exist').and('be.visible');
    cy.contains('Canonical Tags').should('exist').and('be.visible');
    cy.contains('No').should('exist').and('be.visible'); // No canonical tag present

    // Site Speed section
    cy.contains('Site Speed').should('exist').and('be.visible');
    cy.contains('0.67 seconds').should('exist').and('be.visible');

    // XML Sitemap Analysis section
    cy.contains('XML Sitemap Analysis').should('exist').and('be.visible');
    cy.contains('No').should('exist').and('be.visible');

    // Mobile Friendliness section
    cy.contains('Mobile Friendliness').should('exist').and('be.visible');
    cy.contains('Yes').should('exist').and('be.visible');

    // Indexibility Analysis section
    cy.contains('Indexibility Analysis').should('exist').and('be.visible');
    cy.contains('Yes').should('exist').and('be.visible');

    // Structured Data Analysis section
    cy.contains('Structured Data Analysis').should('exist').and('be.visible');
    cy.contains('0').should('exist').and('be.visible'); // Recommendations

    // Light House Analysis section
    cy.contains('Light House Analysis').should('exist').and('be.visible');
    cy.contains('100%').should('exist').and('be.visible'); // Performance
    cy.contains('92%').should('exist').and('be.visible'); // Accessibility
    cy.contains('100%').should('exist').and('be.visible'); // Best Practices

    // Navigate to the Sentimental Analysis Tab (if applicable)
    cy.get('[data-testid="tab-sentiment"]').click();
    cy.contains(/sentiment/i).should('exist');


    // Sentiment Analysis details
    cy.contains('Positive and Negative Words').should('exist').and('be.visible');
    cy.contains('Welcome to Astro.').should('exist').and('be.visible');
    cy.contains('Emotions Confidence Score').should('exist').and('be.visible');

    // Emotion confidence scores and percentages
    cy.contains('1%').should('exist').and('be.visible'); // Anger
    cy.contains('Anger').should('exist').and('be.visible');
    cy.contains('😡').should('exist').and('be.visible');

    cy.contains('0%').should('exist').and('be.visible'); // Disgust
    cy.contains('Disgust').should('exist').and('be.visible');
    cy.contains('🤢').should('exist').and('be.visible');

    cy.contains('1%').should('exist').and('be.visible'); // Fear
    cy.contains('Fear').should('exist').and('be.visible');
    cy.contains('😱').should('exist').and('be.visible');

    cy.contains('3%').should('exist').and('be.visible'); // Joy
    cy.contains('Joy').should('exist').and('be.visible');
    cy.contains('😊').should('exist').and('be.visible');

    cy.contains('87%').should('exist').and('be.visible'); // Neutral
    cy.contains('Neutral').should('exist').and('be.visible');
    cy.contains('😐').should('exist').and('be.visible');

    cy.contains('1%').should('exist').and('be.visible'); // Sadness
    cy.contains('Sadness').should('exist').and('be.visible');
    cy.contains('😢').should('exist').and('be.visible');

    cy.contains('7%').should('exist').and('be.visible'); // Surprise
    cy.contains('Surprise').should('exist').and('be.visible');
    cy.contains('😲').should('exist').and('be.visible');
  });
});

