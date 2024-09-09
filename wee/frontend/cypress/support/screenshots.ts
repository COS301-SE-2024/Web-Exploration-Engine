// NOTE : this is a file to be executed when running tests
describe('scraping functionality', () => {

    it('ScreenShots', () => {
      cy.visit('/');
  
      // Note : Dont test the modal screenshot before testing
      // cy.screenshot('homepage');
      //  cy.compareSnapshot({
      //   name: 'homepage',
      //   testThreshold: 0.2
      // }) 

      cy.get('[data-testid="header"]').screenshot('header-logged-out');
      cy.get('[data-testid="footer"]').screenshot('footer');
  
      cy.get('[data-testid="help-button"]').click();
      cy.get('[data-testid="help-button"]').screenshot('btn-help');
      cy.get('[data-testid="help-modal"]').screenshot('help-modal');
      cy.get('[data-testid="help-button"]').click();
    });

});