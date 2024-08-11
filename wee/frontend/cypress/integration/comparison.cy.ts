describe('comparison page', () => {
  
    it('general layout should be consistent', () => {
      cy.testLayout('/comparison');
    }); 



    it('all elements on page should exist', () => {
       cy.visit('/comparison');

      // Check all components exist

      cy.get('[data-testid="website1-select"]').should('exist');
      cy.get('[data-testid="website2-select"]').should('exist');
      
      //Page Section : Domain Overview
      cy.get('[data-testid="sect-website-status"]').should('exist');
      cy.get('[data-testid="sect-industry-classification"]').should('exist');
      cy.get('[data-testid="sect-domain-match"]').should('exist');
      //cy.get('[data-testid="sect-domain-match"]').contains(/-/i);

      //Page Section : On page SEO analysis

      cy.get('[data-testid="sect-unique-content"]').should('exist');
      cy.get('[data-testid="sect-images"]').should('exist');
      
      //Page Section : Technical SEO analysis
      cy.get('[data-testid="sect-lighthouse"]').should('exist');
      cy.get('[data-testid="sect-mobile-friendly"]').should('exist');
      cy.get('[data-testid="sect-site-speed"]').should('exist');

/*    
      // Popups
      cy.get('[data-testid="popup-info-domain-info"]').should('exist');
      cy.get('[data-testid="popup-info-domain-info"]').click();
      cy.contains(/Domain/i);

      cy.get('[data-testid="popup-info-onpage-seo"]').should('exist');
      cy.get('[data-testid="popup-info-onpage-seo"]').click().contains(/seo/i);

      cy.get('[data-testid="popup-technical-onpage-seo"]').should('exist');
      cy.get('[data-testid="popup-technical-onpage-seo"]').click().contains(/technical/i);
 */
    });


  it('scrape 2 crawlable urls - github, insecure', () => {
    cy.visit('/');
    cy.get('[data-testid="scraping-textarea-home"]').type('https://github.com,https://www.hbo.com/insecure');
    cy.get('[data-testid="btn-start-scraping"]').click();
      
    cy.fixture('/pub-sub/github-done')
      .as('mock_scraper_github')
      .then((mock_scraper_github) => {
        cy.intercept(
          'GET',
          'http://localhost:3002/api/scraper?url=https%3A%2F%2Fgithub.com',
          mock_scraper_github
        ).as('mock_scraper_github_done');
      });
      
    cy.fixture('/pub-sub/github-done')
      .as('mock_scraper_github')
      .then((mock_scraper_github) => {
        cy.intercept(
          'GET',
          'http://localhost:3002/api/scraper?url=https%3A%2F%2Fwww.hbo.com%2Finsecure',
          mock_scraper_github
        ).as('mock_scraper_insecure_done');
      });

    // Mock response to Pub Sub Polling
    cy.fixture('/pub-sub/insecure-status')
      .as('mock_scraper_insecure_status')
      .then((mock_scraper_insecure_status) => {
        cy.intercept(
          'GET',
          'http://localhost:3002/api/scraper/status/scrape/https%3A%2F%2Fwww.hbo.com%2Finsecure',
          mock_scraper_insecure_status
        ).as('mock_scraper_insecure_status');
      });
      
    cy.fixture('/pub-sub/github-status')
      .as('mock_scraper_github_status')
      .then((mock_scraper_github_status) => {
        cy.intercept(
          'GET',
          'http://localhost:3002/api/scraper/status/scrape/https%3A%2F%2Fgithub.com',
          mock_scraper_github_status
        ).as('mock_scraper_github_status');
      });

    cy.fixture('/pub-sub/insecure-waiting')
      .as('mock_scraper_insecure_waiting')
      .then((mock_scraper_insecure_waiting) => {
        cy.intercept(
          'GET',
          'http://localhost:3002/api/scraper/status?type=scrape&url=https%3A%2F%2Fwww.hbo.com%2Finsecure',
          mock_scraper_insecure_waiting
        ).as('mock_scraper_insecure_waiting');
      });
      
    cy.fixture('/pub-sub/github-waiting')
      .as('mock_scraper_github_waiting')
      .then((mock_scraper_github_waiting) => {
        cy.intercept(
          'GET',
          'http://localhost:3002/api/scraper/status?type=scrape&url=https%3A%2F%2Fgithub.com',
          mock_scraper_github_waiting
        ).as('mock_scraper_github_waiting');
      });
      
    cy.wait('@mock_scraper_github_done');
    cy.wait('@mock_scraper_insecure_done');

    //Wait 5 Seconds
    //THen check if the text insecure and github exist on the page

    // Assert that the URL is the scraperesults URL
    cy.url().should('include', 'scraperesults');


    cy.get('[data-testid="btn-comparison-summary"]').should('exist');
    cy.get('[data-testid="btn-comparison-summary"]').click();

    // We are now on the Comparison Page
    cy.get('[data-testid="website1-select"]').should('exist');
    cy.get('[data-testid="website1-select"]').click();
 /* cy.get('[data-testid="website1-option-0"]').should('exist');
    cy.get('[data-testid="website1-option-1"]').should('exist');
    cy.get('[data-testid="website1-option-1"]').click(); */


    cy.get('[data-testid="website2-select"]').should('exist');
    cy.get('[data-testid="website2-select"]').click();

/*  cy.get('[data-testid="website2-option-0"]').should('exist');
    cy.get('[data-testid="website2-option-1"]').should('exist');
    cy.get('[data-testid="website2-option-1"]').click();
 */

  });
 


  }); 
  