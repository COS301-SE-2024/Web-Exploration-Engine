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
      cy.url().should('include', '/scraperesults');  // Assert that the page redirects to the results page
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
});
