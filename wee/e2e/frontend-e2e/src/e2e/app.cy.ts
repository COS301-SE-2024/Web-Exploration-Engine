import { getGreeting } from '../support/app.po';

describe('frontend-e2e', () => {
  beforeEach(() => cy.visit('/'));

  // it('should display welcome message', () => {
  //   // Custom command to login
  //   cy.login('my-email@something.com', 'myPassword');

  //   // Check the greeting message
  //   getGreeting().contains(/The Web Exploration Engine/);
  // });

  // describe('E2E Signup and Login Flow', () => {
  //   it('should signup successfully', () => {
  //     cy.visit('/signup');

  //     // Fill out the signup form
  //     cy.get('input').eq(0).type('John');    // First Name
  //     cy.get('input').eq(1).type('Doe');     // Last Name
  //     cy.get('input').eq(2).type('testuser@example.com'); // Email
  //     cy.get('input').eq(3).type('password123');          // Password
  //     // Click submit button
  //     cy.get('button[type="submit"]').click();

  //   });

  //   it('should login successfully and show success modal', () => {
  //     cy.visit('/login');

  //     // Fill out the login form
  //     cy.get('input').eq(0).type('testuser@example.com'); // Email
  //     cy.get('input').eq(1).type('password123');          // Password

  //     // Click submit button
  //     cy.get('button[data-testid="login-button"]').click();


  //   });
  // });
  describe('Scraping Functionality', () => {
    const testUrls = 'https://wee-test-site-1.netlify.app/, https://wee-test-site-2.netlify.app/';

    // it('should load the home page correctly', () => {
    // cy.visit('/');
    // cy.contains(/The Web Exploration Engine/i).should('exist');
    // });

    // it('should display the scraping interface', () => {
    //   cy.visit('/');
    //   cy.get('[data-testid="scraping-textarea-home"]').should('exist');
    //   cy.get('[data-testid="btn-start-scraping"]').should('exist');
    // });
    // it('should scrape multiple URLs and redirect to results page', () => {
    //   // Visit the homepage
    //   cy.visit('/');


    //   // Enter the test URLs into the textarea
    //   cy.get('[data-testid="scraping-textarea-home"]').type('https://wee-test-site-1.netlify.app/, https://wee-test-site-2.netlify.app/');

    //   // Intercept the scraping requests without stubbing them
    //   cy.intercept('GET', '**/api/scraper**').as('startScraping');


    //   cy.get('[data-testid="btn-start-scraping"]').click();

    //   // Wait for the scraping request to complete
    //   cy.wait('@startScraping');

    //   // Now check for the status or result page
    //   cy.url().should('include', '/scraperesults');  // Assert that the page redirects to the results page
    // });


    // it('should handle URL validation errors', () => {
    //   cy.visit('/');

    //   // Enter an invalid URL
    //   cy.get('[data-testid="scraping-textarea-home"]').type('invalid-url');

    //   // Click the "Start scraping" button
    //   cy.get('[data-testid="btn-start-scraping"]').click();

    //   // Assert that an error message is displayed
    //   cy.contains(/Please enter valid URLs/i).should('exist');
    // });
  });

  describe('Scraping and Results Page', () => {
    // beforeEach(() => {
    //   // Visit the home page before each test
    //   cy.visit('/');
    // });

    // it('should start scraping and display results', () => {
    //   // Type the URLs into the textarea
    //   cy.get('[data-testid="scraping-textarea-home"]')
    //     .type('https://wee-test-site-1.netlify.app/, https://wee-test-site-2.netlify.app/');

    //   // Click the start scraping button
    //   cy.get('[data-testid="btn-start-scraping"]').click();

    //   // Wait for the loading indicator to disappear
    //   cy.get('[data-testid="loading-indicator"]', { timeout: 20000 }).should('not.exist');

    //   // Verify that the results page shows results for both sites
    //   cy.get('[data-testid="btnView0"]', { timeout: 20000 }).should('exist').should('be.visible');
    //   cy.get('[data-testid="btnView1"]', { timeout: 20000 }).should('exist').should('be.visible');

    //   // Click the first view button
    //   cy.get('[data-testid="btnView0"]').click();

    //   // Assert that we are on the result page
    //   cy.url({ timeout: 10000 }).should('include', '/results');

    //   // Verify the presence of tabs and content on the result page
    //   // General Overview Tab
    //   cy.contains(/overview/i).should('exist');
    //   cy.contains(/seo/i).should('exist');
    //   cy.contains(/contact details/i).should('exist');

    //   // Verify and navigate to the SEO tab
    //   cy.get('[data-testid="tab-seo"]').should('exist').click();
    //   cy.contains(/media/i).should('exist');
    //   cy.contains(/seo/i).should('exist');
    //   cy.contains(/export/i).should('exist');

    //   // Ensure the media tab is clicked
    //   cy.get('[data-testid="tab-media"]').click();

    //   // Wait for the content to be visible

    //   // Verify presence of the text and image
    //   // cy.contains(/screenshot/i).should('exist');
    //   // cy.contains(/screenshot available/i, { timeout: 10000 }).should('exist');
    //   cy.contains(/images/i).should('exist');
    //   cy.contains(/No images available/i).should('exist');

    //   // Navigate to the SEO Analysis Tab
    //   cy.get('[data-testid="tab-seo"]').click();
    //   cy.contains(/images/i).should('exist');
    //   cy.contains(/internal linking/i).should('exist');
    //   cy.contains(/headings/i).should('exist');
    //   cy.contains(/meta/i).should('exist');
    //   cy.contains(/title tags/i).should('exist');
    //   cy.contains(/unique content/i).should('exist');

    //   // Navigate to the Sentimental Analysis Tab (if applicable)
    //   //cy.get('[data-testid="tab-sentimental"]').click(); // Assuming there's a tab for sentiment analysis
    //   //cy.contains(/sentiment/i).should('exist'); // Adjust the content to what you expect on this tab
    // });
  });

  describe('comparison page', () => {
    before(() => {
      // Ensure the app is running and visit the home page
      cy.visit('/');
    });

    it('all elements on the comparison page should exist', () => {
      cy.visit('/comparison');

      // Check all components exist
      cy.get('[data-testid="website1-select"]').should('exist');
      cy.get('[data-testid="website2-select"]').should('exist');

      // Page Section: Domain Overview
      cy.get('[data-testid="sect-website-status"]').should('exist');
      cy.get('[data-testid="sect-industry-classification"]').should('exist');
      cy.get('[data-testid="sect-domain-match"]').should('exist');

      // Page Section: On-page SEO analysis
      cy.get('[data-testid="sect-unique-content"]').should('exist');
      cy.get('[data-testid="sect-images"]').should('exist');

      // Page Section: Technical SEO analysis
      cy.get('[data-testid="sect-lighthouse"]').should('exist');
      cy.get('[data-testid="sect-mobile-friendly"]').should('exist');
      cy.get('[data-testid="sect-site-speed"]').should('exist');
    });

    it('compare results of 2 URLs - wee-test-site-1 and wee-test-site-2', () => {
      cy.visit('/');

      // Input the URLs and start scraping
      cy.get('[data-testid="scraping-textarea-home"]').type(
        'https://wee-test-site-1.netlify.app/, https://wee-test-site-2.netlify.app/'
      );
      cy.get('[data-testid="btn-start-scraping"]').click();

      // Wait for scraping to finish
      cy.get('[data-testid="btnView0"]', { timeout: 10000 }).should('exist').should('be.visible');
      cy.get('[data-testid="btnView1"]', { timeout: 10000 }).should('exist').should('be.visible');

      // Go to the results page
      cy.url().should('include', 'results');

      // Navigate to the comparison page
      cy.get('[data-testid="btn-comparison-summary"]').should('exist').click();

      // Verify we are on the Comparison Page
      cy.url().should('include', 'comparison');

     //Select first website to compare
     cy.get('[data-testid="website1-select"]').should('exist');
     cy.get('[data-testid="website1-select"]').click();

     cy.get('[data-testid="website1-option-0"]').should('exist');
     cy.get('[data-testid="website1-option-1"]').should('exist');
     cy.get('[data-testid="website1-option-1"]').click();

     //Select second website to compare
     cy.get('[data-testid="website2-select"]').should('exist');
     cy.get('[data-testid="website2-select"]').click();

     cy.get('[data-testid="website2-option-0"]').should('exist');
     cy.get('[data-testid="website2-option-1"]').should('exist');
     cy.get('[data-testid="website2-option-1"]').click();

      // Section: Lighthouse Analysis
      cy.get('[data-testid="website1-lighthouse-performance"]').should('exist').should('be.visible');
      cy.get('[data-testid="website1-lighthouse-accessibility"]').should('exist').should('be.visible');
      cy.get('[data-testid="website1-lighthouse-bestpractices"]').should('exist').should('be.visible');

      cy.get('[data-testid="website2-lighthouse-performance"]').should('exist').should('be.visible');
      cy.get('[data-testid="website2-lighthouse-accessibility"]').should('exist').should('be.visible');
      cy.get('[data-testid="website2-lighthouse-bestpractices"]').should('exist').should('be.visible');

      // Section: Mobile Friendly
      cy.get('[data-testid="website1-mobilefriendly"]').should('exist').should('be.visible');
      cy.get('[data-testid="website2-mobilefriendly"]').should('exist').should('be.visible');

      // Section: Site Speed
      cy.get('[data-testid="website1-sitespeed"]').should('exist').should('be.visible');
      cy.get('[data-testid="website2-sitespeed"]').should('exist').should('be.visible');
    });
  });

  });
