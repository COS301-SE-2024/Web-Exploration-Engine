describe('saved reports page', () => {

  it('Saving and viewing saved reports', () => {
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

       cy.contains(/crawlable/i).should('exist');
       cy.contains(/yes/i).should('exist'); // Check for Crawlable status

       cy.contains(/status/i).should('exist');
       cy.contains(/live/i).should('exist'); // Check for Status

       cy.contains(/industry/i).should('exist');
       cy.contains(/health care/i).should('exist'); // Check for Industry

       cy.contains(/confidence score/i).should('exist'); // Check for Confidence Score

       // Verify Confidence Scores for various industries
       cy.contains(/information technology/i).should('exist');
       cy.contains(/42.80%/i).should('exist'); // Confidence Score for Health Care
       cy.contains(/36.68%/i).should('exist'); // Confidence Score for Information Technology
       cy.contains(/chemicals/i).should('exist');
       cy.contains(/24.80%/i).should('exist'); // Confidence Score for Chemicals

       // Verify Domain Matches
       cy.contains(/domain match/i).should('exist');
       cy.contains(/telecommunications/i).should('exist'); // Domain match
       cy.contains(/63.31%/i).should('exist'); // Confidence Score for Telecommunications
       cy.contains(/information technology/i).should('exist'); // Domain match again
       cy.contains(/20.83%/i).should('exist'); // Confidence Score for Information Technology
       cy.contains(/marine and shipping/i).should('exist'); // Domain match
       cy.contains(/16.76%/i).should('exist'); // Confidence Score for Marine and Shipping


      //go back
      cy.contains('button', 'Back').click();

     //saved summaries

     cy.get('[data-testid="tab-summaries"]', { timeout: 60000 })
    .click();
     // Waits for 2000 milliseconds (2 seconds) after clicking


      cy.get('table').should('contain', 'myFirstSummary');
      cy.get('table').should('contain', '2024-09-19T07:07:55.772+00:00');


      cy.get(`[data-testid="btnView0"]`)
      .should('be.visible')  // Ensure the button is visible
      .click();

cy.contains('Saved Reports').should('be.visible');
cy.contains('Scheduled Tasks').should('be.visible');
cy.contains('myFirstSummary').should('be.visible');
cy.contains('Thu Sep 19 2024').should('be.visible');
cy.contains('General stats').should('be.visible');
cy.contains('2 Urls').should('be.visible');
cy.contains('Scraped').should('be.visible');
cy.contains('2 Urls').should('be.visible');
cy.contains('Crawlable').should('be.visible');
// cy.contains('0.21 sec').should('be.visible');
cy.contains('Avg scrape time').should('be.visible');
cy.contains('Industry classification').should('be.visible');
cy.contains('Classification Distribution').should('be.visible');
cy.contains('Weak classifications').should('be.visible');
cy.contains('https://wee-test-site-2.netlify.app/').should('be.visible');
cy.contains('42.80%').should('be.visible');
cy.contains('Domain match').should('be.visible');
cy.contains('Domain mismatch information').should('be.visible');
cy.contains('https://wee-test-site-1.netlify.app/').should('be.visible');
cy.contains('Health Care').should('be.visible');
cy.contains('Telecommunications').should('be.visible');
cy.contains('Aerospace').should('be.visible');
cy.contains('Website status').should('be.visible');
cy.contains('Parked sites').should('be.visible');
cy.contains('There were no parked websites').should('be.visible');

cy.get('button[data-testid="dropdown-export"]')
  .should('be.visible')
  .click();  // Click the export button

// After clicking the export button, click the option to download the report
cy.contains('Download the report to your device')
  .should('be.visible')
  .click();  // Click to download the report

  cy.contains('Log Out')
  .should('be.visible')
  .click();


  });

87
});
