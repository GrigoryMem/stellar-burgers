import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector, AppDispatch } from '../../services/store';
import { getOrdersWithInfo } from '../../services/slices/orders/getInfoOrders';
import { getUserOrdersThunk } from '../../services/slices/orders/commonOrdersSlice';
import {
  isFirstUserOrders,
  userOrdersSelector
} from '../../services/slices/orders/commonOrdersSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const firstLoading = useSelector(isFirstUserOrders);
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(userOrdersSelector);

  useEffect(() => {
    //  загружаем заказы и ингредиенты к ним
    const interval = setInterval(() => {
      dispatch(getOrdersWithInfo('history'));
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [dispatch]);

  if (!firstLoading) {
    // показываем прелоадер если только первая загрузка заказов не случилась
    return <Preloader />;
  }
  return <ProfileOrdersUI orders={orders} />;
};
