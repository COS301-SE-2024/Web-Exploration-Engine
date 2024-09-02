/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    login(email: string, password: string): void;
    mockUnsplash(): void;
    testHelp(page: string): void;
    testLayout(page: string): void;
    triggerMockGitHub(): void;
    triggerMockGitHubMockInsecure(): void;
    triggerMockSteers(): void;
    triggerMock(): void;
    scrape4Websites(): void;
    scrape3Websites(): void;
    scrape2Websites(): void;
    scrapeGithub(): void;
    scrapeCisco(): void;
    scrapeWimpy(): void;
    scrapeInsecure(): void;
    scrapeSteers(): void;

    importAllMocks(page: string): void;
  }
}

// -- This is a parent command --
Cypress.Commands.add('login', (email, password) => {
  console.log('Custom command example: Login', email, password);
});



Cypress.Commands.add('mockUnsplash', () => {
  cy.fixture('/api/scraper/unsplash')
    .as('mock_scraper_unsplash')
    .then((mock_scraper_unsplash) => {
      cy.intercept(
        'GET',
        'http://localhost:3000/api/scraper?url=https%3A%2F%2Funsplash.com',
        mock_scraper_unsplash
      ).as('mock_scraper_unsplash');
    });
});

Cypress.Commands.add('testHelp', (page) => {
  cy.visit(page);
  cy.get('[data-testid="help-button"]').should('exist');
});

Cypress.Commands.add('triggerMockGitHub', () => {
  cy.visit('/');
  cy.get('[data-testid="scraping-textarea-home"]').type('https://github.com');
  //cy.get('[data-testid="input-start-scraping"]').type('https://github.com');
  cy.get('[data-testid="btn-start-scraping"]').click();
});

Cypress.Commands.add('triggerMockGitHubMockInsecure', () => {
  cy.visit('/');
  cy.get('[data-testid="scraping-textarea-home"]').type('https://github.com,https://www.hbo.com/insecure')
  cy.get('[data-testid="btn-start-scraping"]').click();
});

Cypress.Commands.add('testLayout', (page) => {

  cy.visit(page);
  
    //Testing Header
    cy.get('[data-testid="header"]').should('exist');

  //Testing Footer
  cy.get('[data-testid="footer"]').should('exist');

  //cy.get('[data-testid="footer"]').should('have.attr', 'href').and('include', 'help')

  //Chech DNS info
  cy.get('[data-testid="footer"]').contains(/domain name services/i);
  cy.get('[data-testid="footer"]').contains(/midrand, south africa/i);
  cy.get('[data-testid="footer"]').contains(/27 11 568 2800/i);
  
  //Testing Help Button
  cy.get('[data-testid="help-button"]').should('exist');
  cy.get('[data-testid="help-button"]').click();

  cy.get('[data-testid="help-modal"]').should('exist');
  cy.get('[data-testid="help-modal"]').should('be.visible');
  cy.get('[data-testid="help-modal"]').should('contain', 'Help');


});

Cypress.Commands.add('importAllMocks', () => {
  //Get all mocks then intercept all api requests using those mocks
  cy.fixture('/api/scraper/github')
    .as('mock_scraper_github')
    .then((mock_scraper_github) => {
      cy.intercept(
        'GET',
        'http://localhost:3000/api/scraper?url=https%3A%2F%2Fgithub.com',
        mock_scraper_github
      ).as('mock_scraper_github');
    });

  cy.fixture('/api/scraper/classify-industry/github')
    .as('mock_industry_github')
    .then((mock_industry_github) => {
      cy.intercept(
        'GET',
        'http://localhost:3000/api/scraper/classify-industry?url=https%3A%2F%2Fgithub.com',
        mock_industry_github
      ).as('mock_industry_github');
    });

  cy.fixture('/api/scraper/read-robots/github')
    .as('mock_robots_github')
    .then((mock_robots_github) => {
      cy.intercept(
        'GET',
        'http://localhost:3000/api/scraper/read-robots?url=https%3A%2F%2Fgithub.com',
        mock_robots_github
      ).as('mock_robots_github');
    });

  cy.fixture('/api/scraper/scrape-images/github')
    .as('mock_images_github')
    .then((mock_images_github) => {
      cy.intercept(
        'GET',
        'http://localhost:3000/api/scraper/scrape-images?url=https%3A%2F%2Fgithub.com',
        mock_images_github
      ).as('mock_images_github');
    });

  cy.fixture('/api/scraper/scrape-logo/github')
    .as('mock_logo_github')
    .then((mock_logo_github) => {
      cy.intercept(
        'GET',
        'http://localhost:3000/api/scraper/scrape-logo?url=https%3A%2F%2Fgithub.com',
        mock_logo_github
      ).as('mock_logo_github');
    });

  cy.fixture('/api/scraper/scrape-metadata/github')
    .as('mock_metadata_github')
    .then((mock_metadata_github) => {
      cy.intercept(
        'GET',
        'http://localhost:3000/api/scraper/scrape-metadata?url=https%3A%2F%2Fgithub.com',
        mock_metadata_github
      ).as('mock_metadata_github');
    });

  cy.fixture('/api/scraper/scrape-status/github')
    .as('mock_status_github')
    .then((mock_status_github) => {
      cy.intercept(
        'GET',
        'http://localhost:3000/api/scraper/scrape-status?url=https%3A%2F%2Fgithub.com',
        mock_status_github
      ).as('mock_status_github');
    });
});


Cypress.Commands.add('scrape4Websites', () => {

  cy.visit('/');
  cy.get('[data-testid="scraping-textarea-home"]').type('https://mock.test.steers.co.za,https://mock.test.wimpy.co.za,https://mock.test.github.com,https://mock.test.insecure.co.za');
  cy.get('[data-testid="btn-start-scraping"]').click();

  //======================================================
  // GitHub Mock
  //======================================================

  //Full response
    cy.fixture('/pub-sub/github-done')
    .as('mock_scraper_mockgithub_done')
    .then((mock_scraper_mockgithub_done) => {
      cy.intercept(
        'GET',
        'http://localhost:3002/api/scraper?url=https%3A%2F%2Fmock.test.github.com',//mock.test.github.com
        mock_scraper_mockgithub_done
      ).as('mock_scraper_mockgithub_done');
    });

  //Pub Sub - Publish Event
  cy.fixture('/pub-sub/github-waiting')
    .as('mock_scraper_mockgithub_waiting')
    .then((mock_scraper_mockgithub_waiting) => {
      cy.intercept(
        'GET',
        'http://localhost:3002/api/scraper/status?type=scrape&url=https%3A%2F%2Fmock.test.github.com',
        mock_scraper_mockgithub_waiting
      ).as('mock_scraper_mockgithub_waiting');
    });

  //Pub Sub - Get Event Status
   cy.fixture('/pub-sub/github-status')
   .as('mock_scraper_mockgithub_status')
   .then((mock_scraper_mockgithub_status) => {
     cy.intercept(
       'GET',
       'http://localhost:3002/api/scraper/status/scrape/https%3A%2F%2Fmock.test.github.com',
       mock_scraper_mockgithub_status
     ).as('mock_scraper_mockgithub_status');
   });



  //======================================================
  // Steers Mock
  //======================================================

  //Full response
  cy.fixture('/pub-sub/steers-done')
  .as('mock_scraper_mocksteers_done')
  .then((mock_scraper_mocksteers_done) => {
    cy.intercept(
      'GET',
      'http://localhost:3002/api/scraper?url=https%3A%2F%2Fmock.test.steers.co.za',//mock.test.steers.co.za
      mock_scraper_mocksteers_done
    ).as('mock_scraper_mocksteers_done');
  });

//Pub Sub - Publish Event
cy.fixture('/pub-sub/steers-waiting')
  .as('mock_scraper_mocksteers_waiting')
  .then((mock_scraper_mocksteers_waiting) => {
    cy.intercept(
      'GET',
      'http://localhost:3002/api/scraper/status?type=scrape&url=https%3A%2F%2Fmock.test.steers.co.za',
      mock_scraper_mocksteers_waiting
    ).as('mock_scraper_mocksteers_waiting');
  });

//Pub Sub - Get Event Status
 cy.fixture('/pub-sub/steers-status')
 .as('mock_scraper_mocksteers_status')
 .then((mock_scraper_mocksteers_status) => {
   cy.intercept(
     'GET',
     'http://localhost:3002/api/scraper/status/scrape/https%3A%2F%2Fmock.test.steers.co.za',
     mock_scraper_mocksteers_status
   ).as('mock_scraper_mocksteers_status');
 });



  //======================================================
  // Wimpy Mock
  //======================================================

  //Full response
  cy.fixture('/pub-sub/wimpy-done')
  .as('mock_scraper_mockwimpy_done')
  .then((mock_scraper_mockwimpy_done) => {
    cy.intercept(
      'GET',
      'http://localhost:3002/api/scraper?url=https%3A%2F%2Fmock.test.wimpy.co.za',//mock.test.wimpy.co.za
      mock_scraper_mockwimpy_done
    ).as('mock_scraper_mockwimpy_done');
  });

//Pub Sub - Publish Event
cy.fixture('/pub-sub/wimpy-waiting')
  .as('mock_scraper_mockwimpy_waiting')
  .then((mock_scraper_mockwimpy_waiting) => {
    cy.intercept(
      'GET',
      'http://localhost:3002/api/scraper/status?type=scrape&url=https%3A%2F%2Fmock.test.wimpy.co.za',
      mock_scraper_mockwimpy_waiting
    ).as('mock_scraper_mockwimpy_waiting');
  });

//Pub Sub - Get Event Status
 cy.fixture('/pub-sub/wimpy-status')
 .as('mock_scraper_mockwimpy_status')
 .then((mock_scraper_mockwimpy_status) => {
   cy.intercept(
     'GET',
     'http://localhost:3002/api/scraper/status/scrape/https%3A%2F%2Fmock.test.wimpy.co.za',
     mock_scraper_mockwimpy_status
   ).as('mock_scraper_mockwimpy_status');
 });

  //======================================================
    // Insecure Mock
    //======================================================

    //Full response
    cy.fixture('/pub-sub/insecure-done')
    .as('mock_scraper_mockinsecure_done')
    .then((mock_scraper_mockinsecure_done) => {
      cy.intercept(
        'GET',
        'http://localhost:3002/api/scraper?url=https%3A%2F%2Fmock.test.insecure.co.za',//mock.test.insecure.co.za
        mock_scraper_mockinsecure_done
      ).as('mock_scraper_mockinsecure_done');
    });

  //Pub Sub - Publish Event
  cy.fixture('/pub-sub/insecure-waiting')
    .as('mock_scraper_mockinsecure_waiting')
    .then((mock_scraper_mockinsecure_waiting) => {
      cy.intercept(
        'GET',
        'http://localhost:3002/api/scraper/status?type=scrape&url=https%3A%2F%2Fmock.test.insecure.co.za',
        mock_scraper_mockinsecure_waiting
      ).as('mock_scraper_mockinsecure_waiting');
    });

  //Pub Sub - Get Event Status
   cy.fixture('/pub-sub/insecure-status')
   .as('mock_scraper_mockinsecure_status')
   .then((mock_scraper_mockinsecure_status) => {
     cy.intercept(
       'GET',
       'http://localhost:3002/api/scraper/status/scrape/https%3A%2F%2Fmock.test.insecure.co.za',
       mock_scraper_mockinsecure_status
     ).as('mock_scraper_mockinsecure_status');
   });




  //======================================================
  // Cypress Waits
  //======================================================
    
  //Wait for github to finish
  cy.wait('@mock_scraper_mockgithub_done');

  //Wait for steers to finish
   cy.wait('@mock_scraper_mocksteers_done');

  //Wait for wimpy to finish
  cy.wait('@mock_scraper_mockwimpy_done');

  //Waiting for the insecure mock doesnt work


  cy.url().should('include', 'scraperesults');
  

});


Cypress.Commands.add('scrape3Websites', () => {

  cy.visit('/');
  cy.get('[data-testid="scraping-textarea-home"]').type('https://mock.test.steers.co.za,https://mock.test.wimpy.co.za,https://mock.test.github.com');
  cy.get('[data-testid="btn-start-scraping"]').click();

  //======================================================
  // GitHub Mock
  //======================================================

  //Full response
    cy.fixture('/pub-sub/github-done')
    .as('mock_scraper_mockgithub_done')
    .then((mock_scraper_mockgithub_done) => {
      cy.intercept(
        'GET',
        'http://localhost:3002/api/scraper?url=https%3A%2F%2Fmock.test.github.com',//mock.test.github.com
        mock_scraper_mockgithub_done
      ).as('mock_scraper_mockgithub_done');
    });

  //Pub Sub - Publish Event
  cy.fixture('/pub-sub/github-waiting')
    .as('mock_scraper_mockgithub_waiting')
    .then((mock_scraper_mockgithub_waiting) => {
      cy.intercept(
        'GET',
        'http://localhost:3002/api/scraper/status?type=scrape&url=https%3A%2F%2Fmock.test.github.com',
        mock_scraper_mockgithub_waiting
      ).as('mock_scraper_mockgithub_waiting');
    });

  //Pub Sub - Get Event Status
   cy.fixture('/pub-sub/github-status')
   .as('mock_scraper_mockgithub_status')
   .then((mock_scraper_mockgithub_status) => {
     cy.intercept(
       'GET',
       'http://localhost:3002/api/scraper/status/scrape/https%3A%2F%2Fmock.test.github.com',
       mock_scraper_mockgithub_status
     ).as('mock_scraper_mockgithub_status');
   });



  //======================================================
  // Steers Mock
  //======================================================

  //Full response
  cy.fixture('/pub-sub/steers-done')
  .as('mock_scraper_mocksteers_done')
  .then((mock_scraper_mocksteers_done) => {
    cy.intercept(
      'GET',
      'http://localhost:3002/api/scraper?url=https%3A%2F%2Fmock.test.steers.co.za',//mock.test.steers.co.za
      mock_scraper_mocksteers_done
    ).as('mock_scraper_mocksteers_done');
  });

//Pub Sub - Publish Event
cy.fixture('/pub-sub/steers-waiting')
  .as('mock_scraper_mocksteers_waiting')
  .then((mock_scraper_mocksteers_waiting) => {
    cy.intercept(
      'GET',
      'http://localhost:3002/api/scraper/status?type=scrape&url=https%3A%2F%2Fmock.test.steers.co.za',
      mock_scraper_mocksteers_waiting
    ).as('mock_scraper_mocksteers_waiting');
  });

//Pub Sub - Get Event Status
 cy.fixture('/pub-sub/steers-status')
 .as('mock_scraper_mocksteers_status')
 .then((mock_scraper_mocksteers_status) => {
   cy.intercept(
     'GET',
     'http://localhost:3002/api/scraper/status/scrape/https%3A%2F%2Fmock.test.steers.co.za',
     mock_scraper_mocksteers_status
   ).as('mock_scraper_mocksteers_status');
 });



  //======================================================
  // Wimpy Mock
  //======================================================

  //Full response
  cy.fixture('/pub-sub/wimpy-done')
  .as('mock_scraper_mockwimpy_done')
  .then((mock_scraper_mockwimpy_done) => {
    cy.intercept(
      'GET',
      'http://localhost:3002/api/scraper?url=https%3A%2F%2Fmock.test.wimpy.co.za',//mock.test.wimpy.co.za
      mock_scraper_mockwimpy_done
    ).as('mock_scraper_mockwimpy_done');
  });

//Pub Sub - Publish Event
cy.fixture('/pub-sub/wimpy-waiting')
  .as('mock_scraper_mockwimpy_waiting')
  .then((mock_scraper_mockwimpy_waiting) => {
    cy.intercept(
      'GET',
      'http://localhost:3002/api/scraper/status?type=scrape&url=https%3A%2F%2Fmock.test.wimpy.co.za',
      mock_scraper_mockwimpy_waiting
    ).as('mock_scraper_mockwimpy_waiting');
  });

//Pub Sub - Get Event Status
 cy.fixture('/pub-sub/wimpy-status')
 .as('mock_scraper_mockwimpy_status')
 .then((mock_scraper_mockwimpy_status) => {
   cy.intercept(
     'GET',
     'http://localhost:3002/api/scraper/status/scrape/https%3A%2F%2Fmock.test.wimpy.co.za',
     mock_scraper_mockwimpy_status
   ).as('mock_scraper_mockwimpy_status');
 });


  //======================================================
  // Cypress Waits
  //======================================================
    
  //Wait for github to finish
  cy.wait('@mock_scraper_mockgithub_done');

  //Wait for steers to finish
   cy.wait('@mock_scraper_mocksteers_done');

  //Wait for wimpy to finish
  cy.wait('@mock_scraper_mockwimpy_done');

  cy.url().should('include', 'scraperesults');

});


Cypress.Commands.add('scrape2Websites', () => {

  cy.visit('/');
  cy.get('[data-testid="scraping-textarea-home"]').type('https://mock.test.steers.co.za,https://mock.test.wimpy.co.za,https://mock.test.insecure.co.za');
  cy.get('[data-testid="btn-start-scraping"]').click();


  //======================================================
  // Steers Mock
  //======================================================

  //Full response
  cy.fixture('/pub-sub/steers-done')
  .as('mock_scraper_mocksteers_done')
  .then((mock_scraper_mocksteers_done) => {
    cy.intercept(
      'GET',
      'http://localhost:3002/api/scraper?url=https%3A%2F%2Fmock.test.steers.co.za',//mock.test.steers.co.za
      mock_scraper_mocksteers_done
    ).as('mock_scraper_mocksteers_done');
  });

//Pub Sub - Publish Event
cy.fixture('/pub-sub/steers-waiting')
  .as('mock_scraper_mocksteers_waiting')
  .then((mock_scraper_mocksteers_waiting) => {
    cy.intercept(
      'GET',
      'http://localhost:3002/api/scraper/status?type=scrape&url=https%3A%2F%2Fmock.test.steers.co.za',
      mock_scraper_mocksteers_waiting
    ).as('mock_scraper_mocksteers_waiting');
  });

//Pub Sub - Get Event Status
 cy.fixture('/pub-sub/steers-status')
 .as('mock_scraper_mocksteers_status')
 .then((mock_scraper_mocksteers_status) => {
   cy.intercept(
     'GET',
     'http://localhost:3002/api/scraper/status/scrape/https%3A%2F%2Fmock.test.steers.co.za',
     mock_scraper_mocksteers_status
   ).as('mock_scraper_mocksteers_status');
 });



  //======================================================
  // Wimpy Mock
  //======================================================

  //Full response
  cy.fixture('/pub-sub/wimpy-done')
  .as('mock_scraper_mockwimpy_done')
  .then((mock_scraper_mockwimpy_done) => {
    cy.intercept(
      'GET',
      'http://localhost:3002/api/scraper?url=https%3A%2F%2Fmock.test.wimpy.co.za',//mock.test.wimpy.co.za
      mock_scraper_mockwimpy_done
    ).as('mock_scraper_mockwimpy_done');
  });

//Pub Sub - Publish Event
cy.fixture('/pub-sub/wimpy-waiting')
  .as('mock_scraper_mockwimpy_waiting')
  .then((mock_scraper_mockwimpy_waiting) => {
    cy.intercept(
      'GET',
      'http://localhost:3002/api/scraper/status?type=scrape&url=https%3A%2F%2Fmock.test.wimpy.co.za',
      mock_scraper_mockwimpy_waiting
    ).as('mock_scraper_mockwimpy_waiting');
  });

//Pub Sub - Get Event Status
 cy.fixture('/pub-sub/wimpy-status')
 .as('mock_scraper_mockwimpy_status')
 .then((mock_scraper_mockwimpy_status) => {
   cy.intercept(
     'GET',
     'http://localhost:3002/api/scraper/status/scrape/https%3A%2F%2Fmock.test.wimpy.co.za',
     mock_scraper_mockwimpy_status
   ).as('mock_scraper_mockwimpy_status');
 });


  //======================================================
  // Cypress Waits
  //======================================================

});


Cypress.Commands.add('scrapeGithub', () => {
    cy.visit('/');

    cy.get('[data-testid="scraping-textarea-home"]').type('https://mock.test.github.com');

    cy.get('[data-testid="btn-start-scraping"]').click();

      
    cy.fixture('/pub-sub/github-done')
      .as('mock_scraper_github')
      .then((mock_scraper_github) => {
        cy.intercept(
          'GET',
          'http://localhost:3002/api/scraper?url=https%3A%2F%2Fmock.test.github.com',
          mock_scraper_github
        ).as('mock_scraper_github_done');
      });

    cy.fixture('/pub-sub/github-status')
      .as('mock_scraper_github')
      .then((mock_scraper_github) => {
        cy.intercept(
          'GET',
          'http://localhost:3002/api/scraper/status/scrape/https%3A%2F%2Fmock.test.github.com',
          mock_scraper_github
        ).as('mock_scraper_github_check_job');
      });


    cy.fixture('/pub-sub/github-waiting')
      .as('mock_scraper_github')
      .then((mock_scraper_github) => {
        cy.intercept(
          'GET',
          'http://localhost:3002/api/scraper/status?type=scrape&url=https%3A%2F%2Fmock.test.github.com',
          mock_scraper_github
        ).as('mock_scraper_github_check_job');
      });

  
});

Cypress.Commands.add('scrapeCisco', () => {
    cy.visit('/');

    cy.get('[data-testid="scraping-textarea-home"]').type('https://mock.test.cisco.com');

    cy.get('[data-testid="btn-start-scraping"]').click();

      
    cy.fixture('/pub-sub/cisco-done')
      .as('mock_scraper_cisco')
      .then((mock_scraper_cisco) => {
        cy.intercept(
          'GET',
          'http://localhost:3002/api/scraper?url=https%3A%2F%2Fmock.test.cisco.com',
          mock_scraper_cisco
        ).as('mock_scraper_cisco_done');
      });

    cy.fixture('/pub-sub/cisco-status')
      .as('mock_scraper_cisco')
      .then((mock_scraper_cisco) => {
        cy.intercept(
          'GET',
          'http://localhost:3002/api/scraper/status/scrape/https%3A%2F%2Fmock.test.cisco.com',
          mock_scraper_cisco
        ).as('mock_scraper_cisco_check_job');
      });


    cy.fixture('/pub-sub/cisco-waiting')
      .as('mock_scraper_cisco')
      .then((mock_scraper_cisco) => {
        cy.intercept(
          'GET',
          'http://localhost:3002/api/scraper/status?type=scrape&url=https%3A%2F%2Fmock.test.cisco.com',
          mock_scraper_cisco
        ).as('mock_scraper_cisco_check_job');
      });

    // Key word analysis mocks

    // Mocking the results - ie keyword-status
    cy.fixture('/pub-sub/cisco-keyword-cisco-analysis-poll')
      .as('mock_scraper_cisco_keyword_cisco_check_job')
      .then((mock_scraper_cisco_keyword_cisco_check_job) => {
        cy.intercept(
          'GET',
          'http://localhost:3002/api/scraper/keyword-status?url=https%3A%2F%2Fmeraki.cisco.com%2F&keyword=cisco',
          mock_scraper_cisco_keyword_cisco_check_job
        ).as('mock_scraper_cisco_keyword_cisco_check_job');
      });

    cy.fixture('/pub-sub/cisco-keyword-meraki-analysis-poll')
      .as('mock_scraper_cisco_keyword_meraki_check_job')
      .then((mock_scraper_cisco_keyword_meraki_check_job) => {
        cy.intercept(
          'GET',
          'http://localhost:3002/api/scraper/keyword-status?url=https%3A%2F%2Fmeraki.cisco.com%2F&keyword=cisco',
          mock_scraper_cisco_keyword_meraki_check_job
        ).as('mock_scraper_cisco_keyword_meraki_check_job');
      });

      
      //Mocking polling ie keyword-analysis?url=...
      cy.fixture('/pub-sub/cisco-keyword-cisco-analysis-result')
        .as('mock_scraper_cisco_keyword_cisco_result')
        .then((mock_scraper_cisco_keyword_cisco_result) => {
          cy.intercept(
            'GET',
            'http://localhost:3002/api/scraper/keyword-analysis?url=https%3A%2F%2Fmock.test.cisco.com%2F&keyword=cisco',
            mock_scraper_cisco_keyword_cisco_result
          ).as('mock_scraper_cisco_keyword_cisco_result');
        });
  
      cy.fixture('/pub-sub/cisco-keyword-meraki-analysis-result')
        .as('mock_scraper_cisco_keyword_meraki_result')
        .then((mock_scraper_cisco_keyword_meraki_result) => {
          cy.intercept(
            'GET',
            'http://localhost:3002/api/scraper/keyword-analysis?url=https%3A%2F%2Fmeraki.cisco.com%2F&keyword=meraki',
            mock_scraper_cisco_keyword_meraki_result
          ).as('mock_scraper_cisco_keyword_meraki_result');
        });


});


Cypress.Commands.add('scrapeSteers', () => {

  cy.visit('/');
  cy.get('[data-testid="scraping-textarea-home"]').type('https://mock.test.steers.co.za');
  cy.get('[data-testid="btn-start-scraping"]').click();

  

  //======================================================
  // Steers Mock
  //======================================================

  //Full response
  cy.fixture('/pub-sub/steers-done')
  .as('mock_scraper_mocksteers_done')
  .then((mock_scraper_mocksteers_done) => {
    cy.intercept(
      'GET',
      'http://localhost:3002/api/scraper?url=https%3A%2F%2Fmock.test.steers.co.za',//mock.test.steers.co.za
      mock_scraper_mocksteers_done
    ).as('mock_scraper_mocksteers_done');
  });

//Pub Sub - Publish Event
cy.fixture('/pub-sub/steers-waiting')
  .as('mock_scraper_mocksteers_waiting')
  .then((mock_scraper_mocksteers_waiting) => {
    cy.intercept(
      'GET',
      'http://localhost:3002/api/scraper/status?type=scrape&url=https%3A%2F%2Fmock.test.steers.co.za',
      mock_scraper_mocksteers_waiting
    ).as('mock_scraper_mocksteers_waiting');
  });

//Pub Sub - Get Event Status
 cy.fixture('/pub-sub/steers-status')
 .as('mock_scraper_mocksteers_status')
 .then((mock_scraper_mocksteers_status) => {
   cy.intercept(
     'GET',
     'http://localhost:3002/api/scraper/status/scrape/https%3A%2F%2Fmock.test.steers.co.za',
     mock_scraper_mocksteers_status
   ).as('mock_scraper_mocksteers_status');
 });


  
});


Cypress.Commands.add('scrapeInsecure', () => {

  cy.visit('/');
  cy.get('[data-testid="scraping-textarea-home"]').type('https://mock.test.insecure.co.za');
  cy.get('[data-testid="btn-start-scraping"]').click();

  

  //======================================================
  // Steers Mock
  //======================================================

  //Full response
  cy.fixture('/pub-sub/steers-done')
  .as('mock_scraper_mocksteers_done')
  .then((mock_scraper_mocksteers_done) => {
    cy.intercept(
      'GET',
      'http://localhost:3002/api/scraper?url=https%3A%2F%2Fmock.test.steers.co.za',//mock.test.steers.co.za
      mock_scraper_mocksteers_done
    ).as('mock_scraper_mocksteers_done');
  });

//Pub Sub - Publish Event
cy.fixture('/pub-sub/steers-waiting')
  .as('mock_scraper_mocksteers_waiting')
  .then((mock_scraper_mocksteers_waiting) => {
    cy.intercept(
      'GET',
      'http://localhost:3002/api/scraper/status?type=scrape&url=https%3A%2F%2Fmock.test.steers.co.za',
      mock_scraper_mocksteers_waiting
    ).as('mock_scraper_mocksteers_waiting');
  });

//Pub Sub - Get Event Status
 cy.fixture('/pub-sub/steers-status')
 .as('mock_scraper_mocksteers_status')
 .then((mock_scraper_mocksteers_status) => {
   cy.intercept(
     'GET',
     'http://localhost:3002/api/scraper/status/scrape/https%3A%2F%2Fmock.test.steers.co.za',
     mock_scraper_mocksteers_status
   ).as('mock_scraper_mocksteers_status');
 });


  
});

Cypress.Commands.add('scrapeWimpy', () => {

  cy.visit('/');
  cy.get('[data-testid="scraping-textarea-home"]').type('https://mock.test.wimpy.co.za');
  cy.get('[data-testid="btn-start-scraping"]').click();

  


  //======================================================
    // Insecure Mock
    //======================================================

    //Full response
    cy.fixture('/pub-sub/insecure-done')
    .as('mock_scraper_mockinsecure_done')
    .then((mock_scraper_mockinsecure_done) => {
      cy.intercept(
        'GET',
        'http://localhost:3002/api/scraper?url=https%3A%2F%2Fmock.test.insecure.co.za',//mock.test.insecure.co.za
        mock_scraper_mockinsecure_done
      ).as('mock_scraper_mockinsecure_done');
    });

  //Pub Sub - Publish Event
  cy.fixture('/pub-sub/insecure-waiting')
    .as('mock_scraper_mockinsecure_waiting')
    .then((mock_scraper_mockinsecure_waiting) => {
      cy.intercept(
        'GET',
        'http://localhost:3002/api/scraper/status?type=scrape&url=https%3A%2F%2Fmock.test.insecure.co.za',
        mock_scraper_mockinsecure_waiting
      ).as('mock_scraper_mockinsecure_waiting');
    });

  //Pub Sub - Get Event Status
   cy.fixture('/pub-sub/insecure-status')
   .as('mock_scraper_mockinsecure_status')
   .then((mock_scraper_mockinsecure_status) => {
     cy.intercept(
       'GET',
       'http://localhost:3002/api/scraper/status/scrape/https%3A%2F%2Fmock.test.insecure.co.za',
       mock_scraper_mockinsecure_status
     ).as('mock_scraper_mockinsecure_status');
   });


  
});


