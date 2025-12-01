import store from '../../src/services/store';

describe('ингредиенты', () => {
  beforeEach(() => {
    //  очищать корзину через стор redux перед каждым тестом
    store.dispatch({
      type: 'burgerConstructor/clearConstructor'
    });
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
  });
  afterEach(() => {
    // очитска данных авторизации
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
  });
  it('Добавление ингредиента из списка ингредиентов в конструктор', () => {
    //  переходим в домашнюю директорию
    cy.visit('/');
    // ждем пока все выполнится -ждёт, пока запросы завершатся
    // чтобы не было преждевременных появления компонентов которых нет
    cy.wait(['@getUser', '@getIngredients']);
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
  it('Открытие  модального окна с описанием ингредиента.', () => {
    //  заходим на стр ингредиентов
    cy.visit('/');
    //  дождемся пока все необх мок данные загрузится
    cy.wait(['@getUser', '@getIngredients']);
    // находим к-л ингредиент
    cy.get('[data-cy=ingredient]')
      .eq(0)
      .scrollIntoView()
      .should('be.visible')
      .click();
    //  проверяем что элемент с текстом заголовка мо появился на стр
    cy.contains('Ингредиент подробно').should('be.visible');
  });

  // проверим открытие мо
  // it('Закрытие  модального окна с описанием ингредиента.', () =>{

  // });
});
