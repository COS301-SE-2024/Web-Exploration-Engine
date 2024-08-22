describe('scraping functionality', () => {
  it('correct page loads', () => {
    cy.visit('/');
    cy.contains(/Web Exploration Engine/i).should('exist');
  });

  it('help should be available', () => {
    cy.testHelp('/');
  });
  
  it('general layout should be consistent', () => {
    cy.testLayout('/');
  });

   it('Scrape 1 crawlable url - GitHub', () => {
    cy.visit('/');

    cy.get('[data-testid="scraping-textarea-home"]').type('https://mock.test.github.com');

    cy.get('[data-testid="btn-start-scraping"]').click();

      
    cy.fixture('/pub-sub/github-done')
      .as('mock_scraper_github')
      .then((mock_scraper_github) => {
        cy.intercept(
          'GET',
          'http://localhost:3002/api/scraper?url=https%3A%2F%2Fmock.test.github.com',
          mock_scraper_github
        ).as('mock_scraper_github_done');
      });

    cy.fixture('/pub-sub/github-waiting')
      .as('mock_scraper_github')
      .then((mock_scraper_github) => {
        cy.intercept(
          'GET',
          'http://localhost:3002/api/scraper/status/scrape/https%3A%2F%2Fmock.test.github.com',
          mock_scraper_github
        ).as('mock_scraper_github_check_job');
      });


    cy.wait('@mock_scraper_github_done');

    // Assert that the URL is the scraperesults URL
    cy.url().should('include', 'scraperesults');
    

  });
 

}); 
