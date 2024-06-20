describe('help page', () => {
  it('should be on right page', () => {
    cy.visit('/help');
    cy.contains(/Frequently Asked Questions/i).should('exist');
  });
});
