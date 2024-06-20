describe('signup', () => {
  it('should be on right page', () => {
    cy.visit('/signup');
    cy.contains(/Become a Member/i).should('exist');
  });
});
