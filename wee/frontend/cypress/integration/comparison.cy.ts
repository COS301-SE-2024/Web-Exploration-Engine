describe('comparison page', () => {
  
    it('General Layout Exists', () => {
      cy.testLayout('/comparison');

    });

    it('all elements on page should exist', () => {
      cy.visit('/comparison');
     // cy.contains('Website').click() // Click on first el containing 'Welcome'



      //Check all components exist

      
      cy.get('[data-testid="website2-select"]').should('exist');
      cy.get('[data-testid="website2-select"]').should('exist');
      
      //Page Section : Domain Overview
      cy.get('[data-testid="sect-website-status"]').should('exist');
      cy.get('[data-testid="sect-industry-classification"]').should('exist');
      cy.get('[data-testid="sect-domain-match"]').should('exist');

      cy.get('[data-testid="sect-domain-match"]').contains(/-/i);

      //Page Section : On page SEO analysis

      cy.get('[data-testid="sect-unique-content"]').should('exist');
      cy.get('[data-testid="sect-images"]').should('exist');
      
      //Page Section : Technical SEO analysis
      cy.get('[data-testid="sect-lighthouse"]').should('exist');
      cy.get('[data-testid="sect-mobile-friendly"]').should('exist');
      cy.get('[data-testid="sect-site-speed"]').should('exist');
    
      
      //Check

      
    });
    
    it('check popups', () => {
      cy.get('[data-testid="popup-info-domain-info"]').should('exist').should('be.visible');
      cy.get('[data-testid="popup-info-onpage-seo"]').should('exist');
      cy.get('[data-testid="popup-technical-onpage-seo"]').should('exist');

    })

    it('mocked response', () => {


    })

    
  }); 
  