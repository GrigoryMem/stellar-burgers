import { expect, test, describe } from '@jest/globals';
import ingredientSLiceReducer, {
  getIngredients,
  TIngredientsState
} from '../services/slices/ingredients/ingredientSlice';
import { TIngredient } from '@utils-types';
import { createDeepCopyObj } from '../utils/utils';
import { testIngredients } from '../utils/testsData/testApi';

describe('обработка экшена(при выполнении асинхр запроса) получения ингредиентов ', () => {
  // обозначим начальное состояние ингр-в
  let initialState: TIngredientsState;
  beforeEach(() => {
    // при каждом тесте инициализируем начальное состояние
    initialState = {
      ingredients: [],
      loading: false,
      error: null,
      selectedIngredient: null // по ум модальное окно закрыто
    };
  });
  test('начало запроса получ ингр', () => {
    // ожидаемое состояние загрузки
    const ingredLoadingState = {
      ingredients: [],
      loading: true,
      error: null,
      selectedIngredient: null
    };
    // создаем состояние когда асинхро экшен panding
    const actualState = ingredientSLiceReducer(
      {
        ...initialState,
        error: 'Error: Test Error'
      },
      getIngredients.pending('')
    );
    //   сравниваем получ стейт  асинх экшена panding с тем, что д б при загрузке
    expect(actualState).toEqual(ingredLoadingState);
  });
  test('успешного вып запроса получ ингр', () => {
    // ожидаемые ингредиенты  при успешном запросе
    const expectedPositiveResult: TIngredient[] = createDeepCopyObj([
      ...testIngredients
    ]);
    //  ожидаемое успешное состояние
    const ingredWithSuccessState = {
      ingredients: [...expectedPositiveResult],
      loading: false,
      error: null,
      selectedIngredient: null
    };
    // диспатчим асинх экшен статус fullfilled
    const actualState = ingredientSLiceReducer(
      {
        ...initialState,
        loading: true
      },
      getIngredients.fulfilled(createDeepCopyObj([...testIngredients]), '')
    );
    //   сравниваем с тем, что д б при успешном разрешении промиса - состояние с массивом ингредиентов
    expect(actualState).toEqual(ingredWithSuccessState);
  });

  test('ошибки запроса получ ингр', () => {
    // имитируем ошибку.
    const error = new Error('Service Unavailable');
    //  ожидаемые рез-ты при ошибке
    const ingredErrorState = {
      ingredients: [],
      loading: false,
      error: `${error.message}`,
      selectedIngredient: null
    };
    // актуально состояние с асинхр экшеном rejected
    const actualState = ingredientSLiceReducer(
      {
        ...initialState
      },
      getIngredients.rejected(error, '')
    );
    //  сравнение
    expect(actualState).toEqual(ingredErrorState);
  });
});
