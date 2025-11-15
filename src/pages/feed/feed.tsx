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
  const orders: TOrder[] = useSelector(feedOrdersSelector);

  useEffect(() => {
    //  загружаем заказы и ингредиенты к ним
    dispatch(getOrdersWithInfo('feed'));
  }, [dispatch]);
  if (loading) {
    return <Preloader />;
  } else {
    return (
      <FeedUI
        orders={orders}
        handleGetFeeds={() => {
          dispatch(getFeedOrdersThunk());
        }}
      />
    );
  }
};
