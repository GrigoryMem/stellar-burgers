import { createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { RootState } from '../../store';
import { prepareToOrder, clearConstructor } from './constrBurgSlice';
import { clearAllCountsIngredients } from '../ingredients/ingredientSlice';

//  нажмем на кнопку чтобы создать заказ
export const createOrder = createAsyncThunk(
  'order/createOrder', // <слайс>/<действие>
  async (_, thunkApi) => {
    try {
      const dispatch = thunkApi.dispatch;
      dispatch(prepareToOrder()); // готовим ингридиенты к созданию заказа
      //  получаем  актуальное состояние id ингридиентов
      const stateIngredients = (thunkApi.getState() as RootState)
        .constructorBurgers.idIngredsForOrder;
      //  создаем заказ и отправляем его на сервер
      const data = await orderBurgerApi(stateIngredients);
      console.log(data);
      //  очищаем конструктор при успешном ответе от сервера
      dispatch(clearConstructor());
      //  очищаем счетчики ингредиентов корзины
      dispatch(clearAllCountsIngredients());
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(`Проблема при создании заказа: ${error}`);
    }
  }
);
