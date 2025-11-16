import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector, AppDispatch } from '../../services/store';
import { feedOrdersSelector } from '../../services/slices/orders/commonOrdersSlice';
import { getOrdersWithInfo } from '../../services/slices/orders/getInfoOrders';
import { getFeedOrdersThunk } from '../../services/slices/orders/commonOrdersSlice';
import { isLoadingSelector } from '../../services/slices/orders/commonOrdersSlice';
import { Outlet } from 'react-router-dom';
import { initialLoadCompletedSelector } from '../../services/slices/orders/commonOrdersSlice';

export const Feed: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const firstLoading = useSelector(initialLoadCompletedSelector);
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(feedOrdersSelector);

  useEffect(() => {
    //  загружаем заказы и ингредиенты к ним
    const interval = setInterval(() => {
      dispatch(getOrdersWithInfo('feed'));
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [dispatch]);
  if (!firstLoading) {
    // показываем прелоадер если только первая загрузка заказов не случилась
    return <Preloader />;
  } else {
    return (
      <>
        <FeedUI
          orders={orders}
          handleGetFeeds={() => {
            dispatch(getFeedOrdersThunk());
          }}
        />
        {/* рендерим дочерний элемент */}
        {/* <Outlet /> */}
      </>
    );
  }
};
