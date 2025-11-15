import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch, AppDispatch } from '../../services/store';
import {
  foundOrderSelector,
  getOrderByNumber
} from '../../services/slices/orders/orderSlice';
import {
  ingredientsSelector,
  getIngredients
} from '../../services/slices/ingredients/ingredientSlice';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  //  получаем номер заказа
  const { number: orderNumber } = useParams();

  const dispatch: AppDispatch = useDispatch();
  const gettingOrder = useSelector(foundOrderSelector);

  useEffect(() => {
    if (!orderNumber) return;
    //  загржуаем заказ если есть его номер
    dispatch(getOrderByNumber(Number(orderNumber)));
  }, [orderNumber, dispatch]);
  const orderData = {
    createdAt: gettingOrder?.createdAt || 'string',
    ingredients: gettingOrder?.ingredients || [],
    _id: gettingOrder?._id || 'string',
    status: gettingOrder?.status || 'string',
    name: gettingOrder?.name || 'string',
    updatedAt: gettingOrder?.updatedAt || 'string',
    number: gettingOrder?.number || 0
  };

  const ingredients: TIngredient[] = useSelector(ingredientsSelector);
  //  загружаем ингредиенты в стор если они еще не загружены
  useEffect(() => {
    if (ingredients.length === 0) {
      dispatch(getIngredients());
    }
  }, [dispatch, ingredients]);
  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
