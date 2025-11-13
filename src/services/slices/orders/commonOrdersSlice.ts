import { getFeedsApi, TFeedsResponse, TOrdersResponse } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TFullOrder, TOrder, TReadyOrder } from '@utils-types';
import { ApiClients } from 'src/services/extraArg';
import { getIngredients } from '../ingredients/ingredientSlice';

type updateOrders = {
  orders: TReadyOrder[];
  typeOrders: 'feed' | 'history';
};

type TMainOptions = {
  loading: boolean;
  error: string | null;
};
//  лента всех заказов
type TFeedState = TMainOptions & {
  ordersFeed: TOrder[] | TReadyOrder[];
  total: number;
  totalToday: number;
};
//  история заказов авториз пользователя
type TUserOrdersState = TMainOptions & {
  ordersHistory: TOrder[] | TReadyOrder[];
};

type CommonOrdersState = {
  feedOrders: TFeedState;
  userOrders: TUserOrdersState;
  selectOrder: TReadyOrder | null;
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

//  выбираем , что будем загружать либо ленте заказов либо историю заказов пользователя
export const getFeedOrdersThunk = createAsyncThunk<
  TFeedsResponse,
  void,
  { extra: ApiClients }
>('orders/FeedOrders', async (_, thunkApi) => {
  try {
    const data = await thunkApi.extra.getFeedsApi();
    return data;
  } catch (err) {
    return thunkApi.rejectWithValue(`Не загрузились лента заказов: ${err}`);
  }
});

export const getUserOrdersThunk = createAsyncThunk<
  TOrdersResponse,
  void,
  { extra: ApiClients }
>('orders/getUserOrders', async (_, thunkApi) => {
  try {
    return await thunkApi.extra.getOrdersApi();
  } catch (err) {
    return thunkApi.rejectWithValue(`Не загрузились история заказов: ${err}`);
  }
});

const feedOrdersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    //  для модалки
    setSelectOrder(state, action: PayloadAction<TReadyOrder>) {
      state.selectOrder = action.payload;
    },
    // синхронное обновление полей заказов - форматируем заказы как нам надо
    setOrders(state, action: PayloadAction<updateOrders>) {
      action.type === 'feed'
        ? (state.feedOrders.ordersFeed = action.payload.orders)
        : (state.userOrders.ordersHistory = action.payload.orders);
    }
  },
  extraReducers(builder) {
    builder
      .addCase(getFeedOrdersThunk.pending, (state) => {
        state.feedOrders.loading = true;
        state.feedOrders.error = null;
      })
      .addCase(getFeedOrdersThunk.rejected, (state, action) => {
        state.feedOrders.loading = false;
        state.feedOrders.error =
          (action.payload as string) || action.error.message || 'Error';
      })
      .addCase(getFeedOrdersThunk.fulfilled, (state, action) => {
        state.feedOrders.loading = false;
        state.feedOrders.ordersFeed = action.payload.orders;
        state.feedOrders.total = action.payload.total;
        state.feedOrders.totalToday = action.payload.totalToday;
      })
      .addCase(getUserOrdersThunk.pending, (state) => {
        state.userOrders.loading = true;
        state.userOrders.error = null;
      })
      .addCase(getUserOrdersThunk.rejected, (state, action) => {
        state.userOrders.loading = false;
        state.userOrders.error =
          (action.payload as string) || action.error.message || 'Error';
      })
      .addCase(getUserOrdersThunk.fulfilled, (state, action) => {
        state.userOrders.loading = false;
        state.userOrders.ordersHistory = action.payload.data;
      });
  }
});
export const { setSelectOrder, setOrders } = feedOrdersSlice.actions;
export default feedOrdersSlice.reducer;
