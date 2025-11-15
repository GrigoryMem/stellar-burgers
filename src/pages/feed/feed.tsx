import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useDispatch, useSelector, AppDispatch } from '../../services/store';
import { feedOrdersSelector } from '../../services/slices/orders/commonOrdersSlice';

export const Feed: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = [];
  // useEffect(() => {
  //   dispatch(getFeedOrders());
  // })
  if (!orders.length) {
    return <Preloader />;
  }

  <FeedUI orders={orders} handleGetFeeds={() => {}} />;
};
