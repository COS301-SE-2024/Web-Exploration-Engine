describe('Help Page Tests', () => {

  it('should be on the right page and contain key elements', () => {
    cy.visit('/help');
    cy.contains(/Frequently Asked Questions/i).should('exist');
    cy.contains(/Feedback/i).should('exist');
  });

  it('help page should be accessible', () => {
    cy.testHelp('/help');
  });
  
  it('should load the help page successfully with correct content', () => {
    cy.visit('/help');

    cy.get('#faq').should('be.visible');
    cy.get('#faq h1').should('contain.text', 'Frequently Asked Questions');
    cy.get('#faq h3').should('contain.text', 'How can we help you?');
  });
});
