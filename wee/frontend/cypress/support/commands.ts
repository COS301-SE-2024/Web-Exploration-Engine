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
    testHelp(page: string): void;
    importAllMocks(page: string): void;
  }
}

// -- This is a parent command --
Cypress.Commands.add('login', (email, password) => {
  console.log('Custom command example: Login', email, password);
});



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

Cypress.Commands.add('testHelp', (page) => {
  cy.visit(page);
  cy.get('[data-testid="help-button"]').should('exist');
});

Cypress.Commands.add('importAllMocks', () => {
  //Get all mocks then intercept all api requests using those mocks
  cy.fixture('/api/scraper/github')
    .as('mock_scraper_github')
    .then((mock_scraper_github) => {
      cy.intercept(
        'GET',
        'http://localhost:3000/api/scraper?url=https%3A%2F%2Fgithub.com',
        mock_scraper_github
      ).as('mock_scraper_github');
    });

  cy.fixture('/api/scraper/classify-industry/github')
    .as('mock_industry_github')
    .then((mock_industry_github) => {
      cy.intercept(
        'GET',
        'http://localhost:3000/api/scraper/classify-industry?url=https%3A%2F%2Fgithub.com',
        mock_industry_github
      ).as('mock_industry_github');
    });

  cy.fixture('/api/scraper/read-robots/github')
    .as('mock_robots_github')
    .then((mock_robots_github) => {
      cy.intercept(
        'GET',
        'http://localhost:3000/api/scraper/read-robots?url=https%3A%2F%2Fgithub.com',
        mock_robots_github
      ).as('mock_robots_github');
    });

  cy.fixture('/api/scraper/scrape-images/github')
    .as('mock_images_github')
    .then((mock_images_github) => {
      cy.intercept(
        'GET',
        'http://localhost:3000/api/scraper/scrape-images?url=https%3A%2F%2Fgithub.com',
        mock_images_github
      ).as('mock_images_github');
    });

  cy.fixture('/api/scraper/scrape-logo/github')
    .as('mock_logo_github')
    .then((mock_logo_github) => {
      cy.intercept(
        'GET',
        'http://localhost:3000/api/scraper/scrape-logo?url=https%3A%2F%2Fgithub.com',
        mock_logo_github
      ).as('mock_logo_github');
    });

  cy.fixture('/api/scraper/scrape-metadata/github')
    .as('mock_metadata_github')
    .then((mock_metadata_github) => {
      cy.intercept(
        'GET',
        'http://localhost:3000/api/scraper/scrape-metadata?url=https%3A%2F%2Fgithub.com',
        mock_metadata_github
      ).as('mock_metadata_github');
    });

  cy.fixture('/api/scraper/scrape-status/github')
    .as('mock_status_github')
    .then((mock_status_github) => {
      cy.intercept(
        'GET',
        'http://localhost:3000/api/scraper/scrape-status?url=https%3A%2F%2Fgithub.com',
        mock_status_github
      ).as('mock_status_github');
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
