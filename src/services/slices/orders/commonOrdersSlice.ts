import { TFeedsResponse } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TErrorResp, TOrder } from '@utils-types';
import { ApiClients } from '../../../services/extraArg';
import { RootState } from '../../store';

type updateOrders = {
  orders: TOrder[];
  typeOrders: 'feed' | 'history';
};

type TMainOptions = {
  loading: boolean;
  error: string | null;
};
//  лента всех заказов
export type TFeedState = TMainOptions & {
  ordersFeed: TOrder[];
  total: number;
  totalToday: number;
  initialLoadCompleted: boolean;
};
//  история заказов авториз пользователя
export type TUserOrdersState = TMainOptions & {
  ordersHistory: TOrder[];
  initialLoadOrdersCompleted: boolean;
};

export type CommonOrdersState = {
  feedOrders: TFeedState;
  userOrders: TUserOrdersState;
};

const initialState: CommonOrdersState = {
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

//  выбираем , что будем загружать либо ленте заказов либо историю заказов пользователя
export const getFeedOrdersThunk = createAsyncThunk<
  TFeedsResponse,
  void,
  { extra: ApiClients }
>('orders/FeedOrders', async (_, thunkApi) => {
  try {
    const data = await thunkApi.extra.getFeedsApi();
    return data;
  } catch (error: TErrorResp | unknown) {
    const textError = (error as TErrorResp).message;
    return thunkApi.rejectWithValue(
      `Не загрузилась лентк заказов всех пользователей: ${textError}` ||
        'Неизвестная ошибка'
    );
  }
});

export const getUserOrdersThunk = createAsyncThunk<
  TOrder[],
  void,
  { extra: ApiClients }
>('orders/getUserOrders', async (_, thunkApi) => {
  try {
    const data = await thunkApi.extra.getOrdersApi();
    return data;
  } catch (error: TErrorResp | unknown) {
    const textError = (error as TErrorResp).message;
    return thunkApi.rejectWithValue(
      `Не загрузились заказы пользователя: ${textError}` || 'Неизвестная ошибка'
    );
  }
});

const commonOrdersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // синхронное обновление полей заказов - форматируем заказы как нам надо
    setOrders(state, action: PayloadAction<updateOrders>) {
      if (action.payload.typeOrders === 'feed') {
        state.feedOrders.ordersFeed = action.payload.orders;
      } else {
        state.userOrders.ordersHistory = action.payload.orders;
      }
    }
  },
  extraReducers(builder) {
    builder
      // лента
      .addCase(getFeedOrdersThunk.pending, (state) => {
        state.feedOrders.loading = true;
        state.feedOrders.error = null;
      })
      .addCase(getFeedOrdersThunk.rejected, (state, action) => {
        state.feedOrders.loading = false;
        state.feedOrders.error =
          (action.payload as string) || action.error.message || 'Error';
      })
      .addCase(
        getFeedOrdersThunk.fulfilled,
        (
          state,
          action: PayloadAction<{
            orders: TOrder[];
            total: number;
            totalToday: number;
          }>
        ) => {
          state.feedOrders.loading = false;
          state.feedOrders.ordersFeed = action.payload.orders;
          state.feedOrders.total = action.payload.total;
          state.feedOrders.totalToday = action.payload.totalToday;
          state.feedOrders.initialLoadCompleted = true; // уведомляем о первой загрузке ленты
          // (нужно чтобы прелоадер не загружался каждый раз при отправке запроса)
        }
      )
      // история пользователя
      .addCase(getUserOrdersThunk.pending, (state) => {
        state.userOrders.loading = true;
        state.userOrders.error = null;
      })
      .addCase(getUserOrdersThunk.rejected, (state, action) => {
        state.userOrders.loading = false;
        state.userOrders.error =
          (action.payload as string) || action.error.message || 'Error';
      })
      .addCase(
        getUserOrdersThunk.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.userOrders.loading = false;
          state.userOrders.ordersHistory = action.payload;
          // первая загрузка отмечаем
          state.userOrders.initialLoadOrdersCompleted = true;
        }
      );
  }
});
export const { setOrders } = commonOrdersSlice.actions;
export const feedOrdersSelector = (state: RootState) =>
  state.allOrders.feedOrders.ordersFeed;
export const userOrdersSelector = (state: RootState) =>
  state.allOrders.userOrders.ordersHistory;
export const isLoadingSelector = (state: RootState) =>
  state.allOrders.feedOrders.loading;
export default commonOrdersSlice.reducer;
export const initialLoadCompletedSelector = (state: RootState) =>
  state.allOrders.feedOrders.initialLoadCompleted;
export const isFirstUserOrders = (state: RootState) =>
  state.allOrders.userOrders.initialLoadOrdersCompleted;
