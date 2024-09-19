describe('Scheduled Scrape Page (Logged In User)', () => {

  it('Should log in and navigate to Schedule scraping', () => {
    // Visit the login page
    cy.visit('/login');

    // Fill out the login form
    cy.get('input').eq(0).type('testusere2e@example.com'); // Email
    cy.get('input').eq(1).type('password123');             // Password

    // Click submit button
    cy.get('button[data-testid="login-button"]').click();

    // Wait for the "Saved Reports" link to appear and click it
    cy.get('a.text-dark-primaryTextColor', { timeout: 60000 }) // Set a longer timeout if needed
      .contains('Scheduled Tasks')
      .click();

  });
});
