import { FC } from 'react';
import { useSelector } from '../../services/store';
import { feedOrdersSelector } from '../../services/slices/orders/commonOrdersSlice';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { formatDateOrder } from '../../utils/utils';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  /** TODO: взять переменные из стора */
  const orders: TOrder[] = useSelector(feedOrdersSelector);
  const formatOrdersDate = orders.map((order) => ({
    ...order,
    createdAt: formatDateOrder(order.createdAt),
    updatedAt: formatDateOrder(order.updatedAt)
  }));
  const toDayOrders = formatOrdersDate.filter((order) =>
    order.createdAt.startsWith('Сегодня')
  );
  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');
  // console.log(orders);
  const feed = {
    total: orders.length || 0,
    totalToday: toDayOrders.length || 0
  };
  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
