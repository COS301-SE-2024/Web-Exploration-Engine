describe('summaryreport', () => {
  it('should be on right page', () => {
    cy.visit('/summaryreport');
    cy.contains(/Summary Report/i).should('exist');

    //Page Section : General Statistics
    cy.get('[data-testid="visual-scraped-stats"]').should('exist');
    cy.get('[data-testid="visual-scraped-stats"]').should('be.visible');
    cy.get('[data-testid="visual-scraped-stats"]').screenshot(
      'visual-scraped-stats'
    );
    cy.get('[data-testid="visual-scraped-stats"]')
      .should('contain.text', 'Scraped', { matchCase: false })
      .should('contain.text', 'Urls', { matchCase: false });

    cy.get('[data-testid="visual-crawlable-stats"]').should('exist');
    cy.get('[data-testid="visual-crawlable-stats"]').should('be.visible');
    cy.get('[data-testid="visual-crawlable-stats"]').screenshot(
      'visual-crawlable-stats'
    );
    cy.get('[data-testid="visual-crawlable-stats"]')
      .should('contain.text', 'Crawlable', { matchCase: false })
      .should('contain.text', 'Urls', { matchCase: false });

    cy.get('[data-testid="visual-avg-scrape-stats"]').should('exist');
    cy.get('[data-testid="visual-avg-scrape-stats"]').should('be.visible');
    cy.get('[data-testid="visual-avg-scrape-stats"]').screenshot(
      'visual-avg-scrape-stats'
    );
    cy.get('[data-testid="visual-avg-scrape-stats"]')
      .should('contain.text', 'sec', { matchCase: false })
      .should('contain.text', 'scrape time', { matchCase: false });

    //Section : Industry Classification

    //Industry Classification Div
    cy.get('[data-testid="visual-industry-classification"]').should('exist');
    cy.get('[data-testid="visual-industry-classification"]').should(
      'be.visible'
    );
    cy.get('[data-testid="visual-industry-classification"]').screenshot(
      'visual-industry-classification'
    );
    cy.get('[data-testid="visual-industry-classification"]').should(
      'contain.text',
      'Classification Distribution',
      { matchCase: false }
    );

    //Weak Classifcation Div
    cy.get('[data-testid="visual-weak-classifications"]').should('exist');
    cy.get('[data-testid="visual-weak-classifications"]').should('be.visible');
    cy.get('[data-testid="visual-weak-classifications"]').screenshot(
      'visual-weak-classifications'
    );
    cy.get('[data-testid="visual-weak-classifications"]').should(
      'contain.text',
      'URLSCOREThere was no weak classifications',
      { matchCase: false }
    );

    //Weak Classifcation Table
    cy.get('[data-testid="table-weak-classifications"]').should('exist');
    cy.get('[data-testid="table-weak-classifications"]').should('be.visible');
    cy.get('[data-testid="table-weak-classifications"]').screenshot(
      'visual-table-weak-classifications'
    );
    cy.get('[data-testid="table-weak-classifications"]').should(
      'contain.text',
      'URLSCOREThere was no weak classifications',
      { matchCase: false }
    );

    cy.get('[data-testid="table-weak-classifications"]')
      .find('th')
      .first()
      .should('contain.text', 'URL');

    cy.get('[data-testid="table-weak-classifications"]')
      .find('th')
      .eq(1)
      .should('contain.text', 'SCORE');

    cy.get('[data-testid="table-weak-classifications"]')
      .find('tbody')
      .should('contain.text', 'no weak classifications', { matchCase: false });

    //Section : Domain Match

    //Domain Mismatch Information
    cy.get('[data-testid="visual-domain-match"]').should('exist');
    cy.get('[data-testid="visual-domain-match"]').should('be.visible');
    cy.get('[data-testid="visual-domain-match"]').screenshot(
      'visual-domain-match'
    );
    cy.get('[data-testid="visual-domain-match"]').should(
      'contain.text',
      'Match0%Domain mismatch informationURLCLASSIFICATION - METADOMAIN MATCHThere was no mismatch',
      { matchCase: false }
    );

    //Domain Mismatch Table
    cy.get('[data-testid="table-domain-match"]').should('exist');
    cy.get('[data-testid="table-domain-match"]').should('be.visible');
    cy.get('[data-testid="table-domain-match"]').screenshot(
      'table-domain-match'
    );
    cy.get('[data-testid="table-domain-match"]').should(
      'contain.text',
      'URLCLASSIFICATION - METADOMAIN MATCHThere was no mismatch',
      { matchCase: false }
    );

    cy.get('[data-testid="table-domain-match"]')
      .find('th')
      .eq(0)
      .should('contain.text', 'URL');

    cy.get('[data-testid="table-domain-match"]')
      .find('th')
      .eq(1)
      .should('contain.text', 'CLASSIFICATION - META');

    cy.get('[data-testid="table-domain-match"]')
      .find('th')
      .eq(2)
      .should('contain.text', 'DOMAIN MATCH');

    // Section : Classification Distribution
  });

  it('general layout should be consistent', () => {
    cy.testLayout('/summaryreport');
  });

  it('summary report for 3 urls - steers, wimpy, github', () => {
    cy.visit('/');
    cy.get('[data-testid="scraping-textarea-home"]').type(
      'https://mock.test.steers.co.za,https://mock.test.wimpy.co.za,https://mock.test.github.com'
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

    //======================================================
    // Wimpy Mock
    //======================================================

    //Full response
    cy.fixture('/pub-sub/wimpy-done')
      .as('mock_scraper_mockwimpy_done')
      .then((mock_scraper_mockwimpy_done) => {
        cy.intercept(
          'GET',
          'http://localhost:3002/api/scraper?url=https%3A%2F%2Fmock.test.wimpy.co.za', //mock.test.wimpy.co.za
          mock_scraper_mockwimpy_done
        ).as('mock_scraper_mockwimpy_done');
      });

    //Pub Sub - Publish Event
    cy.fixture('/pub-sub/wimpy-waiting')
      .as('mock_scraper_mockwimpy_waiting')
      .then((mock_scraper_mockwimpy_waiting) => {
        cy.intercept(
          'GET',
          'http://localhost:3002/api/scraper/status?type=scrape&url=https%3A%2F%2Fmock.test.wimpy.co.za',
          mock_scraper_mockwimpy_waiting
        ).as('mock_scraper_mockwimpy_waiting');
      });

    //Pub Sub - Get Event Status
    cy.fixture('/pub-sub/wimpy-status')
      .as('mock_scraper_mockwimpy_status')
      .then((mock_scraper_mockwimpy_status) => {
        cy.intercept(
          'GET',
          'http://localhost:3002/api/scraper/status/scrape/https%3A%2F%2Fmock.test.wimpy.co.za',
          mock_scraper_mockwimpy_status
        ).as('mock_scraper_mockwimpy_status');
      });

    //======================================================
    // Insecure Mock
    //======================================================

    //Full response
    cy.fixture('/pub-sub/insecure-done')
      .as('mock_scraper_mockinsecure_done')
      .then((mock_scraper_mockinsecure_done) => {
        cy.intercept(
          'GET',
          'http://localhost:3002/api/scraper?url=https%3A%2F%2Fmock.test.insecure.co.za', //mock.test.insecure.co.za
          mock_scraper_mockinsecure_done
        ).as('mock_scraper_mockinsecure_done');
      });

    //Pub Sub - Publish Event
    cy.fixture('/pub-sub/insecure-waiting')
      .as('mock_scraper_mockinsecure_waiting')
      .then((mock_scraper_mockinsecure_waiting) => {
        cy.intercept(
          'GET',
          'http://localhost:3002/api/scraper/status?type=scrape&url=https%3A%2F%2Fmock.test.insecure.co.za',
          mock_scraper_mockinsecure_waiting
        ).as('mock_scraper_mockinsecure_waiting');
      });

    //Pub Sub - Get Event Status
    cy.fixture('/pub-sub/insecure-status')
      .as('mock_scraper_mockinsecure_status')
      .then((mock_scraper_mockinsecure_status) => {
        cy.intercept(
          'GET',
          'http://localhost:3002/api/scraper/status/scrape/https%3A%2F%2Fmock.test.insecure.co.za',
          mock_scraper_mockinsecure_status
        ).as('mock_scraper_mockinsecure_status');
      });

    //======================================================
    // Cypress Waits
    //======================================================

    //Wait for github to finish
    cy.wait('@mock_scraper_mockgithub_done');

    //Wait for steers to finish
    cy.wait('@mock_scraper_mocksteers_done');

    //Wait for wimpy to finish
    cy.wait('@mock_scraper_mockwimpy_done');

    cy.url().should('include', 'scraperesults');
    cy.wait(9000);

    cy.get('[data-testid="btn-report-summary"]');
    cy.get('[data-testid="btn-report-summary"]').click();
    cy.url().should('include', 'summary');

    //======================================================
    // Checking Content
    //======================================================

    //cy.get('[data-test-id="your-div-id"]')
    // Find the label within the selected div
    //.find('label')
    // Assert the text of the label
    //.should('have.text', 'Expected Label Text');

    //Page Section : General Statistics
    cy.get('[data-testid="visual-scraped-stats"]').should('exist');
    cy.get('[data-testid="visual-scraped-stats"]').should('be.visible');
    cy.get('[data-testid="visual-scraped-stats"]').screenshot(
      'visual-scraped-stats'
    );
    cy.get('[data-testid="visual-scraped-stats"]')
      .should('contain.text', '3', { matchCase: false })
      .should('contain.text', 'Scraped', { matchCase: false })
      .should('contain.text', 'Urls', { matchCase: false });

    cy.get('[data-testid="visual-crawlable-stats"]').should('exist');
    cy.get('[data-testid="visual-crawlable-stats"]').should('be.visible');
    cy.get('[data-testid="visual-crawlable-stats"]').screenshot(
      'visual-crawlable-stats'
    );
    cy.get('[data-testid="visual-crawlable-stats"]')
      .should('contain.text', '3', { matchCase: false })
      .should('contain.text', 'Crawlable', { matchCase: false })
      .should('contain.text', 'Urls', { matchCase: false });

    cy.get('[data-testid="visual-avg-scrape-stats"]').should('exist');
    cy.get('[data-testid="visual-avg-scrape-stats"]').should('be.visible');
    cy.get('[data-testid="visual-avg-scrape-stats"]').screenshot(
      'visual-avg-scrape-stats'
    );
    cy.get('[data-testid="visual-avg-scrape-stats"]')
      .should('contain.text', '48.82', { matchCase: false })
      .should('contain.text', 'sec', { matchCase: false })
      .should('contain.text', 'scrape time', { matchCase: false });

    //Section : Industry Classification

    //Industry Classification Div
    cy.get('[data-testid="visual-industry-classification"]').should('exist');
    cy.get('[data-testid="visual-industry-classification"]').should(
      'be.visible'
    );
    cy.get('[data-testid="visual-industry-classification"]').screenshot(
      'visual-industry-classification'
    );
    cy.get('[data-testid="visual-industry-classification"]').should(
      'contain.text',
      'Classification Distribution',
      { matchCase: false }
    );

    //Weak Classifcation Div
    cy.get('[data-testid="visual-weak-classifications"]').should('exist');
    cy.get('[data-testid="visual-weak-classifications"]').should('be.visible');
    cy.get('[data-testid="visual-weak-classifications"]').screenshot(
      'visual-weak-classifications'
    );
    cy.get('[data-testid="visual-weak-classifications"]').should(
      'contain.text',
      'Weak classificationsiURLSCOREhttps://github.com36.69%',
      { matchCase: false }
    );

    //Weak Classifcation Table
    cy.get('[data-testid="table-weak-classifications"]').should('exist');
    cy.get('[data-testid="table-weak-classifications"]').should('be.visible');
    cy.get('[data-testid="table-weak-classifications"]').screenshot(
      'visual-table-weak-classifications'
    );
    cy.get('[data-testid="table-weak-classifications"]').should(
      'contain.text',
      'URLSCOREhttps://github.com36.69%',
      { matchCase: false }
    );

    cy.get('[data-testid="table-weak-classifications"]')
      .find('th')
      .first()
      .should('contain.text', 'URL');

    cy.get('[data-testid="table-weak-classifications"]')
      .find('th')
      .eq(1)
      .should('contain.text', 'SCORE');

    cy.get('[data-testid="table-weak-classifications"]')
      .find('tbody')
      .should('contain.text', 'https://github.com36.69%', { matchCase: false });

    //Section : Domain Match

    //Domain Mismatch Information
    cy.get('[data-testid="visual-domain-match"]').should('exist');
    cy.get('[data-testid="visual-domain-match"]').should('be.visible');
    cy.get('[data-testid="visual-domain-match"]').screenshot(
      'visual-domain-match'
    );
    //cy.get('[data-testid="visual-domain-match"]')
    //.should('contain.text','Match0%Domain mismatch informationURLCLASSIFICATION - METADOMAIN MATCHhttps://github.comConstructionMining and Mineralshttps://steers.co.zaRestaurantsFitness and Wellnesshttps://wimpy.co.zaRestaurantsFitness and Wellness',{ matchCase: false })

    //Domain Mismatch Table
    cy.get('[data-testid="table-domain-match"]').should('exist');
    cy.get('[data-testid="table-domain-match"]').should('be.visible');
    cy.get('[data-testid="table-domain-match"]').screenshot(
      'table-domain-match'
    );
    //cy.get('[data-testid="table-domain-match"]')
    //.should('contain.text','URLCLASSIFICATION - METADOMAIN MATCHhttps://github.comConstructionMining and Mineralshttps://steers.co.zaRestaurantsFitness and Wellnesshttps://wimpy.co.zaRestaurantsFitness and Wellness',{ matchCase: false })

    cy.get('[data-testid="table-domain-match"]')
      .find('th')
      .eq(0)
      .should('contain.text', 'URL');

    cy.get('[data-testid="table-domain-match"]')
      .find('th')
      .eq(1)
      .should('contain.text', 'CLASSIFICATION - META');

    cy.get('[data-testid="table-domain-match"]')
      .find('th')
      .eq(2)
      .should('contain.text', 'DOMAIN MATCH');

    // Section : Classification Distribution
    cy.get('[id="area-chart"]').should('exist').should('be.visible');

    //Section : Save Export Button
    cy.get('[id="btn-save-export"]')
      .should('exist')
      .should('be.visible')
      .click();

    // Save Button
    cy.get('[data-testid="dropdown-item-save"]')
      .should('be.visible')
      .should(
        'contain.text',
        'Sign up or log in to save the report on our website'
      )
      .should('contain.text', 'Save');

    cy.get('[data-testid="dropdown-item-download"]')
      .should('be.visible')
      .should('contain.text', 'Download the report to your device')
      .should('contain.text', 'Download');
  });
});
