import {
  clearConstructor,
  totalSumSelector
} from 'src/services/slices/constructorBurger/constrBurgSlice';
import store from '../../src/services/store';
import { setCookie } from 'src/utils/cookie';

describe('ингредиенты', () => {
  beforeEach(() => {
    //  очищать корзину через стор redux перед каждым тестом
    store.dispatch(clearConstructor());
    // dispatch({type:'burgerConstructor/clearConstructor'});
    //  делаем перехват запросов
    // получили юзера
    cy.intercept(
      {
        method: 'GET',
        url: '**/auth/user'
      },
      {
        fixture: 'test-user-data'
      }
    ).as('getUser');
    // получили ингредиенты
    cy.intercept(
      {
        method: 'GET',
        url: '**/ingredients'
      },
      {
        fixture: 'test-ingredients'
      }
    ).as('getIngredients');

    //  заходим на стр ингредиентов
    cy.visit('/');
    //  дождемся пока все необх мок данные загрузится
    cy.wait(['@getUser', '@getIngredients']);
  });
  afterEach(() => {
    // очитска данных авторизации
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
  });
  it('Добавление ингредиента из списка ингредиентов в конструктор', () => {
    // добавим булку
    cy.get('[data-cy=ingredient]')
      .filter('[data-type=bun]')
      .eq(1) // мы знаем что булеи в начале
      .scrollIntoView() // прокрутка чтобы элемент сталвидимым
      .within(() => {
        // ограничисся работойс ним
        cy.get('button').should('be.visible').click();
      });
    // добавляем ингредиет отличный от булки:
    cy.get('[data-cy=ingredient]')
      .not('[data-type=bun]')
      .eq(0) // возьмем второй элмент из коллекции найденных ингредиентов
      .scrollIntoView() // прокрутка чтобы элемент сталвидимым
      .within(() => {
        // ограничисся работойс ним
        // ищем внутри карточки ингредиента кнопку и когда она станет видима жмем ее
        cy.get('button').should('be.visible').click();
      });
    //  кликаем на ингредиент
    // ожидаем что в корзине  появился ингредиент отличный от булки
    cy.get('[data-cy=cart-ingredients] li').should('have.length', 1);
    //  ожидаем получение булки в корзине
    cy.get('[data-cy=cart-buns]').should('have.length', 1);
  });
  it('Открытие и закрытие модального окна с описанием ингредиента.', () => {
    // находим к-л ингредиент и кликаем по нему
    cy.get('[data-cy=ingredient]')
      .eq(0)
      .scrollIntoView()
      .should('be.visible')
      .click();
    //  проверяем что заголовок с текстом заголовка мо появился на стр
    cy.contains('Ингредиент подробно').should('be.visible');
    // появление на стр
    //  получаем кнопку закрытия и если она есть кликаем ее
    cy.get('[data-cy=btn-m-close]').should('be.visible').click();
    // проверяем закрылось ли мо окно  - те существует ли оно
    cy.get('[data-cy=modalUI]').should('not.be.exist');
  });
  it('Отображение в открытом модальном окне данных именно того ингредиента, по которому произошел клик.', () => {
    //  найдем элемент и кликнем по нему
    cy.get('[data-cy=ingredient]')
      .eq(6)
      .scrollIntoView()
      .should('be.visible')
      .click()
      .invoke('attr', 'data-id')
      .then((id) => {
        //  сравним id который в url при open modal и что нам передалось от клик элемента
        //   те атрибут data-id=_id
        cy.url().should('include', id);
        cy.log('data-id элемента: ' + id); //  тестовый runner
        console.log('data-id элемента: ', id); // DevTools
      });
  });
  describe('процесс создания заказа', () => {
    const testNumberOrder = 777;
    beforeEach(() => {
      cy.intercept('POST', '**/orders', (req) => {
        const ingredients = req.body.ingredients;
        req.reply({
          success: true,
          order: {
            number: testNumberOrder,
            ingredients: ingredients
          }
        })
      }).as('createOrder');
      const fakeRefrToken =
        '1359788d0a02dg3d8e7edf7eb35b59373028c97923db8eddd65raae617f8b2deb01676918b54ed5c';
      const fakeAccessToken =
        'Bearer%20eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ7.eyJpZCI8IjY5MWIwMDNmYTY0MTc3MDAxYjMxZjBhNiIsImlhdCI6MTc2NDYxMzY1OCwiZXhwIjoxNzY0NjE0ODU4mV.Yim07OhJdDNnrZT3x84gNne6V598Y0YZ82gdFMxCKCs';
      localStorage.setItem('refreshToken', fakeRefrToken);
      setCookie('accessToken', fakeAccessToken);
    });
    it('создаем заказ..', () => {
      cy.visit('/');
      //  начнем добавлять ингредиенты включая булку
      const numbersIngredients = [0, 3, 4, 7, 8];
      numbersIngredients.forEach((number) => {
        cy.get('[data-cy=ingredient]')
          .eq(number) // начнем добавлять
          .scrollIntoView() // прокрутка чтобы элемент сталвидимым
          .within(() => {
            // ограничисся работойс ним
            cy.get('button').should('be.visible').click();
          });
      });
      // находим кнопку и  кликаем создать заказ
      //   проверить что кнопка доступна ????
      cy.get('[data-cy=createOrder]').should('be.visible').click();
      //  ждем ответа  и начинаем с ним работать
      cy.wait('@createOrder').then(({ request, response }) => {
        cy.log(request.body);
        cy.log(response?.body);
        //  количество ингредиентов совпадало ответ - запрос
        //  номер заказа в модалке с тем заказом который пришел в ответе
      });
    });
  });
});
