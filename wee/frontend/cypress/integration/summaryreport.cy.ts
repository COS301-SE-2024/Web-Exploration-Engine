describe('summaryreport', () => {
  it('should be on right page', () => {
    cy.visit('/summaryreport');
    cy.contains(/Scraping Dashboard/i).should('exist');
  });

  it('help should be available', () => {
    cy.testHelp('/summaryreport');
  });
});
