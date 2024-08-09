describe('saved reports page', () => {
    it('should be on right page', () => {
      cy.visit('/savedreports');
/*       cy.contains(/Frequently asked questions/i).should('exist');
      cy.contains(/Feedback/i).should('exist'); */
    });
  
    it('help should be available', () => {
      cy.testHelp('/help');
    });
    
  });