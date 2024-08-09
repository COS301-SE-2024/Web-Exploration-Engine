

describe('Signup and Login Tests', () => {

  describe('Signup Tests', () => {
    it('should be on the right page', () => {
      cy.visit('/signup');
      cy.contains(/Become a Member/i).should('exist');
    });
  });

  describe('Login Page Tests', () => {
    beforeEach(() => {
      cy.visit('/login');
    });

    it('should be on the right page', () => {
      cy.contains(/Ready to Dive Back In/i).should('exist');
    });
});
});


