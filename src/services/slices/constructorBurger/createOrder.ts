import { createAsyncThunk } from '@reduxjs/toolkit';
import { dataIngIds, orderBurgerApi } from '@api';
import { AppDispatch, dispatch, RootState } from 'src/services/store';
import { prepareToOrder,clearConstructor } from './constrBurgSlice';

//  нажмем на кнопку чтобы создать заказ
export const createOrder = createAsyncThunk(
  'orders/createOrder', // <слайс>/<действие>
  async (_, thunkApi) => {
    try {
      const state = thunkApi.getState() as RootState;
      const dispatch = thunkApi.dispatch as AppDispatch;
      dispatch(prepareToOrder()); // готовим ингридиенты к созданию заказа
      //  получаем  актуальное состояние id ингридиентов
      const stateIngredients = (thunkApi.getState() as RootState)
        .constructorBurgers.idIngredsForOrder;
      //  создаем заказ и отправляем его на сервер
      const data = await orderBurgerApi({
        ingredients: stateIngredients
      });
      //  очищаем конструктор при успешном ответе от сервера
      dispatch(clearConstructor());
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(`Error: ${error}`);
    }
  }
);

// //burgerConstructor/createOrder/pending
// burgerConstructor/createOrder/fulfilled
// burgerConstructor/createOrder/rejected
