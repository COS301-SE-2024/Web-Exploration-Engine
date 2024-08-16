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
    


    //==========================================
    // Checking the results page content : Steers
    //==========================================


    cy.get('[data-testid="btnView1"]')
    .should('exist')
    .click();

    cy.url().should('include', 'results');

    //  Tab : General Overview
    cy.log('Testing General overview tab');

    cy.get('[data-testid="tab-general"]').should('exist');
    cy.get('[data-testid="tab-general"]').click();
    
    //Tab Section : Header, Title, Logo
    cy.get('[data-testid="div-summary"]')
    .should('exist')
    .should('be.visible')
    
    cy.get('[data-testid="p-title"]')
    .should('exist')
    .should('be.visible')
    .should(
        'contain.text',
        'Burgers and Flame Grills | Steers South Africa'
      )

    cy.get('[data-testid="img-logo"]')
    .should('exist')
    .should('have.attr','src')

    cy.get('[data-testid="p-summary"]')
    .should('exist')
    .should('be.visible')
    .should(
        'contain.text',
        'Nothing slaps more than 100% Flame-Grilled flavour. Steers South Africa is the takeaway restaurant of choice for burgers, chicken, ribs and hand-cut chips.'
      )
    // Tab Section : Summary Info


    //  Tab : Media
    cy.log('Testing Media Tab');
    cy.get('[data-testid="tab-media"]').click();

    cy.get('[data-testid="div-homepagescreenshot"]')
    .should('exist')
    .should('be.visible')

    cy.get('[data-testid="pagination-images"]')
    .should('exist')
    .should('be.visible')

    // Check the select dropdown for "Images Per Page"
    cy.get('[data-testid="pagination-images"] select')
      .should('be.visible')
      .find('option')
      .should('have.length', 6) // There are 6 options
      .then(($options) => {
        const expectedValues = ['4', '8', '16', '24', '36', '48'];
        $options.each((index, option) => {
          expect(option.value).to.equal(expectedValues[index]);
        });
      });

    // Check the images in the cards
    cy.get('[id="unique-results-image-container"]')
      .find('[id="unique-results-image"]')
      .should('have.length.greaterThan', 0); // Ensure there is at least one image

    cy.get('[id="unique-results-image-container"]')
      .find('img')
      .should('have.attr', 'alt', 'Image')
      .and('have.attr', 'src'); // Ensure images have src attribute



    //  Tab : SEO Analysis
    cy.log('Testing SEO Analysis');

    cy.get('[data-testid="tab-seo"]').click();

    
    cy.contains(/images/i).should('exist');
    cy.contains(/internal linking/i).should('exist');
    cy.contains(/headings/i).should('exist');
    cy.contains(/meta/i).should('exist');
    cy.contains(/title tags/i).should('exist');
    cy.contains(/unique content/i).should('exist');


    //  Tab : Sentiment Analysis
    cy.log('Testing Sentiment Analysis');



  });


});
