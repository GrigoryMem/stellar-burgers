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

//  выбираем , что будем загружать либо ленте заказов либо историю заказов пользователя
export const getFeedOrdersThunk = createAsyncThunk<
  TFeedsResponse,
  void,
  { extra: ApiClients }
>('orders/FeedOrders', async (_, thunkApi) => {
  try {
    return await thunkApi.extra.getFeedsApi();
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
    setSelectOrder(state, action: PayloadAction<TOrder | null>) {
      state.selectOrder = action.payload;
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
export const { setSelectOrder } = feedOrdersSlice.actions;
export default feedOrdersSlice.reducer;
