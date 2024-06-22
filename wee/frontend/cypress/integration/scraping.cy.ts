import "commands"
describe('landing page', () => {
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

  it('successfully scrapes 1 crawlable url', () => {
    cy.visit('/');

    //enter the url into the the box
    cy.get('[data-testid="scraping-textarea-home"]').type('https://github.com');

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
    cy.wait('@mock_scraper_github');

    // Assert that the URL is the scraperesults URL
    cy.url().should('include', 'scraperesults');

    //Now I'm here , I should also be able to see a table and when i click on the view button it should change the url

    cy.get('[data-testid="btnView"]').click();

    //now the url should be changed
    cy.url().should('include', 'https%3A%2F%2Fgithub.com%2F');
  });

  it('successfully scrape 2 crawlable urls', () => {
    cy.visit('/');

    //enter the url into the the box
    cy.get('[data-testid="scraping-textarea-home"]').type('https://github.com,unsplash.com');

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

    //Now I'm here , I should also be able to see a table and when i click on the view button it should change the url

    cy.get('[data-testid="btnView"]').click();

    //now the url should be changed
    cy.url().should('include', 'https%3A%2F%2Funsplash.com%2F');
  });

  it('successfully scrape 1 crawlable url, 1 uncrawlable url', () => {
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

    // Assert that the URL is the scraperesults URL
    cy.url().should('include', 'scraperesults');

    //Now I'm here , I should also be able to see a table and when i click on the view button it should change the url

    cy.get('[data-testid="btnView"]').click();

    //now the url should be changed
    cy.url().should('include', 'https%3A%2F%2Ffakewebsite.co.za%2F');
  });
}); // end of describe
