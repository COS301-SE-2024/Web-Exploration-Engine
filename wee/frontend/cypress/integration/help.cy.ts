describe('Help Page Tests', () => {

  it('should be on the right page and contain key elements', () => {
    cy.visit('/help');
    cy.contains(/Frequently Asked Questions/i).should('exist');
    cy.contains(/Feedback/i).should('exist');
  });

  it('help page should be accessible', () => {
    cy.testHelp('/help');
  });
});
