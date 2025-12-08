import { TFullOrder, TOrder } from '@utils-types';
import { AppDispatch, RootState } from '../../store';
import {
  getFullOrdersIngs,
  ordersWthPriceandFormatDate
} from '../../../utils/utils';
import { getIngredients } from '../ingredients/ingredientSlice';
import {
  getFeedOrdersThunk,
  getUserOrdersThunk,
  setOrders
} from './commonOrdersSlice';
//  эту функцию используем чтобы получить список заказов с подробным описанием ингридиентов
//  тип аргумента для асинхронного тханка
export type OrderTypeToFetch = 'feed' | 'history';

export const getOrdersWithInfo =
  (typeThunk: OrderTypeToFetch) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    //  делаем запрос о получении ингридиентов
    await dispatch(getIngredients()); // ждем пока все ингридиенты загрузится(это промис)
    //  делаем запросы о получении заказов истории и ленты и ждем выполнения промисов
    if (typeThunk === 'feed') {
      await dispatch(getFeedOrdersThunk());
    }
    if (typeThunk === 'history') {
      await dispatch(getUserOrdersThunk());
    }
  };
