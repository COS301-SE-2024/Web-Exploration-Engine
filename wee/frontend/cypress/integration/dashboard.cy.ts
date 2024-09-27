describe('Dashboard Page', () => {
  beforeEach(() => {
    // Intercept any API calls if necessary, or directly visit the dashboard
    cy.visit('/dashboard');
  });

  it('should contain the correct dashboard content', () => {


    cy.url().should('include', '/dashboard');



    // Check for the dashboard header
    cy.contains('Dashboard of N/A').should('be.visible');

    // Check for the last scheduled scrape information
    cy.contains('Date of last scheduled scrape: N/A').should('be.visible');

    // Check for SEO Technical Analysis: Light House
    cy.contains('SEO Technical Analysis: Light House').should('be.visible');
    cy.contains('There are no Ligth House Technical SEO Analysis currently available').should('be.visible');

    // Check for SEO Technical Analysis: Site Speed
    cy.contains('SEO Technical Analysis: Site Speed').should('be.visible');
    cy.contains('There are no Site Speed Technical SEO Analysis currently available').should('be.visible');

    // Check for SEO Keyword Analysis
    cy.contains('SEO Keyword Analysis').should('be.visible');
    cy.contains('No keywords are being tracked').should('be.visible');

    // Check for News Sentiment
    cy.contains('News Sentiment').should('be.visible');
    cy.contains('There are no News Sentiment currently available').should('be.visible');

    // Check for Social Media Engagements
    cy.contains('Social Media').should('be.visible');
    cy.contains('Total Engagments').should('be.visible');
    cy.contains('There are no Total Engagements currently available').should('be.visible');

    // Check for Facebook metrics
    cy.contains('Facebook - Comment Count').should('be.visible');
    cy.contains('There are no Facebook Comment Count currently available').should('be.visible');

    cy.contains('Facebook - Share Count').should('be.visible');
    cy.contains('There are no Facebook Share Count currently available').should('be.visible');

    cy.contains('Facebook - Reaction Count').should('be.visible');
    cy.contains('There are no Facebook Reaction Count currently available').should('be.visible');

    // Check for Pinterest metrics
    cy.contains('Pintrest - Pin Count').should('be.visible');
    cy.contains('There are no Pintrest Pin Count currently available').should('be.visible');

    // Check for Reviews metrics
    cy.contains('Reviews').should('be.visible');
    cy.contains('Average Star Rating').should('be.visible');
    cy.contains('There are no Ratings currently available').should('be.visible');

    cy.contains('Number of Reviews').should('be.visible');
    cy.contains('There are no Number of Reviews currently available').should('be.visible');

    cy.contains('Star Ratings Distribution for Reviews').should('be.visible');
    cy.contains('There are no rating data currently available').should('be.visible');

    // Check for Ratings Intensity Heatmap
    cy.contains('Ratings Intensity Heatmap').should('be.visible');
    cy.contains('The heatmap is not currently available').should('be.visible');

    // Check for Trust Index Rating
    cy.contains('Trust Index Rating').should('be.visible');
    cy.contains('There are no Trust Index currently available').should('be.visible');

    // Check for NPS Score
    cy.contains('NPS Score').should('be.visible');
    cy.contains('There are no NPS Reviews currently available').should('be.visible');
  });
});
