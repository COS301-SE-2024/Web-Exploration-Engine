```typescript
    cy.get('[data-testid="canonical_recommendations"]')
      .should('exist')
      .should('be.visible')
      .should('contain.text', '');
```