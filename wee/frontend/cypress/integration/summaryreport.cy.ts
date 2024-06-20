describe('summaryreport', () => {
  it('should be on right page', () => {
    cy.visit('/summaryreport');
    cy.contains(/Scraping Dashboard/i).should('exist');
  });
});
