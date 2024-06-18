describe('frontend', () => {
  it('be able to visit all pages', () => {
    cy.visit('/');
    cy.contains(/web exploration engine/i).should('exist');

    cy.visit('/login');
    cy.contains(/login/i).should('exist');

    cy.visit('/signup');
    cy.contains(/login/i).should('exist');

    cy.visit('/help');
    cy.contains(/login/i).should('exist');

    cy.visit('/results');
    cy.contains(/login/i).should('exist');

    cy.visit('/summaryreport');
    cy.contains(/login/i).should('exist');

  });
});
