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
    // Visit the homepage
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
    cy.get('[data-testid="btnView0"]', { timeout: 30000 }).should('exist').should('be.visible');
    cy.get('[data-testid="btnView1"]', { timeout: 30000 }).should('exist').should('be.visible');

    // Click the first view button
    cy.get('[data-testid="btnView0"]').click();

    // Assert that we are on the result page
    cy.url({ timeout: 10000 }).should('include', '/results');


    // General Overview Tab
    cy.contains(/overview/i).should('exist');
    cy.contains(/seo/i).should('exist');
    cy.contains(/contact details/i).should('exist');

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

    // Navigate to the Sentimental Analysis Tab (if applicable)
    cy.get('[data-testid="tab-sentiment"]').click();
    cy.contains(/sentiment/i).should('exist');
  });
});

