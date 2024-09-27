/* eslint-disable cypress/unsafe-to-chain-command */
describe('Scheduled Scrape Page (Logged In User)', () => {

  it('Should log in and navigate to Schedule scraping', () => {
    // Visit the login page
    cy.visit('/login');

    // Fill out the login form
    cy.get('input').eq(0).type('testusere2e@example.com'); // Email
    cy.get('input').eq(1).type('password123');             // Password

    // Click submit button
    cy.get('button[data-testid="login-button"]').click();

    // Assert URL has changed after login
    cy.url().should('not.include', '/login');

    // Wait for the navigation link to appear (ensure the page has loaded fully)
    cy.get('a.text-dark-primaryTextColor')
      .should('exist')
      .should('be.visible');

    // Now select the link containing "Scheduled Tasks" and click
    // cy.contains('Scheduled Tasks').click({force:true});

    cy.get('a.text-dark-primaryTextColor', { timeout: 120000 })
  .contains('Scheduled Tasks')
  .click();

    // Assert URL has changed to scheduled tasks page
     cy.url().should('include', 'schedule');

    // Wait for the scheduled tasks message to appear
    cy.contains('1 tasks scheduled. 9 slots remaining.')
    .should('be.visible') // Wait until the element is visible
    .and('exist'); // Then check if it exists

    // Checking table headers (if they exist)
    cy.contains('URL').should('exist').and('be.visible');
    cy.contains('NEXT SCHEDULED SCRAPE').should('exist').and('be.visible');
    cy.contains('ACTIONS').should('exist').and('be.visible');
    cy.contains('DASHBOARD').should('exist').and('be.visible');

    // Checking specific URL and scheduled scrape time
    cy.contains('https://wee-test-site-2.netlify.app/')
      .should('exist')
      .and('be.visible');
    // cy.contains('19/10/2024, 09:25:54')
    //   .should('exist')
    //   .and('be.visible');

    cy.contains('button', 'View')
    .should('exist')
    .and('be.visible');

    cy.contains('button', 'View').click().then(() => {
// Check the existence and content of the "No keywords are being tracked" message
  cy.get('[data-testid="dashboard-keyword-not-available"]')
.should('exist')
.should('have.class', 'bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center')
.should('contain.text', 'No keywords are being tracked');

// Check that the apexchart container exists

cy.get('foreignObject').first().within(() => {
  cy.get('.apexcharts-legend-series[rel="1"]').within(() => {
    cy.get('.apexcharts-legend-marker')
      .should('have.css', 'background-color', 'rgb(94, 205, 195)'); // Verify color
    cy.get('.apexcharts-legend-text')
      .should('contain.text', 'Accessibility');


  });
    });

  });
});

  });
