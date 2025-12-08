import { expect, test, describe } from '@jest/globals';
import commonOrdersSliceReducer, {
  getFeedOrdersThunk,
  getUserOrdersThunk,
  CommonOrdersState,
  TFeedState,
  TUserOrdersState
} from '../services/slices/orders/commonOrdersSlice';
import { TIngredient, TOrder } from '@utils-types';
import { createDeepCopyObj } from '../utils/utils';
import { testIngredients } from '../utils/testsData/testApi';
import { TestOrders } from '../utils/testsData/testOrders';

describe('обработка экшенов(при выполнении асинхр запроса) редюсером хранения заказов ленты и истории пользователя ', () => {
  // обозначим начальное состояние 'заказа'
  let initialState: CommonOrdersState;
  beforeEach(() => {
    // при каждом тесте инициализируем начальное состояние
    initialState = {
      feedOrders: {
        loading: false,
        error: null,
        ordersFeed: [],
        total: 0,
        totalToday: 0,
        initialLoadCompleted: false
      },
      userOrders: {
        loading: false,
        error: null,
        ordersHistory: [],
        initialLoadOrdersCompleted: false
      }
    };
  });
  describe('получение заказов истории пользователя', () => {
    test('история: загрузка', () => {
      const expectedStateHistory = {
        loading: true,
        error: null,
        ordersHistory: [],
        initialLoadOrdersCompleted: false
      };
      const actualState = commonOrdersSliceReducer(
        {
          ...initialState
        },
        getUserOrdersThunk.pending('')
      );
      expect(actualState.userOrders).toEqual(expectedStateHistory);
    });
    test('история: исполнено', () => {
      const expectedStateHistory = {
        loading: false,
        error: null,
        ordersHistory: [...TestOrders],
        initialLoadOrdersCompleted: true
      };
      const actualState = commonOrdersSliceReducer(
        {
          ...initialState,
          userOrders: {
            ...initialState.userOrders,
            loading: true // как будто бы загрузка заказов пользователя начата..
          }
        },
        getUserOrdersThunk.fulfilled(TestOrders, '')
      );
      expect(actualState.userOrders).toEqual(expectedStateHistory);
    });
    test('история: отклонено', () => {
      const error = new Error('Service Unavailable');
      const expectedStateHistory = {
        loading: false,
        error: error.message,
        ordersHistory: [],
        initialLoadOrdersCompleted: false
      };
      const actualState = commonOrdersSliceReducer(
        {
          ...initialState,
          userOrders: {
            ...initialState.userOrders,
            loading: true // как будто бы загрузка заказов пользователя начата..
          }
        },
        getUserOrdersThunk.rejected(error, '')
      );
      expect(actualState.userOrders).toEqual(expectedStateHistory);
    });
  });

  describe('получение заказов ленты всех пользователей', () => {
    test('лента: загрузка', () => {
      const expectedStateFeed = {
        loading: true,
        error: null,
        ordersFeed: [],
        total: 0,
        totalToday: 0,
        initialLoadCompleted: false
      };
      const actualState = commonOrdersSliceReducer(
        {
          ...initialState
        },
        getFeedOrdersThunk.pending('')
      );
      expect(actualState.feedOrders).toEqual(expectedStateFeed);
    });
    test('лента: исполнено', () => {
      const expectedStateFeed = {
        loading: false,
        error: null,
        ordersFeed: [...TestOrders],
        total: 25555,
        totalToday: 123,
        initialLoadCompleted: true
      };
      //  для промиса fulfilled
      const fullfilledResponse = {
        success: true,
        orders: createDeepCopyObj([...TestOrders]),
        total: 25555,
        totalToday: 123
      };
      const actualState = commonOrdersSliceReducer(
        {
          ...initialState,
          feedOrders: {
            ...initialState.feedOrders,
            loading: true // как будто бы загрузка заказов ленты начата..
          }
        },
        getFeedOrdersThunk.fulfilled(fullfilledResponse, '')
      );
      console.log(actualState.feedOrders);
      expect(actualState.feedOrders).toEqual(expectedStateFeed);
    });
    test('лента: отклонено', () => {
      const error = new Error('Service Unavailable');
      const expectedStateFeed = {
        loading: false,
        error: error.message,
        ordersFeed: [],
        total: 0,
        totalToday: 0,
        initialLoadCompleted: false
      };
      const actualState = commonOrdersSliceReducer(
        {
          ...initialState,
          feedOrders: {
            ...initialState.feedOrders,
            loading: true // как будто бы загрузка заказов ленты начата..
          }
        },
        getFeedOrdersThunk.rejected(error, '')
      );
      expect(actualState.feedOrders).toEqual(expectedStateFeed);
    });
  });
});
