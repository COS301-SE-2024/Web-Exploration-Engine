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

  it('results of 2 urls - github, steers', () => {
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
    //cy.wait(7000)

    cy.get('[data-testid="btnView0"]', { timeout: 10000 })
      .should('exist')
      .should('be.visible');
    //.click();

    cy.get('[data-testid="btnView1"]', { timeout: 10000 })
      .should('exist')
      .should('be.visible');
    //.click();

    cy.url().should('include', 'results');

    //==========================================
    // Checking the results page content : Steers
    //==========================================

    cy.get('[data-testid="btnView1"]').should('exist').click();

    cy.url().should('include', 'results');

    //  Tab : General Overview
    cy.log('Testing General overview tab');

    cy.get('[data-testid="tab-general"]').should('exist');
    cy.get('[data-testid="tab-general"]').click();

    //Tab Section : Header, Title, Logo
    cy.get('[data-testid="div-summary"]').should('exist').should('be.visible');

    cy.get('[data-testid="p-title"]')
      .should('exist')
      .should('be.visible')
      .should('contain.text', 'Burgers and Flame Grills | Steers South Africa');

    cy.get('[data-testid="img-logo"]')
      .should('exist')
      .should('have.attr', 'src');

    cy.get('[data-testid="p-summary"]')
      .should('exist')
      .should('be.visible')
      .should(
        'contain.text',
        'Nothing slaps more than 100% Flame-Grilled flavour. Steers South Africa is the takeaway restaurant of choice for burgers, chicken, ribs and hand-cut chips.'
      );
    // Tab Section : Summary Info

    //  Tab : Media
    cy.log('Testing Media Tab');
    cy.get('[data-testid="tab-media"]').click();

    cy.get('[data-testid="div-homepagescreenshot"]')
      .should('exist')
      .should('be.visible');

    cy.get('[data-testid="pagination-images"]')
      .should('exist')
      .should('be.visible');

    // Check the select dropdown for "Images Per Page"
    cy.get('[data-testid="pagination-images"] select')
      .should('be.visible')
      .find('option')
      .should('have.length', 6) // There are 6 options
      .then(($options) => {
        const expectedValues = ['4', '8', '16', '24', '36', '48'];
        $options.each((index, option) => {
          expect(option.value).to.equal(expectedValues[index]);
        });
      });

    // Check the images in the cards
    cy.get('[id="unique-results-image-container"]')
      .find('[id="unique-results-image"]')
      .should('have.length.greaterThan', 0); // Ensure there is at least one image

    cy.get('[id="unique-results-image-container"]')
      .find('img')
      .should('have.attr', 'alt', 'Image')
      .and('have.attr', 'src'); // Ensure images have src attribute

    //  Tab : SEO Analysis
    cy.log('Testing SEO Analysis');

    cy.get('[data-testid="tab-seo"]').click();

    //Check Titles
    cy.contains(/images/i).should('exist');
    cy.contains(/internal linking/i).should('exist');
    cy.contains(/headings/i).should('exist');
    cy.contains(/meta/i).should('exist');
    cy.contains(/title tags/i).should('exist');
    cy.contains(/unique content/i).should('exist');

    cy.get('[data-testid="div-images-total"]')
      .should('exist')
      .should('be.visible')
      .should('contain.text', '26');

    cy.get('[data-testid="div-images-missing-alt"]')
      .should('exist')
      .should('be.visible')
      .should('contain.text', '2');

    cy.get('[data-testid="div-images-not-optimal"]')
      .should('exist')
      .should('be.visible')
      .should('contain.text', '0');

    // cy.get('[data-testid="scroll-format-urls"]')
    // .should('exist')
    // .should('be.visible')
    // .should(
    //     'contain.text','110'      )

    // cy.get('[data-testid="div-format-urls"]')
    // .should('exist')
    // .should('be.visible')
    // .should(
    //     'contain.text','47'      )

    // cy.get('[data-testid="div-other-urls"]')
    // .should('exist')
    // .should('be.visible')
    // .should(
    //     'contain.text','abc'
    //   )

    // cy.get('[data-testid="div-links-total"]')
    // .should('exist')
    // .should('be.visible')
    // .should(
    //     'contain.text','abc'
    //   )

    //Heading Analysis
    cy.get('[data-testid="p-heading-count"]')
      .should('exist')
      .should('be.visible')
      .should('contain.text', '1');

    cy.get('[data-testid="popup-headings"]')
      .should('exist')
      .should('be.visible')
      .should('contain.text', 'Welcome to Steers®, the home of Flame-Grilled');

    // MetaDescription Analysis
    // cy.get('[data-testid="p-metadescription-tag"]')
    // .should('exist')
    // .should('be.visible')
    // .should(
    //     'contain.text','array'
    //   )

    // cy.get('[data-testid="p-metadescription-length"]')
    // .should('exist')
    // .should('be.visible')
    // .should(
    //     'contain.text','array'
    //   )

    // EO MetaDescription Analysis
    // cy.get('[data-testid="p-metadescription"]')
    // .should('exist')
    // .should('be.visible')
    // .should(
    //     'contain.text','array'
    //   )

    // cy.get('[data-testid="p-titletag-description"]')
    // .should('exist')
    // .should('be.visible')
    // .should(
    //     'contain.text','array'
    //   )

    // cy.get('[data-testid="p-titletag-length"]')
    // .should('exist')
    // .should('be.visible')
    // .should(
    //     'contain.text','array'
    //   )

    //Unique Content
    // cy.get('[data-testid="p-titletag-length"]')
    // .should('exist')
    // .should('be.visible')
    // .should(
    //     'contain.text','array'
    //   )
    cy.get('[data-testid="div-uniq-textlength"]')
      .should('exist')
      .should('be.visible')
      .should('contain.text', '303');
    cy.get('[data-testid="div-uniq-percentage"]')
      .should('exist')
      .should('be.visible')
      .should('contain.text', '52.81%');

    cy.get('[data-testid="div-uniq-rep-words"]')
      .should('exist')
      .should('be.visible')
      .should('contain.text', 'king: 5burger: 5only: 4');

    //Sentiment Analysis
    // cy.get('[data-testid="div-sentiment-analysis"]')
    // .should('exist')
    // .should('be.visible')
    // .should(
    //     'contain.text','array'
    //   )

    //  Tab : Sentiment Analysis
    cy.log('Testing Sentiment Analysis');

    cy.get('[data-testid="btn-back"]').click();

    // Assert that the URL is the scraperesults URL
    cy.url().should('include', 'scraperesults');
    cy.get('[data-testid="btn-comparison-summary"]').should('exist');
    cy.get('[data-testid="btn-comparison-summary"]').click();

    // We are now on the Comparison Page
    cy.get('[data-testid="website1-select"]').should('exist');
    cy.get('[data-testid="website1-select"]').click();
    cy.get('[data-testid="website1-option-0"]').should('exist');
    cy.get('[data-testid="website1-option-1"]').should('exist');
    cy.get('[data-testid="website1-option-1"]').click();

    cy.get('[data-testid="website2-select"]').should('exist');
    cy.get('[data-testid="website2-select"]').click();
    cy.get('[data-testid="website2-select"]').type('http');

    cy.get('[data-testid="website2-option-0"]').should('exist');
    cy.get('[data-testid="website2-option-1"]').should('exist');
    cy.get('[data-testid="website2-option-1"]').click();
  });

  //   it('scrape 2 crawlable urls - github, insecure', () => {
  //     cy.visit('/');
  //     cy.get('[data-testid="scraping-textarea-home"]').type('https://github.com,https://www.hbo.com/insecure');
  //     cy.get('[data-testid="btn-start-scraping"]').click();

  //     cy.fixture('/pub-sub/github-done')
  //       .as('mock_scraper_github')
  //       .then((mock_scraper_github) => {
  //         cy.intercept(
  //           'GET',
  //           'http://localhost:3002/api/scraper?url=https%3A%2F%2Fgithub.com',
  //           mock_scraper_github
  //         ).as('mock_scraper_github_done');
  //       });

  //     cy.fixture('/pub-sub/github-done')
  //       .as('mock_scraper_github')
  //       .then((mock_scraper_github) => {
  //         cy.intercept(
  //           'GET',
  //           'http://localhost:3002/api/scraper?url=https%3A%2F%2Fwww.hbo.com%2Finsecure',
  //           mock_scraper_github
  //         ).as('mock_scraper_insecure_done');
  //       });

  //     // Mock response to Pub Sub Polling
  //     cy.fixture('/pub-sub/insecure-status')
  //       .as('mock_scraper_insecure_status')
  //       .then((mock_scraper_insecure_status) => {
  //         cy.intercept(
  //           'GET',
  //           'http://localhost:3002/api/scraper/status/scrape/https%3A%2F%2Fwww.hbo.com%2Finsecure',
  //           mock_scraper_insecure_status
  //         ).as('mock_scraper_insecure_status');
  //       });

  //     cy.fixture('/pub-sub/github-status')
  //       .as('mock_scraper_github_status')
  //       .then((mock_scraper_github_status) => {
  //         cy.intercept(
  //           'GET',
  //           'http://localhost:3002/api/scraper/status/scrape/https%3A%2F%2Fgithub.com',
  //           mock_scraper_github_status
  //         ).as('mock_scraper_github_status');
  //       });

  //     cy.fixture('/pub-sub/insecure-waiting')
  //       .as('mock_scraper_insecure_waiting')
  //       .then((mock_scraper_insecure_waiting) => {
  //         cy.intercept(
  //           'GET',
  //           'http://localhost:3002/api/scraper/status?type=scrape&url=https%3A%2F%2Fwww.hbo.com%2Finsecure',
  //           mock_scraper_insecure_waiting
  //         ).as('mock_scraper_insecure_waiting');
  //       });

  //     cy.fixture('/pub-sub/github-waiting')
  //       .as('mock_scraper_github_waiting')
  //       .then((mock_scraper_github_waiting) => {
  //         cy.intercept(
  //           'GET',
  //           'http://localhost:3002/api/scraper/status?type=scrape&url=https%3A%2F%2Fgithub.com',
  //           mock_scraper_github_waiting
  //         ).as('mock_scraper_github_waiting');
  //       });

  //     cy.wait('@mock_scraper_github_done',{ timeout: 11000 });
  //     cy.wait('@mock_scraper_insecure_done',{ timeout: 11100 });

  //     //Wait 5 Seconds
  //     //THen check if the text insecure and github exist on the page

  //     // Assert that the URL is the scraperesults URL
  //     cy.url().should('include', 'scraperesults');

  //     cy.get('[data-testid="btn-comparison-summary"]').should('exist');
  //     cy.get('[data-testid="btn-comparison-summary"]').click();

  //     // We are now on the Comparison Page
  //     cy.get('[data-testid="website1-select"]').should('exist');
  //     cy.get('[data-testid="website1-select"]').click();
  // /* cy.get('[data-testid="website1-option-0"]').should('exist');
  //     cy.get('[data-testid="website1-option-1"]').should('exist');
  //     cy.get('[data-testid="website1-option-1"]').click(); */

  //     cy.get('[data-testid="website2-select"]').should('exist');
  //     cy.get('[data-testid="website2-select"]').click();
  //     cy.get('[data-testid="website2-select"]').type('http');

  // /*  cy.get('[data-testid="website2-option-0"]').should('exist');
  //     cy.get('[data-testid="website2-option-1"]').should('exist');
  //     cy.get('[data-testid="website2-option-1"]').click();
  // */

  //   });
});
