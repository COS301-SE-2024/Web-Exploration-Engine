describe('results', () => {
  it('general layout intact', () => {
    cy.testLayout('/results');
  });

  it('all page content should load', () => {
    cy.visit('/results?');

    //Testing Export / Save Button
    cy.get('[data-testid="btn-export-save-report"]').should('exist');
    cy.get('[data-testid="btn-export-save-report"]').click();
    cy.get('[data-testid="btn-export-save-report"]').should('exist');


    //Page Tab : General Overview
    cy.log('Testing General overview tab');

    cy.contains(/overview/i).should('exist');
    cy.contains(/parked/i).should('exist');
    cy.contains(/seo/i).should('exist');
    cy.contains(/contact details/i).should('exist');

    cy.log('Testing tabs and buttons exist');
    cy.get('[data-testid="tab-seo"]').should('exist');
    cy.get('[data-testid="tab-seo"]').click();
    cy.contains(/media/i).should('exist');
    cy.contains(/seo/i).should('exist');
    cy.contains(/export/i).should('exist');

    // Page Tab : Media
    cy.log('Testing Media Tab');

    cy.get('[data-testid="tab-media"]').click();
    cy.contains(/screenshot/i).should('exist');
    cy.contains(/screenshot available./i).should('exist');
    cy.contains(/images/i).should('exist');
    cy.contains(/No images available/i).should('exist');

    // Page Tab : SEO Analysis
    cy.log('Testing SEO Analysis');

    cy.get('[data-testid="tab-seo"]').click();
    cy.contains(/images/i).should('exist');
    cy.contains(/internal linking/i).should('exist');
    cy.contains(/headings/i).should('exist');
    cy.contains(/meta/i).should('exist');
    cy.contains(/title tags/i).should('exist');
    cy.contains(/unique content/i).should('exist');

    // Page Tab : Sentiment Analysis
    cy.log('Testing Sentiment Analysis');

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
  });
});
