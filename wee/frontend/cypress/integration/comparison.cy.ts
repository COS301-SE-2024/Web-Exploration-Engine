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

  });

  it('compare results of 2 urls - github, steers', () => {
    cy.visit('/');
    cy.get('[data-testid="scraping-textarea-home"]').type(
      'https://mock.test.github.com,https://mock.test.steers.co.za'
    );
    cy.get('[data-testid="btn-start-scraping"]').click();

    //======================================================
    // GitHub Mock
    //======================================================

    //Full response
    cy.fixture('/pub-sub/github-done')
      .as('mock_scraper_mockgithub_done')
      .then((mock_scraper_mockgithub_done) => {
        cy.intercept(
          'GET',
          'http://localhost:3002/api/scraper?url=https%3A%2F%2Fmock.test.github.com', //mock.test.github.com
          mock_scraper_mockgithub_done
        ).as('mock_scraper_mockgithub_done');
      });

    //Pub Sub - Publish Event
    cy.fixture('/pub-sub/github-waiting')
      .as('mock_scraper_mockgithub_waiting')
      .then((mock_scraper_mockgithub_waiting) => {
        cy.intercept(
          'GET',
          'http://localhost:3002/api/scraper/status?type=scrape&url=https%3A%2F%2Fmock.test.github.com',
          mock_scraper_mockgithub_waiting
        ).as('mock_scraper_mockgithub_waiting');
      });

    //Pub Sub - Get Event Status
    cy.fixture('/pub-sub/github-status')
      .as('mock_scraper_mockgithub_status')
      .then((mock_scraper_mockgithub_status) => {
        cy.intercept(
          'GET',
          'http://localhost:3002/api/scraper/status/scrape/https%3A%2F%2Fmock.test.github.com',
          mock_scraper_mockgithub_status
        ).as('mock_scraper_mockgithub_status');
      });

    //======================================================
    // Steers Mock
    //======================================================

    //Full response
    cy.fixture('/pub-sub/steers-done')
      .as('mock_scraper_mocksteers_done')
      .then((mock_scraper_mocksteers_done) => {
        cy.intercept(
          'GET',
          'http://localhost:3002/api/scraper?url=https%3A%2F%2Fmock.test.steers.co.za', //mock.test.steers.co.za
          mock_scraper_mocksteers_done
        ).as('mock_scraper_mocksteers_done');
      });

    //Pub Sub - Publish Event
    cy.fixture('/pub-sub/steers-waiting')
      .as('mock_scraper_mocksteers_waiting')
      .then((mock_scraper_mocksteers_waiting) => {
        cy.intercept(
          'GET',
          'http://localhost:3002/api/scraper/status?type=scrape&url=https%3A%2F%2Fmock.test.steers.co.za',
          mock_scraper_mocksteers_waiting
        ).as('mock_scraper_mocksteers_waiting');
      });

    //Pub Sub - Get Event Status
    cy.fixture('/pub-sub/steers-status')
      .as('mock_scraper_mocksteers_status')
      .then((mock_scraper_mocksteers_status) => {
        cy.intercept(
          'GET',
          'http://localhost:3002/api/scraper/status/scrape/https%3A%2F%2Fmock.test.steers.co.za',
          mock_scraper_mocksteers_status
        ).as('mock_scraper_mocksteers_status');
      });

    //Wait for steers and github to finish
    cy.wait('@mock_scraper_mockgithub_done', { timeout: 10000 });
    cy.wait('@mock_scraper_mocksteers_done', { timeout: 10000 });

    //==========================================
    // Accessing the results page
    //==========================================

    cy.get('[data-testid="btnView0"]', { timeout: 10000 })
      .should('exist')
      .should('be.visible');
    //.click();

    cy.get('[data-testid="btnView1"]', { timeout: 10000 })
      .should('exist')
      .should('be.visible');
    //.click();

    cy.url().should('include', 'results');

    //  Tab : Sentiment Analysis
    cy.log('Testing ');

    // cy.get('[data-testid="btn-back"]').click();

    // Assert that the URL is the scraperesults URL
    cy.url().should('include', 'scraperesults');
    cy.get('[data-testid="btn-comparison-summary"]').should('exist');
    cy.get('[data-testid="btn-comparison-summary"]').click();

    // We are now on the Comparison Page

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

    //Check all corresponding website
  });

  it('compare results of 3 urls - github, steers', () => {
    cy.visit('/');
    cy.get('[data-testid="scraping-textarea-home"]').type(
      'https://mock.test.github.com,https://mock.test.steers.co.za'
    );
    cy.get('[data-testid="btn-start-scraping"]').click();

    //======================================================
    // GitHub Mock
    //======================================================

    //Full response
    cy.fixture('/pub-sub/github-done')
      .as('mock_scraper_mockgithub_done')
      .then((mock_scraper_mockgithub_done) => {
        cy.intercept(
          'GET',
          'http://localhost:3002/api/scraper?url=https%3A%2F%2Fmock.test.github.com', //mock.test.github.com
          mock_scraper_mockgithub_done
        ).as('mock_scraper_mockgithub_done');
      });

    //Pub Sub - Publish Event
    cy.fixture('/pub-sub/github-waiting')
      .as('mock_scraper_mockgithub_waiting')
      .then((mock_scraper_mockgithub_waiting) => {
        cy.intercept(
          'GET',
          'http://localhost:3002/api/scraper/status?type=scrape&url=https%3A%2F%2Fmock.test.github.com',
          mock_scraper_mockgithub_waiting
        ).as('mock_scraper_mockgithub_waiting');
      });

    //Pub Sub - Get Event Status
    cy.fixture('/pub-sub/github-status')
      .as('mock_scraper_mockgithub_status')
      .then((mock_scraper_mockgithub_status) => {
        cy.intercept(
          'GET',
          'http://localhost:3002/api/scraper/status/scrape/https%3A%2F%2Fmock.test.github.com',
          mock_scraper_mockgithub_status
        ).as('mock_scraper_mockgithub_status');
      });

    //======================================================
    // Steers Mock
    //======================================================

    //Full response
    cy.fixture('/pub-sub/steers-done')
      .as('mock_scraper_mocksteers_done')
      .then((mock_scraper_mocksteers_done) => {
        cy.intercept(
          'GET',
          'http://localhost:3002/api/scraper?url=https%3A%2F%2Fmock.test.steers.co.za', //mock.test.steers.co.za
          mock_scraper_mocksteers_done
        ).as('mock_scraper_mocksteers_done');
      });

    //Pub Sub - Publish Event
    cy.fixture('/pub-sub/steers-waiting')
      .as('mock_scraper_mocksteers_waiting')
      .then((mock_scraper_mocksteers_waiting) => {
        cy.intercept(
          'GET',
          'http://localhost:3002/api/scraper/status?type=scrape&url=https%3A%2F%2Fmock.test.steers.co.za',
          mock_scraper_mocksteers_waiting
        ).as('mock_scraper_mocksteers_waiting');
      });

    //Pub Sub - Get Event Status
    cy.fixture('/pub-sub/steers-status')
      .as('mock_scraper_mocksteers_status')
      .then((mock_scraper_mocksteers_status) => {
        cy.intercept(
          'GET',
          'http://localhost:3002/api/scraper/status/scrape/https%3A%2F%2Fmock.test.steers.co.za',
          mock_scraper_mocksteers_status
        ).as('mock_scraper_mocksteers_status');
      });

    //Wait for steers and github to finish
    cy.wait('@mock_scraper_mockgithub_done', { timeout: 10000 });
    cy.wait('@mock_scraper_mocksteers_done', { timeout: 10000 });

    //==========================================
    // Accessing the results page
    //==========================================

    cy.get('[data-testid="btnView0"]', { timeout: 10000 })
      .should('exist')
      .should('be.visible');
    //.click();

    cy.get('[data-testid="btnView1"]', { timeout: 10000 })
      .should('exist')
      .should('be.visible');
    //.click();

    cy.url().should('include', 'results');

    //  Tab : Sentiment Analysis
    cy.log('Testing ');

    // cy.get('[data-testid="btn-back"]').click();

    // Assert that the URL is the scraperesults URL
    cy.url().should('include', 'scraperesults');
    cy.get('[data-testid="btn-comparison-summary"]').should('exist');
    cy.get('[data-testid="btn-comparison-summary"]').click();

    // On the Comparison Page

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

    //Check all corresponding website


    
    //Section : Light House Analysis

    //Website 1
    cy.get('[data-testid="website1-lighthouse-performance"]')
    .should('exist')
    .should('be.visible')
    .should('contain.text', '0%');

    cy.get('[data-testid="website1-lighthouse-accessibility"]')
    .should('exist')
    .should('be.visible')
    .should('contain.text', '0%');

    cy.get('[data-testid="website1-lighthouse-bestpractices"]')
    .should('exist')
    .should('be.visible')
    .should('contain.text', '0%');

    //Website 2
    cy.get('[data-testid="website2-lighthouse-performance"]')
    .should('exist')
    .should('be.visible')
    .should('contain.text', '0%');

    cy.get('[data-testid="website2-lighthouse-accessibility"]')
    .should('exist')
    .should('be.visible')
    .should('contain.text', '0%');

    cy.get('[data-testid="website2-lighthouse-bestpractices"]')
    .should('exist')
    .should('be.visible')
    .should('contain.text', '0%');

    
    // Section : Mobile Friendly
    
    cy.get('[data-testid="website1-mobilefriendly"]')
    .should('exist')
    .should('be.visible')
    .should('contain.text', 'Yes');


    cy.get('[data-testid="website2-mobilefriendly"]')
    .should('exist')
    .should('be.visible')
    .should('contain.text', 'Yes');

    
    
    // Section : Site Speed
    
    cy.get('[data-testid="website1-sitespeed"]')
    .should('exist')
    .should('be.visible')
    .should('contain.text', '0');


    cy.get('[data-testid="website2-sitespeed"]')
    .should('exist')
    .should('be.visible')
    .should('contain.text', '0');


  });

});
