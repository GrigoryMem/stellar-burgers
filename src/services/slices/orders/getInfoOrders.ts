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
type OrderTypeToFetch = 'feed' | 'history';

export const getOrdersWithInfo =
  (typeThunk: OrderTypeToFetch) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    //  делаем запрос о получении ингридиентов
    await dispatch(getIngredients()); // ждем пока все ингридиенты загрузится(это промис)
    //  делаем запросы о получении заказов истории и ленты и ждем выполнения промисов
    if (typeThunk === 'feed') await dispatch(getFeedOrdersThunk());
    if (typeThunk === 'history') await dispatch(getUserOrdersThunk());
    // теперь можем работать с актуальным состояние данных
    // все ингридиенты теперь доступны в хранилище
    const allIngedients = getState().ingredients.ingredients;
    //  набор  заказов кот сост id всех ингридиентов:лента и история
    let freshOrders;
    if (typeThunk === 'feed') {
      freshOrders = getState().allOrders.feedOrders.ordersFeed;
    }
    if (typeThunk === 'history') {
      freshOrders = getState().allOrders.userOrders.ordersHistory;
    }
    // формирование  набора заказов с подробным описанием ингридиентов
    const fullOrders = getFullOrdersIngs(
      freshOrders as TOrder[],
      allIngedients
    ) as TFullOrder[];
    //  посчитаем суммы всех заказов и добавим в ордер каждого заказа его общий прайс
    const readyOrders = ordersWthPriceandFormatDate(fullOrders);
    //  затем нам нужно обновить состояние заказов нашими обновленными заказами
    //  cделаем синхронные диспатчив теже поля
    dispatch(setOrders({ orders: readyOrders, typeOrders: typeThunk }));
  };
