describe('scraperesults', () => {
  it('should be on right page', () => {
    cy.visit('/scraperesults');
    cy.contains(/Summary/i).should('exist');
  });
});
