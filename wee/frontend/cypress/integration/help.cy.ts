describe('Help Page Tests', () => {

  it('should be on the right page and contain key elements', () => {
    cy.visit('/help');
    cy.contains(/Frequently Asked Questions/i).should('exist');
    cy.contains(/Feedback/i).should('exist');
  });

  it('help page should be accessible', () => {
    cy.testHelp('/help');
  });

  it('should load the help page successfully with correct content', () => {
    cy.visit('/help');

    cy.get('#faq').should('be.visible');
    cy.get('#faq h1').should('contain.text', 'Frequently Asked Questions');
    cy.get('#faq h3').should('contain.text', 'How can we help you?');
  });

  it('should display video tutorials with correct links', () => {
    cy.visit('/help');


    cy.get('a[href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUJcmljayByb2xs"]').should('exist');
    cy.get('a[href="https://www.youtube.com/watch?v=ZKcuvdnVF80&pp=ygURYSBiaXJkcyBsYXN0IGxvb2s%3D"]').should('exist');
  });

  it('should allow user to send feedback', () => {
    cy.visit('/help');

    cy.get('textarea').should('be.visible').type('This is a test message.');
    cy.get('input[type="text"]').type('John Doe');
    cy.get('input[type="email"]').type('john.doe@example.com');

    cy.get('[data-testid="send-message-button"]').click();
  });
});
