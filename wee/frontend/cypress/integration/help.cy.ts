describe('help page', () => {
  it('should be on right page', () => {
    cy.visit('/help');
    cy.contains(/Frequently asked questions/i).should('exist');
    cy.contains(/Feedback/i).should('exist');
    
  });

  it('help should be available', () => {
    cy.testHelp('/help');
  });
});
