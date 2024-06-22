/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    login(email: string, password: string): void;
    mockUnsplash(): void;
  }
}

// -- This is a parent command --
Cypress.Commands.add('login', (email, password) => {
  console.log('Custom command example: Login', email, password);
});

/* Cypress.Commands.add('gohome',()=>{
    cy.fixture('/api/scraper/unsplash')
      .as('mock_scraper_unsplash')
      .then((mock_scraper_unsplash) => {
        cy.intercept(
          'GET',
          'http://localhost:3000/api/scraper?url=https%3A%2F%2Funsplash.com',
          mock_scraper_unsplash
        ).as('mock_scraper_unsplash');
      });
});
 */
//
// -- This is a child command --


Cypress.Commands.add('mockUnsplash', () => {
  cy.fixture('/api/scraper/unsplash')
    .as('mock_scraper_unsplash')
    .then((mock_scraper_unsplash) => {
      cy.intercept(
        'GET',
        'http://localhost:3000/api/scraper?url=https%3A%2F%2Funsplash.com',
        mock_scraper_unsplash
      ).as('mock_scraper_unsplash');
    });
});

//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
