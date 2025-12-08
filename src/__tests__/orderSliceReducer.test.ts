import { expect, test, describe } from '@jest/globals';
import orderSliceReducer, {
  getOrderByNumber,
  TOrderState
} from '../services/slices/orders/orderSlice';
import { createOrder } from '../services/slices/constructorBurger/createOrder';
import { TIngredient, TOrder } from '@utils-types';
import { createDeepCopyObj } from '../utils/utils';
import { testIngredients } from '../utils/testsData/testApi';

describe('обработка экшенов(при выполнении асинхр запроса) редюсером Слайса заказа ', () => {
  // обозначим начальное состояние 'заказа'
  let initialState: TOrderState;
  beforeEach(() => {
    // при каждом тесте инициализируем начальное состояние
    initialState = {
      currentCreatedOrder: null,
      loading: false,
      error: null,
      foundOrder: null
    };
  });
  describe('создание заказа', () => {
    test('создаем заказ: загрузка', () => {
      const expectedState = {
        currentCreatedOrder: null,
        loading: true,
        error: null,
        foundOrder: null
      };
      const actualState = orderSliceReducer(
        {
          ...initialState
        },
        createOrder.pending('')
      );
      expect(actualState).toEqual(expectedState);
    });
    test('создаем заказ: исполнено', () => {
      const testNewOrder = {
        success: true,
        name: 'Метеоритный флюоресцентный люминесцентный бургер',
        order: {
          number: 777
        }
      };
      const expectedState = {
        currentCreatedOrder: testNewOrder,
        loading: false,
        error: null,
        foundOrder: null
      };
      const actualState = orderSliceReducer(
        {
          ...initialState,
          loading: true
        },
        createOrder.fulfilled(testNewOrder, '')
      );
      expect(actualState).toEqual(expectedState);
    });
    test('создаем заказ: отклонено', () => {
      const error = new Error('Service Unavailable');
      const expectedState = {
        currentCreatedOrder: null,
        loading: false,
        error: error.message,
        foundOrder: null
      };
      const actualState = orderSliceReducer(
        {
          ...initialState,
          loading: true
        },
        createOrder.rejected(error, '')
      );
      expect(actualState).toEqual(expectedState);
    });
  });

  describe('получение данных з-за по его номеру', () => {
    test('получаем заказ: загрузка', () => {
      const expectedState = {
        currentCreatedOrder: null,
        loading: true,
        error: null,
        foundOrder: null
      };
      const actualState = orderSliceReducer(
        {
          ...initialState
        },
        // подставляем номер заказа
        getOrderByNumber.pending('', 777)
      );
      expect(actualState).toEqual(expectedState);
    });
    test('получаем заказ: исполнено', () => {
      const testFoundedOrder: TOrder = {
        _id: '673a9f1c45e812345678abcd',
        status: 'done',
        name: 'Метеор-бургер',
        createdAt: '2025-12-04T10:15:30.000Z',
        updatedAt: '2025-12-04T10:20:10.000Z',
        number: 12345,
        ingredients: [
          '60d3b41abdacab0026a733c6', // булка
          '60d3b41abdacab0026a733cd', // соус
          '60d3b41abdacab0026a733ce', // котлета
          '60d3b41abdacab0026a733c6' // булка (верх)
        ],
        price: 450
      };

      const expectedState = {
        currentCreatedOrder: null,
        loading: false,
        error: null,
        foundOrder: testFoundedOrder
      };
      const actualState = orderSliceReducer(
        {
          ...initialState,
          loading: true
        },
        getOrderByNumber.fulfilled(testFoundedOrder, '', 777)
      );
      expect(actualState).toEqual(expectedState);
    });
    test('получаем заказ: отклонено', () => {
      const error = new Error('Service Unavailable');
      const expectedState = {
        currentCreatedOrder: null,
        loading: false,
        error: error.message,
        foundOrder: null
      };
      const actualState = orderSliceReducer(
        {
          ...initialState,
          loading: true
        },
        getOrderByNumber.rejected(error, '', 777)
      );
      expect(actualState).toEqual(expectedState);
    });
  });
});
