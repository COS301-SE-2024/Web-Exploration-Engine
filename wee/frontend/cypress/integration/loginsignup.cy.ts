describe('signup', () => {
  it('should be on right page', () => {
    cy.visit('/signup');
    cy.contains(/Become a Member/i).should('exist');

    
    cy.log("Testing Text Content")
    cy.contains(/First name/i).should('exist');
    cy.contains(/Last name/i).should('exist');
    cy.contains(/email/i).should('exist');
    cy.contains(/password/i).should('exist');
    
    cy.log("Testing Buttons");
    cy.get('[data-testid="btn-create-account"]').should("exist");
    
    cy.log("Testing Inputs");
    cy.get('[data-testid="input-first-name"]').should("exist")
   /*  cy.get('[data-testid="input-first-name"]').type("Amandla");
    cy.contains(/amandla/i).should('exist'); */

    cy.get('[data-testid="input-last-name"]').should("exist");
    cy.get('[data-testid="input-email"]').should("exist");
    cy.get('[data-testid="input-password"]').should("exist");
    
    cy.log("Testing Links");
    cy.get('[data-testid="link-login"]').should("exist");

  });
});

describe('login', () => {
  it('should be on right page', () => {
    cy.visit('/login');
    
    cy.log("Tesing Text Content");
    cy.contains(/Ready to Dive Back In/i).should('exist');
    cy.contains(/Email/i).should('exist');
    cy.contains(/password/i).should('exist');
    cy.contains(/google/i).should('exist');

    cy.log("Testing Buttons")
    cy.get('[data-testid="btn-login"]').should("exist");


    cy.log("Testing Inputs")
    cy.get('[data-testid="input-email"]').should("exist");
    cy.get('[data-testid="input-password"]').should("exist");



  });
});


