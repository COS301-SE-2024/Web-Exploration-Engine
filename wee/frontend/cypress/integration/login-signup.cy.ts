describe('login', () => {
  it('faqs should exist', () => {
    cy.visit('/login');
    cy.contains(/The Web Exploration Engine/i).should('exist');
  });
});

describe('signup', () => {
  it('should be on right page', () => {
    cy.visit('/signup');
    cy.contains(/Become a Member/i).should('exist');
  });
});