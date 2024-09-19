describe('saved reports page', () => {

  it('summaries page content should be present', () => {
    cy.visit('/');

    //login first
    cy.visit('/login');

    // Fill out the login form
    cy.get('input').eq(0).type('testusere2e@example.com'); // Email
    cy.get('input').eq(1).type('password123');          // Password

    // Click submit button
    cy.get('button[data-testid="login-button"]').click();

    cy.get('a.text-dark-primaryTextColor', { timeout: 10000 }) // Increase timeout to 10 seconds
  .contains('Saved Reports')
  .click();


     // check the contents if they exist
     cy.contains('Home').should('exist');
     cy.contains('Help').should('exist');
     cy.contains('Saved Reports').should('exist');
     cy.contains('Scheduled Tasks').should('exist');
     cy.contains('My Reports').should('exist');

     cy.contains('Reports').should('exist');

     cy.contains('Total 2 reports saved').should('exist');

     cy.contains('Results per page:').should('exist');

     // Verify the table headers and rows (if applicable)
     cy.get('table').within(() => {
       cy.contains('NAME').should('exist');
       cy.contains('TIMESTAMP').should('exist');
       cy.contains('RESULT & REPORT').should('exist');
       cy.contains('DELETE').should('exist');

       cy.contains('site2Report').should('exist');
       cy.contains('2024-09-19T07:04:32.94+00:00').should('exist');
       cy.contains('site1report').should('exist');
       cy.contains('2024-09-19T07:06:39.02+00:00').should('exist');
     });


  });


});
