import { getGreeting } from '../support/app.po';

describe('frontend-e2e', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
      
    getGreeting().contains(/The Web Exploration Engine/);
  });

  describe('E2E Signup and Login Flow', () => {
    it('should signup successfully', () => {
      cy.visit('/signup');

      // Fill out the signup form
      cy.get('input').eq(0).type('John');    // First Name
      cy.get('input').eq(1).type('Doe');     // Last Name
      cy.get('input').eq(2).type('testuser@example.com'); // Email
      cy.get('input').eq(3).type('password123');          // Password
      // Click submit button
      cy.get('button[type="submit"]').click();

    });

    it('should login successfully and show success modal', () => {
      cy.visit('/login');

      // Fill out the login form
      cy.get('input').eq(0).type('testusere2e@example.com'); // Email
      cy.get('input').eq(1).type('password123');          // Password

      // Click submit button
      cy.get('button[data-testid="login-button"]').click();

    });
  });
  });
