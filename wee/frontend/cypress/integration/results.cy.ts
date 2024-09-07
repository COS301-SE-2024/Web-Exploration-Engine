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


    //Page Tab : General Overview
    cy.log('Testing General overview tab');

    cy.contains(/overview/i).should('exist');
    cy.contains(/parked/i).should('exist');
    cy.contains(/seo/i).should('exist');
    cy.contains(/contact details/i).should('exist');

    cy.log('Testing tabs and buttons exist');
    cy.get('[data-testid="tab-seo"]').should('exist');
    cy.get('[data-testid="tab-seo"]').click();
    cy.contains(/media/i).should('exist');
    cy.contains(/seo/i).should('exist');
    cy.contains(/export/i).should('exist');

    // Page Tab : Media
    cy.log('Testing Media Tab');

    cy.get('[data-testid="tab-media"]').click();
    cy.contains(/screenshot/i).should('exist');
    cy.contains(/screenshot available./i).should('exist');
    cy.contains(/images/i).should('exist');
    cy.contains(/No images available/i).should('exist');

    // Page Tab : SEO Analysis
    cy.log('Testing SEO Analysis');

    cy.get('[data-testid="tab-seo"]').click();
    cy.contains(/images/i).should('exist');
    cy.contains(/internal linking/i).should('exist');
    cy.contains(/headings/i).should('exist');
    cy.contains(/meta/i).should('exist');
    cy.contains(/title tags/i).should('exist');
    cy.contains(/unique content/i).should('exist');

    // Page Tab : Sentiment Analysis
    cy.log('Testing Sentiment Analysis');

  });

  it('scrape 2 urls (github and steers) and test tabs for general, media and sentiment analysis', () => {
    cy.visit('/');
    cy.get('[data-testid="scraping-textarea-home"]').type(
      'https://mock.test.github.com,https://mock.test.steers.co.za'
    );
    cy.get('[data-testid="btn-start-scraping"]').click();

    //======================================================
    // GitHub Mock
    //======================================================
    cy.scrapeGithub();

    cy.scrapeSteers();

    //Wait for steers and github to finish
    cy.wait('@mock_scraper_mockgithub_done', { timeout: 10000 });

    cy.wait('@mock_scraper_mocksteers_done', { timeout: 10000 });

    //==========================================
    // Accessing the results page
    //==========================================

    cy.get('[data-testid="btnView0"]', { timeout: 10000 })
      .should('exist')
      .should('be.visible');
    //.click();

    cy.get('[data-testid="btnView1"]', { timeout: 10000 })
      .should('exist')
      .should('be.visible');
    //.click();

    cy.url().should('include', 'results');

    //=======================================================
    // Checking the results page content : Steers
    //=======================================================

    cy.get('[data-testid="btnView1"]').should('exist').click();

    cy.url().should('include', 'results');

    //=====================================================
    //  Tab : General Overview
    //=====================================================

    cy.log('Testing General overview tab');

    cy.get('[data-testid="tab-general"]', { timeout: 10000 }).should('exist');
    cy.get('[data-testid="tab-general"]', { timeout: 10000 }).click();

    //=====================================================
    // Tab Section : Header, Title, Logo
    //=====================================================

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

    //=====================================================
    //  Tab : Media
    //=====================================================

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

    //=====================================================
    //  Tab : Sentiment Analysis
    //=====================================================

    cy.log('Testing Sentiment Analysis');
  });

  it('scrape 2 urls (github and steers) and test tabs for seo analysis', () => {
    cy.visit('/');
    cy.get('[data-testid="scraping-textarea-home"]').type(
      'https://mock.test.github.com,https://mock.test.steers.co.za'
    );
    cy.get('[data-testid="btn-start-scraping"]').click();

    //======================================================
    // GitHub Mock
    //======================================================
    cy.scrapeGithub();
    cy.scrapeSteers();

    //Wait for steers and github to finish
    cy.wait('@mock_scraper_mockgithub_done', { timeout: 10000 });

    cy.wait('@mock_scraper_mocksteers_done', { timeout: 10000 });

    //==========================================
    // Accessing the results page
    //==========================================

    cy.get('[data-testid="btnView0"]', { timeout: 10000 })
      .should('exist')
      .should('be.visible');
    //.click();

    cy.get('[data-testid="btnView1"]', { timeout: 10000 })
      .should('exist')
      .should('be.visible');
    //.click();

    cy.url().should('include', 'results');

    //=======================================================
    // Checking the results page content : Steers
    //=======================================================

    cy.get('[data-testid="btnView1"]').should('exist').click();
    cy.url().should('include', 'results');

    //=====================================================
    //  Tab : SEO Analysis
    //=====================================================

    cy.log('Testing SEO Analysis');

    cy.get('[data-testid="tab-seo"]').click();

    //Check Titles
    cy.contains(/images/i).should('exist');
    cy.contains(/internal linking/i).should('exist');
    cy.contains(/headings/i).should('exist');
    cy.contains(/meta/i).should('exist');
    cy.contains(/title tags/i).should('exist');
    cy.contains(/unique content/i).should('exist');

    //=====================================================
    //Tab Section : Keyword Analysis
    //=====================================================

    cy.analyseSteersKeyword();
    cy.get('[data-testid="keyword-input"]').type('steers');
    cy.get('[data-testid="btn-seo-keyword"]').click();

    //Wait for the interception of "steers" keyword to be complete
    cy.wait('@mock_scraper_mock_keyword_steers_done', { timeout: 15000 });

    //Results now returned, test content

    cy.get('[data-testid="keyword_not_ranked"]', { timeout: 10000 })
      .should('exist')
      .should('be.visible')
      .should('contain.text', 'Not ranked in top 10');

    cy.get('[data-testid="keyword_top10"]', { timeout: 10000 })
      .should('exist')
      .should('be.visible')
      .should(
        'contain.text',
        '1. www.cisco.com2. www.cisco.com3. www.itpro.com4. www.ambitionbox.com5. www.cisco.com6. www.coursera.org7. en.wikipedia.org8. www.cisco.edu9. cp.certmetrics.com10. www.linkedin.com'
      );

    cy.get('[data-testid="p_keyword_recommendations"]', { timeout: 10000 })
      .should('exist')
      .should('be.visible')
      .should(
        'contain.text',
        'The URL is not ranked in the top search results for the keyword. Consider optimizing the content, improving on-page SEO, and possibly targeting less competitive keywords. Here are the top 10 URLs for this keyword: www.cisco.com, www.cisco.com, www.itpro.com, www.ambitionbox.com, www.cisco.com, www.coursera.org, en.wikipedia.org, www.cisco.edu, cp.certmetrics.com, www.linkedin.com.'
      );

    //  keyword : meraki (ranked )
    cy.get('[data-testid="keyword-input"]').clear();
    cy.get('[data-testid="keyword-input"]').type('meraki');
    cy.get('[data-testid="btn-seo-keyword"]').click();

    //Wait for the interception of "meraki" keyword to be complete
    cy.wait('@mock_scraper_mock_keyword_meraki_done', { timeout: 15000 });

    //Results now returned, test content
    cy.get('[data-testid="keyword_ranked"]', { timeout: 10000 })
      .should('exist')
      .should('be.visible')
      .should('contain.text', '#1');

    cy.get('[data-testid="keyword_top10"]', { timeout: 10000 })
      .should('exist')
      .should('be.visible')
      .should(
        'contain.text',
        '1. meraki.cisco.com2. meraki.cisco.com3. merakijewellerydesign.com4. meraki-living.co.za5. www.eudaimonia-coaching.co.uk6. www.stratusinfosystems.com7. caryyogacollective.com8. ibanway.com9. merakicapetown.co.za10. documentation.meraki.com'
      );

    cy.get('[data-testid="p_keyword_recommendations"]', { timeout: 10000 })
      .should('exist')
      .should('be.visible')
      .should(
        'contain.text',
        'The URL is ranked at position 1 for the keyword. Continue analyzing the content, backlinks, and SEO strategies to maintain your top ranking.'
      );

    //=====================================================
    //Section : Images
    //=====================================================
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

    //=====================================================
    //Section : Heading Analysis
    //=====================================================

    cy.get('[data-testid="headingscount"]')
      .should('exist')
      .should('be.visible')
      .should('contain.text', '1');

    cy.get('[data-testid="popup-headings"]')
      .should('exist')
      .should('be.visible')
      .should('contain.text', 'Welcome to Steers®, the home of Flame-Grilled');

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

    //=====================================================
    // Section : Test Technical Analysis
    //=====================================================

    cy.log('Testing Sentiment Analysis');

    cy.get('[data-testid="canonicalTagPresent"]')
      .should('exist')
      .should('be.visible')
      .should('contain.text', 'Yes');

    cy.get('[data-testid="canonicalTag"]')
      .should('exist')
      .should('be.visible')
      .should('contain.text', 'https://steers.co.za');

    cy.get('[data-testid="siteSpeed"]')
      .should('exist')
      .should('be.visible')
      .should('contain.text', '0');

    cy.get('[data-testid="isSitemapvalid"]')
      .should('exist')
      .should('be.visible')
      .should('contain.text', 'Yes');

    cy.get('[data-testid="mobile_friendliness"]')
      .should('exist')
      .should('be.visible')
      .should('contain.text', 'Yes');

    cy.get('[data-testid="indexibilityAnalysis"]')
      .should('exist')
      .should('be.visible')
      .should('contain.text', 'Yes');

    cy.get('[data-testid="structuredData"]')
      .should('exist')
      .should('be.visible')
      .should('contain.text', '0');

    cy.get('[data-testid="structured_recommendations"]')
      .should('exist')
      .should('be.visible')
      .should(
        'contain.text',
        'No structured data found. Add structured data to improve SEO.'
      );
  });
});

/* describe('results2', () => {
   it('general layout intact', () => {
     cy.testLayout('/results');
  });

}); */
