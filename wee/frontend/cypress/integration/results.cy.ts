describe('results', () => {


  it('should be on right page', () => {
    cy.visit('/results?url='); //results?url= should be in before each
    cy.contains(/domain tags/i).should('exist');
    cy.contains(/No images available/i).should('exist');
  });

  it('should get correct github.com response', () => {
    cy.visit('/results?url=https%3A%2F%2Fgithub.com');
  });

  it('should get correct unsplash.com response', () => {
    // http://localhost:3001/results?url=https%3A%2F%2Funsplash.com%2F
    cy.visit('/results?url=https%3A%2F%2Funsplash.com%2F');
  });

  it('should get correct chatgbt.com response - unscrapable', () => {
    cy.visit('/');
  });

  it('should get correct unsplash.com response', () => {
    cy.fixture('individual-scrapes/unsplash')
      .as('jsonUnsplah')
      .then((jsonUnsplah) => {
        console.log(jsonUnsplah);

        cy.request(
          'http://localhost:3001/results?url=https%3A%2F%2Fgithub.com'
        ).as('get-github');
      });
  });
});
