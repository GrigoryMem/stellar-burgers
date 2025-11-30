import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getOrdersWithInfo } from '../../services/slices/orders/getInfoOrders';
import { useLoadOrders } from '../../utils/hooks';
import {
  isFirstUserOrders,
  userOrdersSelector
} from '../../services/slices/orders/commonOrdersSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const firstLoading = useSelector(isFirstUserOrders);
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(userOrdersSelector);
  // загрузка заказов истории используя кастом хук
  useLoadOrders({
    firstLoading,
    typeOrders: 'history',
    asyncThunkFunc: getOrdersWithInfo
  });

  if (!firstLoading) {
    // показываем прелоадер если только первая загрузка заказов не случилась
    return <Preloader />;
  }
  return <ProfileOrdersUI orders={orders} />;
};
