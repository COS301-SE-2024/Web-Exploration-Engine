describe('Summary Report Page E2E Test', () => {
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
    cy.url().should('include', 'scraperesults', { timeout: 120000 })


     // Wait for the loading indicator to disappear
  cy.get('[data-testid="loading-indicator"]').should('not.exist');
  
    cy.get('[data-testid="btn-report-summary"]')
    .should('be.visible')
    .should('not.be.disabled', { timeout: 120000 }) // Wait until the button is enabled
    .click({ timeout: 120000 });
    // cy.url().should('include', 'summaryreport', { timeout: 50000 });

    // Verify page title
    cy.contains(/Summary Report/i).should('exist');

    // Page Section: General Statistics
    cy.get('[data-testid="visual-scraped-stats"]').should('exist').and('be.visible');
    cy.get('[data-testid="visual-scraped-stats"]').should('contain.text', 'Scraped').and('contain.text', 'Urls');

    cy.get('[data-testid="visual-crawlable-stats"]').should('exist').and('be.visible');
    cy.get('[data-testid="visual-crawlable-stats"]').should('contain.text', 'Crawlable').and('contain.text', 'Urls');

    cy.get('[data-testid="visual-avg-scrape-stats"]').should('exist').and('be.visible');
    cy.get('[data-testid="visual-avg-scrape-stats"]').should('contain.text', 'sec').and('contain.text', 'scrape time');

    // Section: Industry Classification
    cy.get('[data-testid="visual-industry-classification"]').should('exist').and('be.visible');
    cy.get('[data-testid="visual-industry-classification"]').should('contain.text', 'Classification Distribution');

    cy.get('[data-testid="visual-weak-classifications"]').should('exist').and('be.visible');
    // cy.get('[data-testid="visual-weak-classifications"]').should('contain.text', 'There was no weak classifications');

    cy.get('[data-testid="table-weak-classifications"]').should('exist').and('be.visible');
    // cy.get('[data-testid="table-weak-classifications"]').should('contain.text', 'There was no weak classifications');
    cy.get('[data-testid="table-weak-classifications"]').find('th').first().should('contain.text', 'URL');
    cy.get('[data-testid="table-weak-classifications"]').find('th').eq(1).should('contain.text', 'SCORE');
    // cy.get('[data-testid="table-weak-classifications"]').find('tbody').should('contain.text', 'no weak classifications');

    // Section: Domain Match
    cy.get('[data-testid="visual-domain-match"]').should('exist').and('be.visible');
    cy.get('[data-testid="visual-domain-match"]').should('contain.text', 'Domain mismatch information');

    cy.get('[data-testid="table-domain-match"]').should('exist').and('be.visible');
    // cy.get('[data-testid="table-domain-match"]').should('contain.text', 'Domain mismatch information');
    cy.get('[data-testid="table-domain-match"]').find('th').eq(0).should('contain.text', 'URL');
    cy.get('[data-testid="table-domain-match"]').find('th').eq(1).should('contain.text', 'CLASSIFICATION - META');
    cy.get('[data-testid="table-domain-match"]').find('th').eq(2).should('contain.text', 'DOMAIN MATCH');


    // Check for general stats
  cy.contains('General stats').should('exist').and('be.visible');
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
