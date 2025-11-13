import { TOrder } from '@utils-types';
import { AppDispatch, dispatch, RootState } from 'src/services/store';
import { ingredientSlice, IngridientWithChoseCount } from '../ingredients/ingredientSlice';
import { calcSum, getFullOrdersIngs } from 'src/utils/utils';
import { getIngredients } from '../ingredients/ingredientSlice';

export const getOrdersWithInfo = () => async (
  dispatch: AppDispatch,
  getState: () => RootState
) =>{
    //  делаем запрос о получении ингридиентов
    await dispatch(getIngredients()); // ждем пока все загрузится(это промис)
    // все ингридиенты теперь доступны в хранилище
    const allIngedients = getState().ingredients.ingredients;
    //  набор  заказов кот сост id всех ингридиентов:лента и история
    const ordersFeed = getState().allOrders.feedOrders.ordersFeed;
    const userOrders = getState().allOrders.userOrders.ordersHistory;
    // формирование  набора заказов с подробным описанием ингридиентов
    //  для ленты заказов
    const fullFeedOrders = getFullOrdersIngs(ordersFeed, allIngedients);
    //  для истории заказов пользователя
    const fullUserOrders = getFullOrdersIngs(userOrders, allIngedients);
    //  посчитаем суммы всех заказов и добавим в ордер каждого заказа его общий прайс
    //  для истории пользователя
    //  рефактор - сделать одну функцию по подсчете цены каждого заказа!!!
    const userOrdersWithPrice = fullUserOrders.map((order) => {
      let price = calcSum(order.ingredients as IngridientWithChoseCount[]);
      order.price = price;
      return order;
    });
    //  для ленты заказов
    const feedOrdersWithPrice = fullFeedOrders.map((order) => {
      let price = calcSum(order.ingredients as IngridientWithChoseCount[]);
      order.price = price;
      return order;
    });
  // преобразовать время и диспатч сделать
  //  разберись с типизауией промиса на заказыползьователя чтобывсе корректно

}
