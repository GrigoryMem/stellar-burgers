import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { Routes, Route, useLocation } from 'react-router-dom';
import '../../index.css';
import styles from './app.module.css';
import { ProtectedRoute } from '../protected-route';
import { useGoBack } from '../../utils/hooks';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { useDispatch } from '../../services/store';
import { checkAuthWithToken } from '../../services/slices/user/actionsApi/thunks';
import { useEffect } from 'react';
import { getIngredients } from '../../services/slices/ingredients/ingredientSlice';

const App = () => {
  const location = useLocation();
  const backgroundLocation = location.state?.background;
  // чтобы приложение не разлогинивалось при перезагрузке:
  // загружаем данные пользователя - данные в т ч необходимые для авторизации на любой странице приложения
  const dispatch = useDispatch();
  useEffect(() => {
    // проверка токена
    dispatch(checkAuthWithToken());
  }, [dispatch]);
  const goBack = useGoBack();
  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed' element={<Feed />} />
        {/* делаем отдельный маршрут  для выбранного заказа чтобы прямой переход сработал */}
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        {/*  открытие прямого маршрута на заказа */}
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
        {/* модалки */}
      </Routes>
      {backgroundLocation && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal onClose={goBack} title='Ингредиент подробно'>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal onClose={goBack} title='Заказ ленты подробно'>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal onClose={goBack} title='Ваш заказ подробно'>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};
//  <Route path="/login" element={<ProtectedRoute onlyUnAuth><LoginPage/></ProtectedRoute>} />
export default App;

console.log(
  getIngredients.fulfilled(
    [
      {
        _id: '1',
        name: 'Булка традиционная',
        type: 'bun',
        proteins: 8,
        fat: 3,
        carbohydrates: 25,
        calories: 180,
        price: 50,
        image: 'https://example.com/images/bun.png',
        image_large: 'https://example.com/images/bun_large.png',
        image_mobile: 'https://example.com/images/bun_mobile.png'
      },
      {
        _id: '2',
        name: 'Котлета из говядины',
        type: 'main',
        proteins: 20,
        fat: 15,
        carbohydrates: 0,
        calories: 250,
        price: 120,
        image: 'https://example.com/images/beef.png',
        image_large: 'https://example.com/images/beef_large.png',
        image_mobile: 'https://example.com/images/beef_mobile.png'
      },
      {
        _id: '3',
        name: 'Соус фирменный острый',
        type: 'sauce',
        proteins: 2,
        fat: 10,
        carbohydrates: 5,
        calories: 120,
        price: 30,
        image: 'https://example.com/images/sauce.png',
        image_large: 'https://example.com/images/sauce_large.png',
        image_mobile: 'https://example.com/images/sauce_mobile.png'
      }
    ],
    '',
    undefined
  )
);

console.log(getIngredients.pending(''));

console.log(
  getIngredients.rejected(
    new Error('Fail'),
    '123',
    undefined,
    'Service Unavailable'
  )
);
