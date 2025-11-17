import { useSelector } from '../../services/store';
import {
  isAuthCheckedSelector,
  userDataSelector,
  isLoadingUserSelector
} from '../../services/slices/user/userSlice';
import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(isAuthCheckedSelector); //  isAuthCheckedSelector — селектор получения состояния загрузки пользователя
  const user = useSelector(userDataSelector); //  userDataSelector — селектор получения пользователя из store
  const location = useLocation();
  const loading = useSelector(isLoadingUserSelector);

  if (loading && !isAuthChecked) {
    // пока идёт загрузка данных пользователя , показываем прелоадер
    //  и проверка токена неначалась
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    //  если маршрут для авторизованного пользователя, но пользователь неавторизован, то делаем редирект
    return <Navigate replace to='/login' state={{ from: location }} />; // в поле from объекта location.state записываем информацию о URL
    // replace- забываем шаг назад  страницу для авториз пользователй
  }

  if (onlyUnAuth && user) {
    //  если маршрут для неавторизованного пользователя, но пользователь авторизован
    // при обратном редиректе  получаем данные о месте назначения редиректа из объекта location.state
    // в случае если объекта location.state?.from нет — а такое может быть , если мы зашли на страницу логина по прямому URL
    // мы сами создаём объект c указанием адреса и делаем переадресацию на главную страницу
    const from = location.state?.from || { pathname: '/' };
    // replace- забываем шаг назад страницу логина
    return <Navigate replace to={from} />;
  }

  return children;
};
