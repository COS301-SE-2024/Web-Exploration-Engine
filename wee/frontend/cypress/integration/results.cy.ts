describe('results', () => {
  it('should be on right page', () => {
    cy.visit('/results?');

    cy.log("Testing General overview tab")

    cy.contains(/overview/i).should('exist');
    cy.contains(/parked/i).should('exist');
    cy.contains(/seo/i).should('exist');
    cy.contains(/contact details/i).should('exist'); 

    cy.log("Testing tabs and buttons exist")
/*     cy.get('[data-testid="tab-seo"]').should('exist');
    cy.get('[data-testid="tab-seo"]').click();
    cy.contains(/media/i).should('exist');
    cy.contains(/seo/i).should('exist');
    cy.contains(/export/i).should('exist'); 
     */
    

    cy.log("Testing Media Tab")
        
/*     cy.get('[data-testid="tab-media"]').click();
    cy.contains(/screenshot/i).should('exist');
    cy.contains(/screenshot available./i).should('exist');
    cy.contains(/images/i).should('exist');
    cy.contains(/No images available/i).should('exist'); 
     */
   

    cy.log("Testing SEO Analysis")

       
   /*  cy.get('[data-testid="tab-seo"]').click();
    cy.contains(/seo/i).should('exist');
  */

  });

  it('help should be available', () => {
    cy.testHelp('/results');
  });


/*   it('should get correct github.com response', () => {
    cy.visit('/results?url=https%3A%2F%2Fgithub.com');
        cy.contains(/github.com/i).should('exist');

  }); */

/*   it('should get correct unsplash.com response', () => {
   
    cy.visit('/results?url=https%3A%2F%2Funsplash.com%2F');
        cy.contains(/unsplash.com/i).should('exist');

  }); */

 


});
