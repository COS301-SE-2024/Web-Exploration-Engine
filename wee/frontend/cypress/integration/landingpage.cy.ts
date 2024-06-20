describe('help page', () => {
  it('faqs should exist', () => {
    cy.visit('/');
    cy.contains(/The Web Exploration Engine/i).should('exist');
  });
});
