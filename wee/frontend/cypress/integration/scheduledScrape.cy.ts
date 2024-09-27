
describe('Scheduled Scrape Page (Logged In User)', () => {

  it('Should display scheduled tasks', () => {
    // Wait for the scheduled tasks message to appear
    cy.visit('/scheduledscrape')

    cy.url().should('include', '/scheduledscrape');
    cy.contains('Scheduled Scraping Tasks').should('be.visible');

    // Check for the task count message
    cy.contains('0 tasks scheduled. 10 slots remaining.').should('be.visible');

    // Verify the presence of table headers or relevant columns
    cy.get('table') // Assuming you have a table structure
      .find('th')
      .should('have.length', 4) // Check that there are 4 columns
      .contains('URL') // Check that the URL header is present
      .should('be.visible');

    cy.get('table')
      .find('th')
      .contains('NEXT SCHEDULED SCRAPE') // Check that the NEXT SCHEDULED SCRAPE header is present
      .should('be.visible');

    cy.get('table')
      .find('th')
      .contains('ACTIONS') // Check that the ACTIONS header is present
      .should('be.visible');

    cy.get('table')
      .find('th')
      .contains('DASHBOARD') // Check that the DASHBOARD header is present
      .should('be.visible');
   });
  //  context('When scheduled tasks are present', () => {
  //   beforeEach(() => {
  //     // Intercept the API call to simulate scheduled tasks being present
  //     cy.intercept('GET', '/api/scheduledscrape', {
  //            fixture: 'api/scraper/scheduled-scrapes/github.json'
  //     }).as('getScheduledScrapeData');
  //   });

  //   it('Should display the scheduled tasks', () => {
  //     // Visit the scheduled scrape page
  //     cy.visit('/scheduledscrape');

  //     // Wait for the data to load
  //     cy.wait('@getScheduledScrapeData');

  //     // Verify that the heading is visible
  //     cy.contains('Scheduled Scraping Tasks').should('be.visible');

  //     // Check for the message reflecting scheduled tasks
  //     cy.contains('1 task scheduled. 9 slots remaining.').should('be.visible'); // Adjust this line based on your data

  //     // Verify the presence of table with scheduled tasks
  //     cy.get('table')
  //       .find('tr') // Ensure there are rows in the table
  //       .should('have.length.greaterThan', 1) // At least one row for the header and one for data
  //       .within(() => {
  //         cy.get('td') // Check for data cells
  //           .should('have.length', 4); // Assuming each task has 4 data points
  //       });

  //     // Verify specific task details if necessary
  //     cy.get('table').contains('https://example.com'); // Example URL, adjust based on actual data
  //     cy.get('table').contains('Scheduled Time'); // Adjust based on your expected scheduled time
  //     cy.get('table').contains('Action Button Text'); // Replace with actual action button text
  //   });
  // });
});
