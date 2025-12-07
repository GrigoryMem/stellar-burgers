declare namespace Cypress {
  interface Chainable {
    clearDataAuthoriz(): Chainable<void>;
    findIngredientAndClick(numIngr): Chainable<void>;
    addIngredient(numIng, type): Chainable<void>;
    setTestTokens(): Chainable<void>;
    closeModalByEscape(): Chainable<void>;
    getCardOrderAndClickHim(num): Chainable<void>;
    closeModalByClickOverlay(): Chainable<void>;
  }
}
