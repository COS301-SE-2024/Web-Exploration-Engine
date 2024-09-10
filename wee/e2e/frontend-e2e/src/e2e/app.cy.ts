import { getGreeting } from '../support/app.po';

describe('frontend-e2e', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    // Custom command to login
    cy.login('my-email@something.com', 'myPassword');

    // Check the greeting message
    getGreeting().contains(/The Web Exploration Engine/);
  });

  describe('E2E Signup and Login Flow', () => {
    it('should signup successfully', () => {
      cy.visit('/signup');
      cy.contains(/Become a Member/i).should('exist');

      // Fill out the signup form
      // cy.get('input[name="email"]').type('testuser@example.com');
      // cy.get('input[name="password"]').type('password123');
      // cy.get('input[name="confirmPassword"]').type('password123');
      // cy.get('button[type="submit"]').click();

      // // Check if signup was successful
      // cy.contains(/Account created successfully/i).should('exist');
    });

    it('should login successfully after signup', () => {
      cy.visit('/login');
    //   cy.get('input[name="email"]').type('testuser@example.com');
    //   cy.get('input[name="password"]').type('password123');
    //   cy.get('button[type="submit"]').click();

    //   // Validate successful login
    //   cy.contains(/Dashboard/i).should('exist');
    });

  });

  describe('E2E Scraping Flow', () => {
   it('should scrape and display results for multiple URLs', () => {
     cy.visit('/');

      // Enter URLs to scrape
      cy.get('[data-testid="scraping-textarea-home"]').type(
        'https://wee-test-site-1.netlify.app,https://wee-test-site-2.netlify.app,https://example.com'
      );

      // Start scraping
      cy.get('[data-testid="btn-start-scraping"]').click();

      // Intercept scraper requests
      cy.fixture('/pub-sub/site1-done').then((site1Done) => {
        cy.intercept(
          'GET',
          'http://localhost:3002/api/scraper?url=https%3A%2F%2Fwee-test-site-1.netlify.app',
          site1Done
        ).as('site1Scrape');
      });

       cy.fixture('/pub-sub/site2-done').then((site2Done) => {
        cy.intercept(
          'GET',
          'http://localhost:3002/api/scraper?url=https%3A%2F%2Fwee-test-site-2.netlify.app',
          site2Done
        ).as('site2Scrape');
      });

    //   // Wait for both scrapes to finish
      cy.wait('@site1Scrape', { timeout: 10000 });
      cy.wait('@site2Scrape', { timeout: 10000 });

    //   // Check if the view buttons for the results are available
      cy.get('[data-testid="btnView0"]').should('exist').should('be.visible');
      cy.get('[data-testid="btnView1"]').should('exist').should('be.visible');

    //   // Access the results page
    //   cy.get('[data-testid="btnView1"]').click();
    //   cy.url().should('include', '/results');

    //   // Verify the result content for site 2
    //   cy.get('[data-testid="p-title"]').should('contain.text', 'WEE Test Site 2');
    //   cy.get('[data-testid="p-summary"]').should('contain.text', 'This is a test site for the Web Exploration Engine.');
     });
  });

  describe('E2E Result Page Verification', () => {
  //   it('should verify the layout and content on the results page', () => {
  //     cy.visit('/results?');

  //     // Test the Export / Save Button
  //     cy.get('[data-testid="btn-export-save-report"]').should('exist').click();

  //     // Test different tabs
  //     cy.get('[data-testid="tab-seo"]').click();
  //     cy.contains(/media/i).should('exist');
  //     cy.contains(/seo/i).should('exist');

  //     cy.get('[data-testid="tab-media"]').click();
  //     cy.contains(/screenshot available/i).should('exist');
  //   });
  });
});
