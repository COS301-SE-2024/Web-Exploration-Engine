describe('saved reports page', () => {
  it('general layout - saved reports - should be correct', () => {
    cy.testLayout('/savedreports');
  });
  
  it('general layout - saved summary reports - should be correct', () => {
    cy.testLayout('/savedsummaries');
  });
  

  
 
    it('summaries page content should be present', () => {
      cy.visit('/savedsummaries');
      
      //Page Section : Save or Download Button

/*    cy.get('[data-testid="dropdown-save"]').should('exist');
      cy.get('[data-testid="dropdown-save"]').should('be.visible');
      cy.get('[data-testid="dropdown-save"]').click();

      cy.get('[data-testid="dropdown-export"]').should('exist');
      cy.get('[data-testid="dropdown-export"]').should('be.visible');
      cy.get('[data-testid="dropdown-export"]').click(); 
      
      */
      
      
      
      //Page Section : General Statistics
      cy.get('[data-testid="visual-scraped-stats"]').should('exist');
      cy.get('[data-testid="visual-scraped-stats"]').should('be.visible');
      cy.get('[data-testid="visual-scraped-stats"]').screenshot('visual-scraped-stats');

      cy.get('[data-testid="visual-crawlable-stats"]').should('exist');
      cy.get('[data-testid="visual-crawlable-stats"]').should('be.visible');
      cy.get('[data-testid="visual-crawlable-stats"]').screenshot('visual-crawlable-stats');

      cy.get('[data-testid="visual-avg-scrape-stats"]').should('exist');
      cy.get('[data-testid="visual-avg-scrape-stats"]').should('be.visible');
      cy.get('[data-testid="visual-avg-scrape-stats"]').screenshot('visual-avg-scrape-stats');

      cy.get('[data-testid="visual-industry-classification"]').should('exist');
      cy.get('[data-testid="visual-industry-classification"]').should('be.visible');
      cy.get('[data-testid="visual-industry-classification"]').screenshot('visual-industry-classification');

      cy.get('[data-testid="visual-domain-match"]').should('exist');
      cy.get('[data-testid="visual-domain-match"]').should('be.visible');
      cy.get('[data-testid="visual-domain-match"]').screenshot('visual-domain-match');

      cy.get('[data-testid="visual-website-status"]').should('exist');
      cy.get('[data-testid="visual-website-status"]').should('be.visible');
      cy.get('[data-testid="visual-website-status"]').screenshot('visual-website-status');


      //Page Section : Test Icons
   /*    cy.get('[data-testid="popup-industry-classification"]').should('exist');
      cy.get('[data-testid="popup-industry-classification"]').should('be.visible');
      cy.get('[data-testid="popup-industry-classification"]').click();

      cy.get('[data-testid="popup-weak-classification"]').should('exist');
      cy.get('[data-testid="popup-weak-classification"]').should('be.visible');
      cy.get('[data-testid="popup-weak-classification"]').click();

      cy.get('[data-testid="popup-domain-match"]').should('exist');
      cy.get('[data-testid="popup-domain-match"]').should('be.visible');
      cy.get('[data-testid="popup-domain-match"]').click(); */


    });
   
    it('should be on right page', () => {
      cy.visit('/savedreports');
      
      //Page Layout : Report Tab
/*    cy.get('[data-testid="tab-reports"]').should('exist');
      cy.get('[data-testid="tab-reports"]').click();
      cy.get('[data-testid="table-reports"]').should('exist');
      cy.get('[data-testid="table-reports"]').should('be.visible'); */

      //Page Layout : Summary Tab
/*    cy.get('[data-testid="tab-summaries"]').should('exist');
      cy.get('[data-testid="tab-summaries"]').click();
      cy.get('[data-testid="table-summaries"]').should('exist');
      cy.get('[data-testid="table-summaries"]').should('be.visible'); */


    });

  });