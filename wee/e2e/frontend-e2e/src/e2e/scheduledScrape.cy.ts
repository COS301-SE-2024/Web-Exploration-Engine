describe('Scheduled Scrape Page (Logged In User)', () => {

  it('Should log in and navigate to Schedule scraping', () => {
    // Visit the login page
    cy.visit('/login');

    // Fill out the login form
    cy.get('input').eq(0).type('testusere2e@example.com'); // Email
    cy.get('input').eq(1).type('password123');             // Password

    // Click submit button
    cy.get('button[data-testid="login-button"]').click();

    // After login, wait for the navigation link to appear (break up the chain)
    cy.get('a.text-dark-primaryTextColor')
      .should('exist')
      .should('be.visible');

    // Now select the link containing "Scheduled Tasks" separately and click
    cy.contains('Scheduled Tasks').click();


    cy.url().should('include', '/scheduled-tasks');

    // Wait for the scheduled tasks message to appear after the click
    cy.contains('1 tasks scheduled. 9 slots remaining.')
      .should('exist')
      .and('be.visible');

   // Checking table headers (if they exist)
    cy.contains('URL').should('exist').and('be.visible');
    cy.contains('NEXT SCHEDULED SCRAPE').should('exist').and('be.visible');
    cy.contains('ACTIONS').should('exist').and('be.visible');
    cy.contains('DASHBOARD').should('exist').and('be.visible');

    // Checking specific URL and scheduled scrape time
    cy.contains('https://wee-test-site-2.netlify.app/').should('exist').and('be.visible');
    cy.contains('19/10/2024, 09:25:54').should('exist').and('be.visible');

    // Now click the "View" button, ensuring it's visible before interacting
    cy.contains('button', 'View').should('exist').and('be.visible').click();
  });
});
