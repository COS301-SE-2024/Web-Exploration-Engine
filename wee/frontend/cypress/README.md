# Using Cypress

Here's a tutorial on using cypress with the W.E.E. 🫡

[W.E.E. - Using Cypress to Write Integration Tests](https://drive.google.com/file/d/1qEjKfiz9Vdjv4Lyk_UMWahPVGtlshsnH/view?usp=sharing)

Additionally, here are the best practices we should keep in mind :

https://docs.cypress.io/guides/references/best-practices

# Debug Cypress Tests

1. Navigate to the frontend directory
2. Run the command
3. Choose a browser to open the tests in (not Electron)

# Run Frontend Integration Tests

This command works from any directory :

```bash
nx e2e frontend --configuration=production
```

# General Notes Regarding Cypress Tests

### When writing a test that involves visiting a url such as https://localhost:8888/ :

1. It's best to set that as a baseUrl in the `cypress.config.ts`
   - that file can be found in this folder ( )
   - then after that baseUrl has been set you can change the routing commands to work from the base url, eg :
     - `cy.visit("/")` is the same as `cy.visit("https://localhost:8888/")`
     - `cy.visit("/help")` is the same as `cy.visit("https://localhost:8888/help")`

# Guidelines for Writing Cypress Tests

## 1. Setup and Teardown:

Before/After Hooks: Use before, beforeEach, after, and afterEach hooks to set up preconditions and clean up after tests.

```javascript
before(() => {
  // runs once before all tests
});

beforeEach(() => {
  // runs before each test
});

after(() => {
  // runs once after all tests
});

afterEach(() => {
  // runs after each test
});
```

## 2. Writing Tests:

Describe Blocks: Group related tests together using describe.

```javascript
describe('Login Page', () => {
  it('should display the login form', () => {
    // test code
  });
});
```

Using It Blocks: Each it block represents a single test case.

```javascript
it('should allow a user to log in', () => {
  // test code
});
```

## 3. Assertions:

Use assertions to verify that the application behaves as expected.

```javascript
cy.get('input[name="username"]').should('be.visible');
cy.get('form').submit();
cy.url().should('include', '/dashboard');
```

## 4. Commands and Custom Commands:

Built-in Commands: Use Cypress's built-in commands to interact with the DOM.

```javascript
cy.visit('/login');
cy.get('input[name="username"]').type('user1');
cy.get('input[name="password"]').type('password1');
cy.get('button[type="submit"]').click();
```

Custom Commands: Create reusable commands for common actions.

```javascript
Cypress.Commands.add('login', (username, password) => {
  cy.visit('/login');
  cy.get('input[name="username"]').type(username);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
});
```

## 5. Handling Asynchronous Behavior:

Cypress automatically waits for elements to appear and for assertions to pass, but you can also use cy.wait() for specific time delays or network requests.

```javascript
cy.intercept('POST', '/api/login').as('loginRequest');
cy.get('button[type="submit"]').click();
cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
```

## 6. Fixtures:

Use fixtures to load test data.

```javascript
beforeEach(() => {
  cy.fixture('user').then((user) => {
    this.user = user;
  });
});

it('should log in with fixture data', function () {
  cy.get('input[name="username"]').type(this.user.username);
  cy.get('input[name="password"]').type(this.user.password);
  cy.get('button[type="submit"]').click();
});
```

## 7. Organizing Tests:

Grouping by feature, by page

- Group general tests in one file eg. `routing.cy.ts`
- Each page in the application can should one file eg. `login-signup.cy.ts`

## 8. Running Tests:

Command Line: Run tests from the command line for continuous integration.

```bash
npx cypress run
```

Test Runner: Use the Cypress Test Runner for an interactive testing experience.

```bash
npx cypress open
```

## 9. Debugging Tests:

Use cy.pause() to pause the test at a specific point.

```javascript
cy.get('input[name="username"]').type('user1').pause();
```

Use cy.debug() to print debug information to the console.

```javascript
cy.get('input[name="username"]').type('user1').debug();
```

<!--

Leaving this out as I'm still debugging actions locally 😁

## 10. Continuous Integration:
Integrate Cypress tests into your CI pipeline to automatically run tests on every commit.
yaml
# Example for GitHub Actions

```yaml
name: CI
on: [push]
jobs:
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Run Cypress tests
        run: npx cypress run
```
-->
