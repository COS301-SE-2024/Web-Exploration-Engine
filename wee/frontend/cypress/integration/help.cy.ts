describe('help page', () => {
  it('faqs should exist', () => {
    cy.visit('/help');
    cy.contains(/Frequently Asked Questions/i).should('exist');

  });
});
