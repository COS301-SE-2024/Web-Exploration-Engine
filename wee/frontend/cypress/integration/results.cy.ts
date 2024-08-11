describe('results', () => {
  it('general layout intact', () => {
    cy.testLayout('/results');
  });

  it('all page content should load', () => {
    cy.visit('/results?');

    //Testing Export / Save Button
    cy.get('[data-testid="btn-export-save-report"]').should('exist');
    cy.get('[data-testid="btn-export-save-report"]').click();
    cy.get('[data-testid="btn-export-save-report"]').should('exist');

    
/*     cy.get('.dropdown-item') 
    .contains(/download/i)
    .should('be.visible') // Check if the item is visible
    .and('have.attr', 'enabled'); // Check if the item is disabled (if the attribute is used)
     */
/*     cy.get('.dropdown-item') 
    .contains(/save/i)
    .should('be.visible') // Check if the item is visible
    .and('have.attr', 'disabled'); // Check if the item is disabled (if the attribute is used)
     */

    // Page Tab : General Overview
    cy.log("Testing General overview tab")

    cy.contains(/overview/i).should('exist');
    cy.contains(/parked/i).should('exist');
    cy.contains(/seo/i).should('exist');
    cy.contains(/contact details/i).should('exist'); 

    cy.log("Testing tabs and buttons exist")
    cy.get('[data-testid="tab-seo"]').should('exist');
    cy.get('[data-testid="tab-seo"]').click();
    cy.contains(/media/i).should('exist');
    cy.contains(/seo/i).should('exist');
    cy.contains(/export/i).should('exist'); 
    
    
    // Icons Testing
/*     cy.get('[data-testid="popup-summary"]').should('be.visible');
    cy.get('[data-testid="popup-domain-tags"]').should('be.visible'); */
    

    
    // Page Tab : Media
    cy.log("Testing Media Tab")
        
    cy.get('[data-testid="tab-media"]').click();
    cy.contains(/screenshot/i).should('exist');
    cy.contains(/screenshot available./i).should('exist');
    cy.contains(/images/i).should('exist');
    cy.contains(/No images available/i).should('exist'); 
    
    
    // Page Tab : SEO Analysis
    cy.log("Testing SEO Analysis")
    
    cy.get('[data-testid="tab-seo"]').click();
    cy.contains(/images/i).should('exist');
    cy.contains(/internal linking/i).should('exist');
    cy.contains(/headings/i).should('exist');
    cy.contains(/meta/i).should('exist');
    cy.contains(/title tags/i).should('exist');
    cy.contains(/unique content/i).should('exist');
    
    //Icons Testing
/*     cy.get('[data-testid="popup-images"]').click();
    cy.get('[data-testid="popup-linking"]').click();
    cy.get('[data-testid="popup-headings"]').click();
    cy.get('[data-testid="popup-meta-description"]').click();
    cy.get('[data-testid="popup-title-tags"]').click();
    cy.get('[data-testid="popup-unique-content"]').click(); */
    

    // Page Tab : Sentiment Analysis
    cy.log("Testing Sentiment Analysis")
    
    // Icons testing
 /*    cy.get('[data-testid="popup-sentiment"]').click();
    cy.get('[data-testid="popup-emotions"]').click();
    cy.get('[data-testid="popup-neg-pos-words"]').click(); */
    


    // Mocking Responses
  });
  

  

});
