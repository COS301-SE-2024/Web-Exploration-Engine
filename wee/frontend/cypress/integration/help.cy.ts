describe('help page', () => {
  it('faqs should exist', () => {
    cy.visit('/help');
    cy.contains(/faqs/i).should('exist');

  });
});
