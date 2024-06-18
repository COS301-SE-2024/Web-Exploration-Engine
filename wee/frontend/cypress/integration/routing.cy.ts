describe('frontend', () => {
  it('be able to visit all pages', () => {
    cy.visit('/');
    cy.contains(/web exploration engine/i).should('exist');
  });
});
