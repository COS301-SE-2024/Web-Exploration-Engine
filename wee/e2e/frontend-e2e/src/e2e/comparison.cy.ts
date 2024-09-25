describe('comparison page', () => {
  before(() => {
    // Ensure the app is running and visit the home page
    cy.visit('/');
  });

  it('all elements on the comparison page should exist', () => {
    cy.visit('/comparison');

    // Check all components exist
    cy.get('[data-testid="website1-select"]').should('exist');
    cy.get('[data-testid="website2-select"]').should('exist');

    // Page Section: Domain Overview
    cy.get('[data-testid="sect-website-status"]').should('exist');
    cy.get('[data-testid="sect-industry-classification"]').should('exist');
    cy.get('[data-testid="sect-domain-match"]').should('exist');

    // Page Section: On-page SEO analysis
    cy.get('[data-testid="sect-unique-content"]').should('exist');
    cy.get('[data-testid="sect-images"]').should('exist');

    // Page Section: Technical SEO analysis
    cy.get('[data-testid="sect-lighthouse"]').should('exist');
    cy.get('[data-testid="sect-mobile-friendly"]').should('exist');
    cy.get('[data-testid="sect-site-speed"]').should('exist');
  });

  it('compare results of 2 URLs - wee-test-site-1 and wee-test-site-2', () => {
    cy.visit('/');

    // Input the URLs and start scraping
    cy.get('[data-testid="scraping-textarea-home"]').type(
      'https://wee-test-site-1.netlify.app/, https://wee-test-site-2.netlify.app/'
    );
    cy.get('[data-testid="btn-start-scraping"]').click();

    // Wait for scraping to finish
    cy.get('[data-testid="btnView0"]', { timeout: 60000 }).should('exist').should('be.visible');

    // Go to the results page
    cy.url().should('include', 'results');

    // Navigate to the comparison page
    cy.get('[data-testid="btn-comparison-summary"]').should('exist').click();

    // Verify we are on the Comparison Page
    cy.url().should('include', 'comparison');

    // Select first website to compare
    cy.get('[data-testid="website1-select"]').should('exist').click();
    cy.get('[data-testid="website1-option-0"]').should('exist').click({ force: true }); // Force click if hidden

    // Select second website to compare
    cy.get('[data-testid="website2-select"]').should('exist').click();
    cy.get('[data-testid="website2-option-1"]').should('exist').click({ force: true }); // Force click if hidden

    // Section: Lighthouse Analysis
  //   cy.get('[data-testid="website1-lighthouse-performance"]', { timeout: 10000 }
  // ).should('exist').and('be.visible').contains('98%');
    cy.get('[data-testid="website1-lighthouse-accessibility"]').should('exist').and('be.visible').contains('91%');
    cy.get('[data-testid="website1-lighthouse-bestpractices"]').should('exist').and('be.visible').contains('96%');

   // cy.get('[data-testid="website2-lighthouse-performance"]').should('exist').and('be.visible').contains('100%');
    cy.get('[data-testid="website2-lighthouse-accessibility"]').should('exist').and('be.visible').contains('92%');
    cy.get('[data-testid="website2-lighthouse-bestpractices"]').should('exist').and('be.visible').contains('100%');

    // Section: Mobile Friendly
    cy.get('[data-testid="website1-mobilefriendly"]').should('exist').and('be.visible').contains('Yes');
    cy.get('[data-testid="website2-mobilefriendly"]').should('exist').and('be.visible').contains('Yes');

    // Section: Domain Overview
    cy.get('[data-testid="sect-website-status"]').should('exist').and('be.visible').contains('Live');
    cy.get('[data-testid="sect-industry-classification"]').should('exist').and('be.visible').contains('Health Care');
    cy.get('[data-testid="sect-domain-match"]').should('exist').and('be.visible').contains('Telecommunications');

    // Section: On-Page SEO Analysis
    cy.get('[data-testid="sect-unique-content"]').should('exist').and('be.visible').contains('Unique Content');
    cy.get('[data-testid="sect-images"]').should('exist').and('be.visible').contains('Missing Alt. Text');



});

});
