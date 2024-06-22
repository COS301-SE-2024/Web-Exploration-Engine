//import github from '../fixtures/api-scrape/github.json';

describe('scraperesults', () => {
  it('should be on right page', () => {
    cy.visit('/scraperesults');
    cy.contains(/Summary/i).should('exist');

    cy.fixture('api-scrape/github')
      .as('jsonGithub')
      .then((jsonGithub) => {
        console.log(jsonGithub);
        cy.intercept(
          'GET',
          'http://localhost:3000/api/scraper?url=https%3A%2F%2Fgithub.com',
          jsonGithub
        ).as("mock");
      }); 
  });
});
