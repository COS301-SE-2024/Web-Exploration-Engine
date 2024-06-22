describe('scraping functionality', () => {
  beforeEach(() => {
    //Get all mocks then intercept all api requests using those mocks
    cy.fixture('/api/scraper/github')
      .as('mock_scraper_github')
      .then((mock_scraper_github) => {
        cy.intercept(
          'GET',
          'http://localhost:3000/api/scraper?url=https%3A%2F%2Fgithub.com',
          mock_scraper_github
        ).as('mock_scraper_github');
      });

    cy.fixture('/api/scraper/classify-industry/github')
      .as('mock_industry_github')
      .then((mock_industry_github) => {
        cy.intercept(
          'GET',
          'http://localhost:3000/api/scraper/classify-industry?url=https%3A%2F%2Fgithub.com',
          mock_industry_github
        ).as('mock_industry_github');
      });

    cy.fixture('/api/scraper/read-robots/github')
      .as('mock_robots_github')
      .then((mock_robots_github) => {
        cy.intercept(
          'GET',
          'http://localhost:3000/api/scraper/read-robots?url=https%3A%2F%2Fgithub.com',
          mock_robots_github
        ).as('mock_robots_github');
      });

    cy.fixture('/api/scraper/scrape-images/github')
      .as('mock_images_github')
      .then((mock_images_github) => {
        cy.intercept(
          'GET',
          'http://localhost:3000/api/scraper/scrape-images?url=https%3A%2F%2Fgithub.com',
          mock_images_github
        ).as('mock_images_github');
      });

    cy.fixture('/api/scraper/scrape-logo/github')
      .as('mock_logo_github')
      .then((mock_logo_github) => {
        cy.intercept(
          'GET',
          'http://localhost:3000/api/scraper/scrape-logo?url=https%3A%2F%2Fgithub.com',
          mock_logo_github
        ).as('mock_logo_github');
      });

    cy.fixture('/api/scraper/scrape-metadata/github')
      .as('mock_metadata_github')
      .then((mock_metadata_github) => {
        cy.intercept(
          'GET',
          'http://localhost:3000/api/scraper/scrape-metadata?url=https%3A%2F%2Fgithub.com',
          mock_metadata_github
        ).as('mock_metadata_github');
      });

    cy.fixture('/api/scraper/scrape-status/github')
      .as('mock_status_github')
      .then((mock_status_github) => {
        cy.intercept(
          'GET',
          'http://localhost:3000/api/scraper/scrape-status?url=https%3A%2F%2Fgithub.com',
          mock_status_github
        ).as('mock_status_github');
      });

    //end of before each
  });
  //end of describe

  it('correct page loads', () => {
    cy.visit('/');
    cy.contains(/The Web Exploration Engine/i).should('exist');
  });

  it('help should be available', () => {
    cy.visit('/');
    cy.get('[data-testid="help-button"]').should('exist');
  });

  it('1 crawlable url, view results', () => {
    cy.visit('/');

    cy.get('[data-testid="scraping-textarea-home"]').type('https://github.com');

    cy.get('[data-testid="btn-start-scraping"]').click();

    cy.fixture('/api/scraper/github')
      .as('mock_scraper_github')
      .then((mock_scraper_github) => {
        cy.intercept(
          'GET',
          'http://localhost:3000/api/scraper?url=https%3A%2F%2Fgithub.com',
          mock_scraper_github
        ).as('mock_scraper_github');
      });

    cy.wait('@mock_scraper_github');

    // Assert that the URL is the scraperesults URL
    cy.url().should('include', 'scraperesults');

    cy.get('[data-testid="btnView0"]').should('exist');
    cy.get('[data-testid="btnView0"]').click();

    //Story : View results
    cy.url().should('include', 'https%3A%2F%2Fgithub.com%2F');
  });

  it('2 crawlable urls, filterable results, individual reports, ', () => {
    cy.visit('/');

    //Story : Enter multiple URLs
    cy.get('[data-testid="scraping-textarea-home"]').type(
      'https://github.com,https://unsplash.com'
    );

    cy.get('[data-testid="btn-start-scraping"]').click();

    cy.fixture('/api/scraper/github')
      .as('mock_scraper_github')
      .then((mock_scraper_github) => {
        cy.intercept(
          'GET',
          'http://localhost:3000/api/scraper?url=https%3A%2F%2Fgithub.com',
          mock_scraper_github
        ).as('mock_scraper_github');
      });

    cy.fixture('/api/scraper/unsplash')
      .as('mock_scraper_unsplash')
      .then((mock_scraper_unsplash) => {
        cy.intercept(
          'GET',
          'http://localhost:3000/api/scraper?url=https%3A%2F%2Funsplash.com',
          mock_scraper_unsplash
        ).as('mock_scraper_unsplash');
      });

    //Then i should be on the scrape results page
    // Wait for the intercepted request
    cy.wait('@mock_scraper_unsplash');

    // Assert that the URL is the scraperesults URL
    cy.url().should('include', 'scraperesults');

    //Story : Filter specific URLs
    cy.get('[data-testid="search-urls"]').type('unsplash');

    //ensure that the button for unsplash isnt there
    cy.contains(/git/i).should('not.exist');

    //Story : View results
    cy.get('[data-testid="btnView0"]').click();

    //now the url should be changed
    cy.url().should('include', 'unsplash.com');

    //Story : See industry classification, domain watch
    cy.url().should('include', 'unsplash');
    cy.contains(/results of http/i).should('exist');
    cy.contains(/industry/i).should('exist');
    cy.contains(/domain match/i).should('exist');
    cy.contains(/confidence score/i).should('exist');
  });

  it('1/2 crawlable url, view overall report', () => {
    cy.visit('/');

    //enter the url into the the box
    cy.get('[data-testid="scraping-textarea-home"]').type(
      'https://github.com,https://fakewebsite.co.za'
    );

    //then the response from there should be intercepted and return mock predictable data
    //then
    cy.get('[data-testid="btn-start-scraping"]').click();

    cy.fixture('/api/scraper/github')
      .as('mock_scraper_github')
      .then((mock_scraper_github) => {
        cy.intercept(
          'GET',
          'http://localhost:3000/api/scraper?url=https%3A%2F%2Fgithub.com',
          mock_scraper_github
        ).as('mock_scraper_github');
      });

    cy.fixture('/api/scraper/fakewebsite')
      .as('mock_scraper_fakewebsite')
      .then((mock_scraper_fakewebsite) => {
        cy.intercept(
          'GET',
          'http://localhost:3000/api/scraper?url=https%3A%2F%2Ffakewebsite.co.za',
          mock_scraper_fakewebsite
        ).as('mock_scraper_fakewebsite');
      });

    //Then i should be on the scrape results page
    // Wait for the intercepted request
    cy.wait('@mock_scraper_fakewebsite');
    cy.wait('@mock_scraper_github');

    // click on report summary button
    // Story : See overall report
    cy.url().should('include', 'scraperesults');
    cy.get('[data-testid="btn-report-summary"]').click();

    //Story : Summary of industry classifcations, status, domain
    cy.contains(/1/i).should('exist');
    cy.contains(/2/i).should('exist');
    cy.contains(/scrape time/i).should('exist');
    cy.contains(/50/i).should('exist');
    cy.contains(/no weak classifications/i).should('exist');
    cy.contains(/Parked sites/i).should('exist');
  });
}); // end of describe
