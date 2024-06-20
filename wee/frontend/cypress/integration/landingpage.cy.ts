describe('help page', () => {
  it('should be on right page', () => {
    cy.visit('/');
    cy.contains(/The Web Exploration Engine/i).should('exist');
  });
});
