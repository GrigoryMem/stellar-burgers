import { expect, test, describe, jest } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import ingredientSLiceReducer, {
  getIngredients
} from '../services/slices/ingredients/ingredientSlice';
import { TIngredient } from '@utils-types';
import { createDeepCopyObj } from '../utils/utils';
import { testIngredients } from '../utils/testApi';
import { TIngredientsResponse } from '@api';

const setUpTestStore = () => {
  const store = configureStore({
    reducer: {
      ingredients: ingredientSLiceReducer
    }
  });
  return store;
};
//  типизация тестового состояния
type TestStore = ReturnType<typeof setUpTestStore>;

describe('тесты обработки асинхронного экшена получения ингредиентов ', () => {
  //  если ошибка или загрузка  - массив должен быть пустым
  const expectedEmptyResult: TIngredient[] = [];
  // ожидаемые результаты при загрузке
  const ingredLoadingState = {
    ingredients: [],
    loading: true,
    error: null,
    selectedIngredient: null
  };
  // ожидаемые результаты при успешном запросе
  const expectedPositiveResult: TIngredient[] = createDeepCopyObj([
    ...testIngredients
  ]);
  const ingredWithSuccessState = {
    ingredients: [...expectedPositiveResult],
    loading: false,
    error: null,
    selectedIngredient: null
  };
  //  ожидаемые рез-ты при ошибке
  const ingredErrorState = {
    ingredients: expectedEmptyResult,
    loading: false,
    error: 'Error: Service Unavailable',
    selectedIngredient: null
  };
  // инициализируем тестовый стор
  let store: TestStore;
  beforeEach(() => {
    // перед каждым тестом создаем стор заново
    store = setUpTestStore();
  });
  test('начало запроса получ ингр', () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            success: true,
            data: expectedPositiveResult
          })
      })
    ) as unknown as typeof fetch;
    // выполнение промиса ожидать не нужно
    store.dispatch(getIngredients());
    expect(store.getState().ingredients).toEqual(ingredLoadingState);
  });
  test('успешного вып запроса получ ингр', async () => {
    // здеьс надо именно выполнить промис тханка с полож рез
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            success: true,
            data: expectedPositiveResult
          })
      })
    ) as unknown as typeof fetch;
    //  и посмотреть что как кусок стора отреогирует
    await store.dispatch(getIngredients());
    expect(store.getState().ingredients).toEqual(ingredWithSuccessState);
  });
  test('ошибки запроса получ ингр', async () => {
    // ошибка на уровне приложения
    global.fetch = jest.fn(() =>
      Promise.reject('Service Unavailable')
    ) as unknown as typeof fetch;
    await store.dispatch(getIngredients());
    expect(store.getState().ingredients).toEqual(ingredErrorState);
  });
});
