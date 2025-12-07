/// <reference types="cypress" />

import { setCookie } from '../../src/utils/cookie';

//  очистка авторизации
Cypress.Commands.add('clearDataAuthoriz', () => {
  cy.clearAllCookies();
  cy.clearAllLocalStorage();
});
//  найдем ингредаент и кликлнем по нему
Cypress.Commands.add('findIngredientAndClick', (numIngr) => {
  cy.get('[data-cy=ingredient]')
    .eq(numIngr)
    .scrollIntoView()
    .should('be.visible')
    .click();
});

//  добавить ингредиент в корзину бургера
Cypress.Commands.add('addIngredient', (numIngr, type) => {
  cy.get('[data-cy=ingredient]')
    .filter(`[data-type=${type}]`)
    .eq(numIngr) // номер в массиве ингр-в
    .scrollIntoView() // прокрутка чтобы элемент сталвидимым
    .within(() => {
      // ограничисся работойс ним
      cy.get('button').should('be.visible').click();
    });
});
//  установка токенов
Cypress.Commands.add('setTestTokens', () => {
  const fakeRefrToken =
    '1359788d0a02dg3d8e7edf7eb35b59373028c97923db8eddd65raae617f8b2deb01676918b54ed5c';
  const fakeAccessToken =
    'Bearer%20eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ7.eyJpZCI8IjY5MWIwMDNmYTY0MTc3MDAxYjMxZjBhNiIsImlhdCI6MTc2NDYxMzY1OCwiZXhwIjoxNzY0NjE0ODU4mV.Yim07OhJdDNnrZT3x84gNne6V598Y0YZ82gdFMxCKCs';
  localStorage.setItem('refreshToken', fakeRefrToken);
  setCookie('accessToken', fakeAccessToken);
});

// закрытие модалки по escape
Cypress.Commands.add('closeModalByEscape', () => {
  //  проверяем что мо появилось
  cy.get('[data-cy=modalUI]')
    .should('be.visible')
    // нажимаем кл escape
    .trigger('keydown', {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      which: 27
    })
    //  проверяем что модалка ушла
    .should('not.exist');
});
Cypress.Commands.add('closeModalByClickOverlay', () => {
  //  модалка повилась?
  cy.get('[data-cy=modalUI]').should('be.visible');
  //  если есть оверлей - то кликаем по нему принудительно через force
  cy.get('[data-cy=modal-overlay]').should('be.exist').click({ force: true });
  //  оверлей и модалка должны исчезнуть
  cy.get('[data-cy=modalUI]').should('not.exist');
  cy.get('[data-cy=modal-overlay]').should('not.exist');
});
//  получаем заказ и жмем клик по нему
Cypress.Commands.add('getCardOrderAndClickHim', (num) => {
  cy.get('[data-cy=order]')
    .eq(num)
    .scrollIntoView()
    .should('be.visible')
    .click();
});
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
