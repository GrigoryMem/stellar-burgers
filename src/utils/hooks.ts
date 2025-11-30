import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState, useDispatch } from '../services/store';
import {
  getOrdersWithInfo,
  OrderTypeToFetch
} from '../services/slices/orders/getInfoOrders';
import { useEffect } from 'react';

export const useGoBack = (steps = 1) => {
  const navigate = useNavigate();

  const goBack = useCallback(() => {
    navigate(-steps);
  }, [navigate, steps]);

  return goBack;
};

type TOrdersLoad = {
  firstLoading: boolean;
  typeOrders: OrderTypeToFetch;
  asyncThunkFunc: (
    typeThunk: OrderTypeToFetch
  ) => (dispatch: AppDispatch, getState: () => RootState) => void;
};

export function useLoadOrders(settingOrders: TOrdersLoad) {
  const dispatch = useDispatch();
  const { firstLoading, typeOrders, asyncThunkFunc } = settingOrders;
  useEffect(() => {
    //  загружаем заказы и ингредиенты к ним
    //  если перваязагрузка еще не состоялась
    if (!firstLoading) {
      // делаем простую загрузку чтобы пользователь не видел пустойлоадер лишние 5 сек
      dispatch(asyncThunkFunc(typeOrders));
    } else {
      //  если повторная загрузка - делаем периодические запросы - ("в реальном времени")
      const interval = setInterval(() => {
        dispatch(asyncThunkFunc(typeOrders));
      }, 5000);
      return () => {
        // при размонтировании очищаем интервал
        clearInterval(interval);
      };
    }
  }, [dispatch, firstLoading]);
}
