import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { createOrder } from './constructorBurger/createOrder';
import { TNewOrderResponse } from '@api';
//  для модального окна
type TOrderState = {
  currentOrder: TNewOrderResponse | null;
  loading: boolean;
  error: string | null;
};

type TOperationOrder = {
  show: boolean;
  order?: TNewOrderResponse | null;
};

const initialState: TOrderState = {
  currentOrder: null,
  loading: false,
  error: null
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    //  для очистки поля currentOrder
    setCurrentOrder(state, action: PayloadAction<TOperationOrder>) {
      if (!action.payload.show) {
        state.currentOrder = null;
      } else {
        state.currentOrder = action.payload.order as TNewOrderResponse;
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
          state.currentOrder = action.payload;
        }
      );
  }
});
