describe('scraperesults', () => {
  it('should be on right page', () => {
    cy.visit('/scraperesults');
    cy.contains(/Summary/i).should('exist');
  });

  it('help should be available', () => {
    cy.testHelp('/scraperesults');
  });
});
