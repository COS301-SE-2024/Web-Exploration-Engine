
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
          'http://localhost:3000/api/scraper?*',
          jsonGithub
        ).as("mock");
      }); 
  });
});
