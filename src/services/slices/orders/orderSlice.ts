import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder, TReadyOrder } from '@utils-types';
import { createOrder } from '../constructorBurger/createOrder';
import { getOrderByNumberApi, TNewOrderResponse, TOrdersResponse } from '@api';
import { RootState } from '../../store';
//  для модального окна
type TOrderState = {
  currentCreatedOrder: TNewOrderResponse | null;
  loading: boolean;
  error: string | null;
  foundOrder: TOrder | null | TOrder;
};

type TOperationOrder = {
  show: boolean;
  order?: TNewOrderResponse | null;
};

const initialState: TOrderState = {
  currentCreatedOrder: null,
  loading: false,
  error: null,
  foundOrder: null
};

export const getOrderByNumber = createAsyncThunk(
  'order/getOrderByNumber',
  async (number: number) => {
    const data = await getOrderByNumberApi(number);
    return data.orders[0]; // возвращаем сам единственный в массиве ответа заказ
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    //  для очистки поля currentOrder
    setCurrentOrder(state, action: PayloadAction<TOperationOrder>) {
      if (!action.payload.show) {
        state.currentCreatedOrder = null;
      } else {
        state.currentCreatedOrder = action.payload.order as TNewOrderResponse;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || action.error.message || 'Error';
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TNewOrderResponse>) => {
          state.loading = false;
          state.currentCreatedOrder = action.payload;
        }
      )
      //  по номеру получим заказ
      .addCase(getOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || action.error.message || 'Error';
      })
      .addCase(
        getOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.loading = false;
          state.foundOrder = action.payload;
        }
      );
  }
});

export const { setCurrentOrder } = orderSlice.actions;
export const selectorCurCreatedOrder = (state: RootState) =>
  state.newOrder.currentCreatedOrder?.order;
export const loadingSelectorOrder = (state: RootState) =>
  state.newOrder.loading;
export const foundOrderSelector = (state: RootState) =>
  state.newOrder.foundOrder;
export default orderSlice.reducer;
