describe('Comparison Page', () => {
  before(() => {
    // Ensure the app is running and visit the home page
    cy.visit('/');
  });

  // it('should have all elements on the comparison page', () => {
  //   cy.visit('/comparison');

  //   // Check all components exist
  //   cy.get('[data-testid="website1-select"]').should('exist');
  //   cy.get('[data-testid="website2-select"]').should('exist');

  //   // Page Section: Domain Overview
  //   cy.get('[data-testid="sect-website-status"]').should('exist');
  //   cy.get('[data-testid="sect-industry-classification"]').should('exist');
  //   cy.get('[data-testid="sect-domain-match"]').should('exist');

  //   // Page Section: On-page SEO analysis
  //   cy.get('[data-testid="sect-unique-content"]').should('exist');
  //   cy.get('[data-testid="sect-images"]').should('exist');

  //   // Page Section: Technical SEO analysis
  //   cy.get('[data-testid="sect-lighthouse"]').should('exist');
  //   cy.get('[data-testid="sect-mobile-friendly"]').should('exist');
  //   cy.get('[data-testid="sect-site-speed"]').should('exist');
  // });

  it('should compare results of 2 URLs - wee-test-site-1 and wee-test-site-2', () => {
    // Define the URLs to scrape
    const urlsToScrape = 'https://wee-test-site-1.netlify.app/, https://wee-test-site-2.netlify.app/';
    const encodedUrls = encodeURIComponent(urlsToScrape); // URL-encode the string

    // Intercept the GET request to /api/scraper with the encoded URLs
    cy.intercept(
      'GET',
      `http://localhost:3000/api/scraper?url=${encodedUrls}`
    ).as('scrapeRequest');

    // Type the URLs into the textarea
    cy.get('[data-testid="scraping-textarea-home"]')
      .type(urlsToScrape);

    // Click the start scraping button
    cy.get('[data-testid="btn-start-scraping"]').click();

    // Wait for the loading indicator to disappear
    cy.get('[data-testid="loading-indicator"]').should('not.exist');


    cy.get('body').then($body => {
      // If loading indicator does not exist, click the button
      if ($body.find('[data-testid="loading-indicator"]').length === 0) {

    // Navigate to the comparison page
    cy.get('[data-testid="btn-comparison-summary"]').should('exist').click();


    // // Select first website to compare
    // cy.get('[data-testid="website1-select"]').should('exist').click();

    // // Wait for options to be visible
    // cy.get('[data-testid^="website1-option-"]').should('be.visible');

    // // Now select the option
    // cy.get('[data-testid="website1-option-0"]').should('exist').click();

    // // Select second website to compare
    // cy.get('[data-testid="website2-select"]').should('exist').click();
    // cy.get('[data-testid^="website2-option-"]').should('be.visible');
    // cy.get('[data-testid="website2-option-0"]').should('exist').click();


    // // Section: Lighthouse Analysis
    // cy.get('[data-testid="website1-lighthouse-accessibility"]').should('exist').and('be.visible').contains('91%');
    // cy.get('[data-testid="website1-lighthouse-bestpractices"]').should('exist').and('be.visible').contains('96%');
    // cy.get('[data-testid="website2-lighthouse-accessibility"]').should('exist').and('be.visible').contains('92%');
    // cy.get('[data-testid="website2-lighthouse-bestpractices"]').should('exist').and('be.visible').contains('100%');

    // // Section: Mobile Friendly
    // cy.get('[data-testid="website1-mobilefriendly"]').should('exist').and('be.visible').contains('Yes');
    // cy.get('[data-testid="website2-mobilefriendly"]').should('exist').and('be.visible').contains('Yes');

    // // Section: Domain Overview
    // cy.get('[data-testid="sect-website-status"]').should('exist').and('be.visible').contains('Live');
    // cy.get('[data-testid="sect-industry-classification"]').should('exist').and('be.visible').contains('Health Care');
    // cy.get('[data-testid="sect-domain-match"]').should('exist').and('be.visible').contains('Telecommunications');

    // // Section: On-Page SEO Analysis
    // cy.get('[data-testid="sect-unique-content"]').should('exist').and('be.visible').contains('Unique Content');
    // cy.get('[data-testid="sect-images"]').should('exist').and('be.visible').contains('Missing Alt. Text');


      } else {
        // Optional: Log or handle the case when the loading indicator exists
        cy.log('Loading indicator is still visible, button click skipped.');
      }
    });




  });
});
