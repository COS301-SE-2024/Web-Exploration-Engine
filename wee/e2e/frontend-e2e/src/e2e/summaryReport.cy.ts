describe('Summary Report Page E2E Test',{ defaultCommandTimeout: 600000 }, () => {
  before(() => {
    // Visit the homepage and start the scraping process with real URLs
    cy.visit('/');
    cy.get('[data-testid="scraping-textarea-home"]').type(
      'https://wee-test-site-1.netlify.app/, https://wee-test-site-2.netlify.app/'
    );
    cy.get('[data-testid="btn-start-scraping"]').click();
  });

  it('should navigate to the summary report page and verify content', () => {
    // Wait for the scraping process to complete and navigate to the summary report
    cy.url().should('include', 'scraperesults');

    // Wait for the loading indicator to disappear
    cy.get('[data-testid="loading-indicator"]').should('not.exist');

    cy.get('[data-testid="btn-report-summary"]')
      .should('be.visible')
      .and('not.be.disabled')
      .click();


    // Verify page title
    cy.contains(/Summary Report/i).should('exist');


    // Check for general stats
  // cy.contains('General stats').should('exist').and('be.visible');
  cy.contains('2 Urls').should('exist').and('be.visible');
  cy.contains('Scraped').should('exist').and('be.visible');

  cy.contains('Avg scrape time').should('exist').and('be.visible');

  // Check for industry classification
  cy.contains('Industry classification').should('exist').and('be.visible');
  cy.contains('Classification Distribution').should('exist').and('be.visible');
  cy.contains('Weak classifications').should('exist').and('be.visible');

  // Check URL and score information
  cy.contains('https://wee-test-site-2.netlify.app/').should('exist').and('be.visible');
  cy.contains('42.80%').should('exist').and('be.visible');
  cy.contains('Domain match').should('exist').and('be.visible');

  cy.contains('Telecommunications').should('exist').and('be.visible');
  cy.contains('Health Care').should('exist').and('be.visible');

  // Check for sentiment analysis
  cy.contains('Sentiment Analysis - Emotions').should('exist').and('be.visible');

  });


});
