import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder, TReadyOrder } from '@utils-types';
import { createOrder } from '../constructorBurger/createOrder';
import { getOrderByNumberApi, TNewOrderResponse, TOrdersResponse } from '@api';
import { RootState } from '../../store';
//  для модального окна
type TOrderState = {
  currentCreateOrder: TNewOrderResponse | null;
  loading: boolean;
  error: string | null;
  foundOrder: TOrder | null | TReadyOrder;
};

type TOperationOrder = {
  show: boolean;
  order?: TNewOrderResponse | null;
};

const initialState: TOrderState = {
  currentCreateOrder: null,
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
        state.currentCreateOrder = null;
      } else {
        state.currentCreateOrder = action.payload.order as TNewOrderResponse;
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
          state.currentCreateOrder = action.payload;
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
export const selectorNewOrder = (state: RootState) =>
  state.newOrder.currentCreateOrder;
export default orderSlice.reducer;
