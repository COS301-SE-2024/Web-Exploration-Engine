describe('signup', () => {
  it('should be on right page', () => {
    cy.visit('/signup');
    cy.contains(/Become a Member/i).should('exist');
  });
});

describe('login', () => {
  it('should be on right page', () => {
    cy.visit('/login');
    cy.contains(/Ready to Dive Back In/i).should('exist');
  });
});


