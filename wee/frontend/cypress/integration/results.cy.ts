describe('results', () => {
  it('should be on right page', () => {
    cy.visit('/results?url=');
    cy.contains(/domain tags/i).should('exist');
    cy.contains(/No images available./i).should('exist');
  });

  it('help should be available', () => {
    cy.testHelp('/results');
  });

  it('should get correct github.com response', () => {
    cy.visit('/results?url=https%3A%2F%2Fgithub.com');
        cy.contains(/github.com/i).should('exist');

  });

  it('should get correct unsplash.com response', () => {
   
    cy.visit('/results?url=https%3A%2F%2Funsplash.com%2F');
        cy.contains(/unsplash.com/i).should('exist');

  });

 


});
