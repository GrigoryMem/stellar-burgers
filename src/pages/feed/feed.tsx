import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { feedOrdersSelector } from '../../services/slices/orders/commonOrdersSlice';
import { getOrdersWithInfo } from '../../services/slices/orders/getInfoOrders';
import { getFeedOrdersThunk } from '../../services/slices/orders/commonOrdersSlice';
import { isLoadingSelector } from '../../services/slices/orders/commonOrdersSlice';
import { Outlet } from 'react-router-dom';
import { initialLoadCompletedSelector } from '../../services/slices/orders/commonOrdersSlice';
import { useLoadOrders } from '../../utils/hooks';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const firstLoading = useSelector(initialLoadCompletedSelector);
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(feedOrdersSelector);
  //  загрузка заказов ленты используя кастом хук
  useLoadOrders({
    firstLoading,
    typeOrders: 'feed',
    asyncThunkFunc: getOrdersWithInfo
  });
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
      </>
    );
  }
};
