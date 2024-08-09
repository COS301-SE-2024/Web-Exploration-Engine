/* eslint-disable cypress/unsafe-to-chain-command */


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

    it('should display error messages for invalid input', () => {
      cy.get('[data-testid="login-button"]').click();
      cy.get('span').should('contain', 'All fields are required');
      cy.get('input[type="email"]').type('invalid-email');
      cy.get('input[type="password"]').type('password');
      cy.get('[data-testid="login-button"]').click();
      cy.get('span').should('contain', 'Please enter a valid email address');
      cy.get('input[type="email"]').clear().type('valid@example.com');
      cy.get('input[type="password"]').clear().type('wrongpassword');
      cy.get('[data-testid="login-button"]').click();
      cy.get('span').should('contain', 'Invalid email or password');
    });
    it('should login successfully with valid credentials', () => {
      cy.intercept('POST', '/api/login', (req) => {
        console.log('Intercepted request:', req);
        req.reply({
          statusCode: 200,
          body: { uuid: '12345' }
        });
      }).as('loginRequest');

      cy.get('input[type="email"]').type('valid@example.com');
      cy.get('input[type="password"]').type('correctpassword');
      cy.get('[data-testid="login-button"]').click();


    });
});


});


