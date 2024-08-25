
    //==========================================
    // Checking the results page content : Steers
    //==========================================

    cy.get('[data-testid="btnView1"]').should('exist').click();

    cy.url().should('include', 'results');

    //  Tab : General Overview
    cy.log('Testing General overview tab');

    cy.get('[data-testid="tab-general"]').should('exist');
    cy.get('[data-testid="tab-general"]').click();

    //Tab Section : Header, Title, Logo
    cy.get('[data-testid="div-summary"]').should('exist').should('be.visible');

    cy.get('[data-testid="p-title"]')
      .should('exist')
      .should('be.visible')
      .should('contain.text', 'Burgers and Flame Grills | Steers South Africa');

    cy.get('[data-testid="img-logo"]')
      .should('exist')
      .should('have.attr', 'src');

    cy.get('[data-testid="p-summary"]')
      .should('exist')
      .should('be.visible')
      .should(
        'contain.text',
        'Nothing slaps more than 100% Flame-Grilled flavour. Steers South Africa is the takeaway restaurant of choice for burgers, chicken, ribs and hand-cut chips.'
      );
    // Tab Section : Summary Info

    //  Tab : Media
    cy.log('Testing Media Tab');
    cy.get('[data-testid="tab-media"]').click();

    cy.get('[data-testid="div-homepagescreenshot"]')
      .should('exist')
      .should('be.visible');

    cy.get('[data-testid="pagination-images"]')
      .should('exist')
      .should('be.visible');

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

    //Check Titles
    cy.contains(/images/i).should('exist');
    cy.contains(/internal linking/i).should('exist');
    cy.contains(/headings/i).should('exist');
    cy.contains(/meta/i).should('exist');
    cy.contains(/title tags/i).should('exist');
    cy.contains(/unique content/i).should('exist');

    cy.get('[data-testid="div-images-total"]')
      .should('exist')
      .should('be.visible')
      .should('contain.text', '26');

    cy.get('[data-testid="div-images-missing-alt"]')
      .should('exist')
      .should('be.visible')
      .should('contain.text', '2');

    cy.get('[data-testid="nonOptimisedImages"]')
      .should('exist')
      .should('be.visible')
      .should('contain.text', '0');

    cy.get('[data-testid="scroll-format-urls"]')
    .should('exist')
    .should('be.visible')
    .should(
        'contain.text','110'      )

    cy.get('[data-testid="div-format-urls"]')
    .should('exist')
    .should('be.visible')
    .should(
        'contain.text','47'      )

    cy.get('[data-testid="div-other-urls"]')
    .should('exist')
    .should('be.visible')
    .should(
        'contain.text','abc'
      )

    cy.get('[data-testid="div-links-total"]')
    .should('exist')
    .should('be.visible')
    .should(
        'contain.text','abc'
      )

    //Heading Analysis
    cy.get('[data-testid="headingscount"]')
      .should('exist')
      .should('be.visible')
      .should('contain.text', '1');

    cy.get('[data-testid="popup-headings"]')
      .should('exist')
      .should('be.visible')
      .should('contain.text', 'Welcome to Steers®, the home of Flame-Grilled');

    // MetaDescription Analysis
    cy.get('[data-testid="p-metadescription-tag"]')
    .should('exist')
    .should('be.visible')
    .should(
        'contain.text','array'
      )

    cy.get('[data-testid="p-metadescription-length"]')
    .should('exist')
    .should('be.visible')
    .should(
        'contain.text','array'
      )

    // EO MetaDescription Analysis
    cy.get('[data-testid="p-metadescription"]')
    .should('exist')
    .should('be.visible')
    .should(
        'contain.text','array'
      )

    cy.get('[data-testid="p-titletag-description"]')
    .should('exist')
    .should('be.visible')
    .should(
        'contain.text','array'
      )

    cy.get('[data-testid="p-titletag-length"]')
    .should('exist')
    .should('be.visible')
    .should(
        'contain.text','array'
      )

    //Unique Content
    cy.get('[data-testid="p-titletag-length"]')
    .should('exist')
    .should('be.visible')
    .should(
        'contain.text','array'
      )
    cy.get('[data-testid="div-uniq-textlength"]')
      .should('exist')
      .should('be.visible')
      .should('contain.text', '303');
    cy.get('[data-testid="div-uniq-percentage"]')
      .should('exist')
      .should('be.visible')
      .should('contain.text', '52.81%');

    cy.get('[data-testid="div-uniq-rep-words"]')
      .should('exist')
      .should('be.visible')
      .should('contain.text', 'king: 5burger: 5only: 4');

   // Sentiment Analysis
    cy.get('[data-testid="div-sentiment-analysis"]')
    .should('exist')
    .should('be.visible')
    .should(
        'contain.text','array'
      )

    // Test Technical Analysis

    cy.log('Testing Sentiment Analysis');
    
    cy.get('[data-testid="canonicalTagPresent"]')
      .should('exist')
      .should('be.visible')
      .should('contain.text', 'Yes');

    cy.get('[data-testid="canonicalTag"]')
      .should('exist')
      .should('be.visible')
      .should('contain.text', 'https://steers.co.za');

    cy.get('[data-testid="canonical_recommendations"]')
      .should('exist')
      .should('be.visible')
      .should('contain.text', '');

    cy.get('[data-testid="siteSpeed"]')
    .should('exist')
    .should('be.visible')
    .should('contain.text', '0');

    cy.get('[data-testid="sitespeed_recommendations"]')
    .should('exist')
    .should('be.visible')
    .should('contain.text', '0');

    cy.get('[data-testid="isSitemapvalid"]')
    .should('exist')
    .should('be.visible')
    .should('contain.text', 'Yes')
    
    cy.get('[data-testid="xml_recommendation"]')
    .should('exist')
    .should('be.visible')
    .should('contain.text', 'Yes')

    cy.get('[data-testid="mobile_friendliness"]')
    .should('exist')
    .should('be.visible')
    .should('contain.text', 'Yes')
    
    
    cy.get('[data-testid="mobile_recommendations"]')
    .should('exist')
    .should('be.visible')
    .should('contain.text', 'Yes')
    
    
    cy.get('[data-testid="indexibilityAnalysis"]')
    .should('exist')
    .should('be.visible')
    .should('contain.text', 'Yes')
    
    
    cy.get('[data-testid="indexable_recommendation"]')
    .should('exist')
    .should('be.visible')
    .should('contain.text', 'Yes')
    
    
    cy.get('[data-testid="structuredData"]')
    .should('exist')
    .should('be.visible')
    .should('contain.text', '0')
    
    
    cy.get('[data-testid="structured_recommendations"]')
    .should('exist')
    .should('be.visible')
    .should('contain.text', 'No structured data found. Add structured data to improve SEO.')
    
    
    //Testing Lighthouse analysis

    cy.get('[data-testid="lighthouse-performance"]')
    .should('exist')
    .should('be.visible')
    .should('contain.text', 'No structured data found. Add stuctured data to improve SEO.')

      
    cy.get('[data-testid="lighthouse-performance"]')
    .should('exist')
    .should('be.visible')
    .should('contain.text', 'No structured data found. Add stuctured data to improve SEO.')

      
    cy.get('[data-testid="lighthouse-bestpractices"]')
    .should('exist')
    .should('be.visible')
    .should('contain.text', 'No structured data found. Add stuctured data to improve SEO.')
    
    cy.get('[data-testid="lighthouse_recommendation_"]')
    .should('exist')
    .should('be.visible')
    .should('contain.text', 'No structured data found. Add stuctured data to improve SEO.')

      

    
    //  Tab : Sentiment Analysis
    cy.log('Testing Sentiment Analysis');

