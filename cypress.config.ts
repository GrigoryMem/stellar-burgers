import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    // автоматически подставлять этот адрес перед всеми относительными URL-ами
    //  в командах cy.visit(), cy.request() и других.
    baseUrl: 'http://localhost:4000'
  }
});
