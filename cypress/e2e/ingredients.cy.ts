import { setCookie } from 'src/utils/cookie';
import ingredients from '../fixtures/test-ingredients.json';
import {
  filteredElementsByIndexes,
  getPriceOrderByArrIngrs
} from '../../src/utils/utils';
import { should } from 'chai';
describe('ингредиенты', () => {
  beforeEach(() => {
    //  делаем перехват запросов
    // "получили" юзера
    cy.intercept(
      {
        method: 'GET',
        url: '**/auth/user'
      },
      {
        fixture: 'test-user-data'
      }
    ).as('getUser');
    // "получили" ингредиенты
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
    //  дождемся пока все необх мок данные загрузится cy.wait прежде чем искать эелменты DOM
  });
  afterEach(() => {
    // очитска данных авторизации(кастомная команда)
    cy.clearDataAuthoriz();
  });
  it('Добавление ингредиента из списка ингредиентов в конструктор', () => {
    cy.wait(['@getUser', '@getIngredients']).then(() => {
      // добавим булку (кастом команда)
      cy.addIngredient(1, 'bun');
      cy.addIngredient(2, 'main');
      // добавляем ингредиет отличный от булки:
      //  кликаем на ингредиент
      // ожидаем что в корзине  появился ингредиент отличный от булки
      cy.get('[data-cy=cart-ingredients] li').should('have.length', 1);
      //  ожидаем получение булки в корзине
      cy.get('[data-cy=cart-buns]').should('have.length', 1);
    });
  });
  it('удаление ингредиента из коструктора', () => {
    cy.wait(['@getUser', '@getIngredients']).then(() => {
      //  добавляем ингредиент
      cy.addIngredient(2, 'main');
      // проверим что он появился в корзине
      cy.get('[data-cy=cart-ingredients] li').should('have.length', 1);
      //  счетчик ингредиента должен увеличиться на единицу добавления
      cy.get('.counter__num').should('have.text', '1');
      // найдем кнопку удаления и кликнем
      cy.get('.constructor-element__action.pr-2').should('be.visible').click();
      // теперь корзина дб пуста
      cy.get('[data-cy=cart-ingredients] li').should('have.length', 0);
      //  проверим что счетчик ингредиента с добавлением 1 пропал со стр
      cy.get('.counter__num').should('not.exist');
    });
  });
  it('Открытие и закрытие модального окна с описанием ингредиента.', () => {
    cy.wait(['@getUser', '@getIngredients']).then(() => {
      // находим к-л ингредиент и кликаем по нему (кастомная команда)
      cy.findIngredientAndClick(0);
      //  проверяем что заголовок с текстом заголовка мо появился на стр
      cy.contains('Ингредиент подробно').should('be.visible');
      // появление на стр
      //  получаем кнопку закрытия и если она есть кликаем ее
      cy.get('[data-cy=btn-m-close]').should('be.visible').click();
      // проверяем закрылось ли мо окно  - те существует ли оно
      cy.get('[data-cy=modalUI]').should('not.exist');
    });
  });
  it('Отображение в открытом модальном окне данных именно того ингредиента, по которому произошел клик.', () => {
    cy.wait(['@getUser', '@getIngredients']).then(() => {
      //  найдем элемент и кликнем по нему (кастомная команда)
      cy.findIngredientAndClick(6)
        .invoke('attr', 'data-id')
        .then((id) => {
          //  сравним id который в url при open modal и что нам передалось от клик элемента
          //   те атрибут data-id=_id
          cy.url().should('include', id);
          cy.log('data-id элемента: ' + id); //  тестовый runner
          console.log('data-id элемента: ', id); // DevTools
        });
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
            ingredients: ingredients,
            price: 2800
          }
        });
      }).as('createOrder');
      cy.setTestTokens();
    });
    it('создаем заказ..', () => {
      cy.visit('/');
      //  начнем добавлять ингредиенты включая только один тип булки
      const numbersIngredients = [0, 3, 4, 6, 8];
      cy.wait(['@getUser', '@getIngredients']).then(() => {
        numbersIngredients.forEach((number) => {
          // находим id ингредиента по нумерации из fixture json
          const ingredId = ingredients.data[number]._id;
          // кликаем точно по ингредиенту с нужным id
          cy.get(`[data-id=${ingredId}]`)
            .scrollIntoView() // прокрутка чтобы элемент сталвидимым
            .within(() => {
              // ограничисся работойс ним
              cy.get('button').should('be.visible').click();
            });
        });
        //  после добаления всех игредиентов в корзину бургера, проверим что на экране появилась корректная сумма всего заказа
        //  рассчитаем сумму заказа по нумерации json
        const sumOrder = getPriceOrderByArrIngrs(
          filteredElementsByIndexes(numbersIngredients, ingredients.data)
        );
        //  сравним нумерацию добавленных json fixture и то, что видим на экране - динамическое сравнение с тем что добавили в тесте
        cy.contains(sumOrder);
        // САБМИТ заказа
        // находим кнопку и  кликаем создать заказ
        //   проверить что кнопка доступна ????
        cy.get('[data-cy=createOrder]').should('be.visible').click();
      });
      //  ждем ответа  и начинаем с ним работать
      cy.wait('@createOrder').then(({ request, response }) => {
        // проверим что при клике на кнопку оформления заказ redux очистил корзину
        cy.get('[data-cy=cart-ingredients] li').should('have.length', 0);
        //  в запросе верно отразилось количество всех добавленных товаров
        expect(request.body.ingredients.length).to.equal(
          // учтем, то что булка это 2 товара в запросе
          numbersIngredients.length + 1
        );
        // проверим тело запроса на содержание id
        // request.body.should('deep.equal', {

        // })
        // тело запроса содержит добавлееные в заказ ингредиенты?
        expect(request.body).to.deep.equal({
          ingredients: [
            '643d69a5c3f7b9001cfa093c',
            '643d69a5c3f7b9001cfa093c',
            '643d69a5c3f7b9001cfa0942',
            '643d69a5c3f7b9001cfa0943',
            '643d69a5c3f7b9001cfa0940',
            '643d69a5c3f7b9001cfa0944'
          ]
        });
        cy.log(request.body);
        cy.log(response?.body);
        //  модалка появилась?
        cy.get('[data-cy=modalUI]').should('be.visible');
        //  номер заказа тестового ответа отобразился на экране?
        cy.contains(`${testNumberOrder}`);
      });
    });
  });
  describe('закрытие модальных окон', () => {
    beforeEach(() => {
      //  можно сделать команды
      cy.intercept('GET', '**/orders/all', {
        fixture: 'test-orders.json'
      }).as('feedOrders');
      cy.intercept('GET', '**/api/orders', {
        fixture: 'test-orders.json'
      }).as('userOrders');
    });
    it('закрытие МО ингредиента по Escp', () => {
      cy.visit('/');
      cy.wait(['@getUser', '@getIngredients']).then(() => {
        //  когда все загружено берем и кликаем  по карточке игр-та
        cy.findIngredientAndClick(0);
        //  проверяем что мо ингр-та появилось и выполняем процедуру закрыти по esc
        //  c проверкой
        cy.closeModalByEscape();
      });
    });
    it('закрытие МО ленты заказов по Escp', () => {
      cy.visit('/feed');
      cy.wait(['@getUser', '@getIngredients', '@feedOrders']).then(() => {
        // находим какой то заказ и отк его
        //  найдем заказ и кликнем по нему
        cy.getCardOrderAndClickHim(0);
        //  проверяем что мо ингр-та появилось и выполняем процедуру закрыти по esc
        //  c проверкой
        cy.closeModalByEscape();
      });
    });
    it('закрытие МО истории заказов по Escp', () => {
      cy.visit('/profile/orders');
      cy.wait(['@getUser', '@getIngredients', '@userOrders']).then(() => {
        //  найдем заказ и кликнем по нему
        cy.getCardOrderAndClickHim(0);
        //  проверяем что мо ингр-та появилось и выполняем процедуру закрыти по esc
        //  c проверкой
        cy.closeModalByEscape();
      });
    });
    it('закрытие МО ингредиента по клику на overlay МО', () => {
      cy.visit('/');
      cy.wait(['@getUser', '@getIngredients']).then(() => {
        // найдем к-л ингредиент и кликнем по нему
        cy.findIngredientAndClick(0);
        //  модалка повилась?:
        // кликнем на оверлей и проверим что модалка закрылась
        cy.closeModalByClickOverlay();
      });
    });
    it('закрытие МО заказа стр  истории заказов  по клику на overlay МО', () => {
      cy.visit('/profile/orders');
      cy.wait(['@getUser', '@getIngredients', '@userOrders']).then(() => {
        //  найдем заказ и кликнем по нему
        cy.getCardOrderAndClickHim(0);
        //  модалка повилась?:
        // кликнем на оверлей и проверим что модалка закрылась
        cy.closeModalByClickOverlay();
      });
    });
    it('закрытие МО ингредиента по клику на overlay МО', () => {
      cy.visit('/feed');
      cy.wait(['@getUser', '@getIngredients', '@feedOrders']).then(() => {
        //  найдем заказ и кликнем по нему
        cy.getCardOrderAndClickHim(0);
        //  модалка повилась?:
        // кликнем на оверлей и проверим что модалка закрылась
        cy.closeModalByClickOverlay();
      });
    });
  });
});
