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

    cy.get('a.text-dark-primaryTextColor', { timeout: 60000 }) // Increase timeout to 10 seconds
  .contains('Saved Reports')
  .click();


     // check the contents if they exist
     cy.contains('Home').should('exist');
     cy.contains('Help').should('exist');
     cy.contains('Saved Reports').should('exist');
     cy.contains('Scheduled Tasks').should('exist');


     cy.contains('Reports').should('exist');

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


     //view the saved reports


     // Click the button with the constructed data-testid
     cy.get(`[data-testid="btnView0"]`)
       .should('be.visible')  // Ensure the button is visible
       .click();

      //contents that should be in the page
       const contentToVerify = [

        'site2Report: https://wee-test-site-2.netlify.app/',
        'Thu Sep 19 2024',
        'Summary',
        'Homev | Bluise',
        'A quickstart for Nuxt & Netlify CMS',
        'SCRAPING CATEGORY',
        'INFORMATION',
        'Crawlable',
        'Yes',
        'Status',
        'Live',
        'Industry',
        'undefined',
        'Confidence Score: 0%',
        'Domain match',
        'undefined',
        'Confidence Score: 0%',
        'No images available.',

      ];

      // Iterate over the content to verify each item
      contentToVerify.forEach((text) => {
        cy.contains(text, { timeout: 60000 }) // Set timeout to 10 seconds (10000ms)
          .should('be.visible');
      });


     //saved summaries

     cy.get('[data-testid="tab-summaries"]')
    .click()
    .wait(6000); // Waits for 2000 milliseconds (2 seconds) after clicking


      cy.get('table').should('contain', 'myFirstSummary');
      cy.get('table').should('contain', '2024-09-19T07:07:55.772+00:00');



  });


});
