describe('results', () => {
  it('should be on right page', () => {
    cy.visit('/results?url=');
    cy.contains(/General overview/i).should('exist');
    cy.contains(/No images available/i).should('exist');
  });
});
