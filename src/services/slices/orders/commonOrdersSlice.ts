import { getFeedsApi, TFeedsResponse, TOrdersResponse } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { ApiClients } from 'src/services/extraArg';

type TMainOptions = {
  loading: boolean;
  error: string | null;
};
//  лента всех заказов
type TFeedState = TMainOptions & {
  ordersFeed: TOrder[];
  total: number;
  totalToday: number;
};
//  история заказов авториз пользователя
type TUserOrdersState = TMainOptions & {
  ordersHistory: TOrder[];
};

type CommonOrdersState = {
  feedOrders: TFeedState;
  userOrders: TUserOrdersState;
  selectOrder: TOrder | null;
};

const initialState: CommonOrdersState = {
  feedOrders: {
    loading: false,
    error: null,
    ordersFeed: [],
    total: 0,
    totalToday: 0
  },
  userOrders: {
    loading: false,
    error: null,
    ordersHistory: []
  },
  selectOrder: null
};
// получаем ленту заказов
export const getAnyOrders = (actionName: string) => {
  const acynsActionFunc = createAsyncThunk<
    TFeedsResponse | TOrdersResponse,
    void,
    { extra: ApiClients }
  >(actionName, async (_, thunkApi) => {
    let textError;
    try {
      let data: TFeedsResponse | TOrdersResponse;
      const { getFeedsApi, getOrdersApi } = thunkApi.extra;
      if (actionName === 'orders/getUserOrders') {
        data = await getOrdersApi();
        textError = 'не загрузились история заказов пользователя';
      }
      if (actionName === 'orders/FeedOrders') {
        data = await getFeedsApi();
        textError = 'не загрузились общая лента заказов';
      } else {
        // если имя не совпадает ни с одним вариантом
        return thunkApi.rejectWithValue(`
          Неизвестный actionName: ${actionName}`);
      }
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(`Error:${textError} ${error}`);
    }
  });
  return acynsActionFunc;
};

// export const getFeedOrders = createAsyncThunk(
//   'feedOrders/getFeedOrders',
//   async (_, thunkApi) => {
//     try {
//       const data = await getFeedsApi();
//       return data;
//     } catch (error) {
//       // чтобы иметь чёткий текст ошибки для UI.
//       // rejectWithValue позволяет передать свой payload для ошибки,
//       // который потом будет доступен в редьюсере через action.payload.
//       return thunkApi.rejectWithValue(`Error: ${error}`);
//     }
//   }
// );

const feedOrdersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    
  }
});

export default feedOrdersSlice.reducer;
