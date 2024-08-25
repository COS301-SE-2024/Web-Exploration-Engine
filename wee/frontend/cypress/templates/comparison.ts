 // On the Comparison Page

    //Select first website to compare
    cy.get('[data-testid="website1-select"]').should('exist');
    cy.get('[data-testid="website1-select"]').click();

    cy.get('[data-testid="website1-option-0"]').should('exist');
    cy.get('[data-testid="website1-option-1"]').should('exist');
    cy.get('[data-testid="website1-option-1"]').click();

    //Select second website to compare
    cy.get('[data-testid="website2-select"]').should('exist');
    cy.get('[data-testid="website2-select"]').click();

    cy.get('[data-testid="website2-option-0"]').should('exist');
    cy.get('[data-testid="website2-option-1"]').should('exist');
    cy.get('[data-testid="website2-option-1"]').click();

    //Check all corresponding website


    
    //Section : Light House Analysis

    //Website 1
    cy.get('[data-testid="website1-lighthouse-performance"]')
    .should('exist')
    .should('be.visible')
    .should('contain.text', '0%');

    cy.get('[data-testid="website1-lighthouse-accessibility"]')
    .should('exist')
    .should('be.visible')
    .should('contain.text', '0%');

    cy.get('[data-testid="website1-lighthouse-bestpractices"]')
    .should('exist')
    .should('be.visible')
    .should('contain.text', '0%');

    //Website 2
    cy.get('[data-testid="website2-lighthouse-performance"]')
    .should('exist')
    .should('be.visible')
    .should('contain.text', '0%');

    cy.get('[data-testid="website2-lighthouse-accessibility"]')
    .should('exist')
    .should('be.visible')
    .should('contain.text', '0%');

    cy.get('[data-testid="website2-lighthouse-bestpractices"]')
    .should('exist')
    .should('be.visible')
    .should('contain.text', '0%');

    
    // Section : Mobile Friendly
    
    cy.get('[data-testid="website1-mobilefriendly"]')
    .should('exist')
    .should('be.visible')
    .should('contain.text', 'Yes');


    cy.get('[data-testid="website2-mobilefriendly"]')
    .should('exist')
    .should('be.visible')
    .should('contain.text', 'Yes');

    
    
    // Section : Site Speed
    
    cy.get('[data-testid="website1-sitespeed"]')
    .should('exist')
    .should('be.visible')
    .should('contain.text', '0');


    cy.get('[data-testid="website2-sitespeed"]')
    .should('exist')
    .should('be.visible')
    .should('contain.text', '0');
