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
    cy.get('[data-testid="btnView0"]', { timeout: 10000 }).should('exist').should('be.visible');
    cy.get('[data-testid="btnView1"]', { timeout: 10000 }).should('exist').should('be.visible');

    // Go to the results page
    cy.url().should('include', 'results');

    // Navigate to the comparison page
    cy.get('[data-testid="btn-comparison-summary"]').should('exist').click();

    // Verify we are on the Comparison Page
    cy.url().should('include', 'comparison');

   //Select first website to compare
   cy.get('[data-testid="website1-select"]').should('exist');
   cy.get('[data-testid="website1-select"]').click();

   cy.get('[data-testid="website1-option-0"]').should('exist');
   cy.get('[data-testid="website1-option-1"]').should('exist');
   cy.get('[data-testid="website1-option-1"]').click();

   //Select second website to compare
   cy.get('[data-testid="website2-select"]').should('exist');
   cy.get('[data-testid="website2-select"]').click();

   cy.get('[data-testid="website2-option-0"]').should('exist');
   cy.get('[data-testid="website2-option-1"]').should('exist');
   cy.get('[data-testid="website2-option-1"]').click();

    // Section: Lighthouse Analysis
    cy.get('[data-testid="website1-lighthouse-performance"]').should('exist').should('be.visible');
    cy.get('[data-testid="website1-lighthouse-accessibility"]').should('exist').should('be.visible');
    cy.get('[data-testid="website1-lighthouse-bestpractices"]').should('exist').should('be.visible');

    cy.get('[data-testid="website2-lighthouse-performance"]').should('exist').should('be.visible');
    cy.get('[data-testid="website2-lighthouse-accessibility"]').should('exist').should('be.visible');
    cy.get('[data-testid="website2-lighthouse-bestpractices"]').should('exist').should('be.visible');

    // Section: Mobile Friendly
    cy.get('[data-testid="website1-mobilefriendly"]').should('exist').should('be.visible');
    cy.get('[data-testid="website2-mobilefriendly"]').should('exist').should('be.visible');

    // Section: Site Speed
    cy.get('[data-testid="website1-sitespeed"]').should('exist').should('be.visible');
    cy.get('[data-testid="website2-sitespeed"]').should('exist').should('be.visible');
  });
});
