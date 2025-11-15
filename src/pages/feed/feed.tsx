import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector, AppDispatch } from '../../services/store';
import { feedOrdersSelector } from '../../services/slices/orders/commonOrdersSlice';
import { getOrdersWithInfo } from '../../services/slices/orders/getInfoOrders';
import { getFeedOrdersThunk } from '../../services/slices/orders/commonOrdersSlice';
import { isLoadingSelector } from '../../services/slices/orders/commonOrdersSlice';

export const Feed: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const loading = useSelector(isLoadingSelector);
  /** TODO: взять переменную из стора */
  // const orders = useSelector(feedOrdersSelector);
  const orders: TOrder[] = useSelector(feedOrdersSelector) as TOrder[];
  // const orders: TOrder[] = [];
  console.log(orders);
  const downloadOrders: TOrder[] = [
    {
      _id: '123',
      status: 'готовится',
      name: 'string',
      createdAt: '05.02.2023',
      updatedAt: '05.02.2023',
      number: 250,
      ingredients: ['123'],
      price: 250 // м
    },
    {
      _id: '1234',
      status: 'готовится',
      name: 'string',
      createdAt: '05.02.2023',
      updatedAt: '05.02.2023',
      number: 250,
      ingredients: ['123'],
      price: 250 // м
    },
    {
      _id: '123',
      status: 'готовится',
      name: 'string',
      createdAt: '05.02.2023',
      updatedAt: '05.02.2023',
      number: 250,
      ingredients: ['123'],
      price: 250 // м
    }
  ];
  // console.log(orders);
  useEffect(() => {
    //  загружаем заказы и ингредиенты к ним
    dispatch(getOrdersWithInfo('feed'));
  }, [dispatch]);
  if (!orders.length) {
    return <Preloader />;
  } else {
    return <FeedUI orders={orders} handleGetFeeds={() => {}} />;
  }
};
