import { FC, useEffect, useMemo } from 'react';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { ingredientsSelector } from '../../services/slices/ingredients/ingredientSlice';
import { useSelector, useDispatch } from '../../services/store';
import { filterIngredients } from '../../utils/utils';
import { dividedIngrtsSelector } from '../../services/slices/constructorBurger/constrBurgSlice';
import { createOrder } from '../../services/slices/constructorBurger/createOrder';
import { updateBurgConstrIngreds } from '../../services/slices/constructorBurger/updateBurgerConsrIngreds';
import {
  loadingSelectorOrder as loading,
  selectorCurCreatedOrder as newOrder,
  setCurrentOrder
} from '../../services/slices/orders/orderSlice';
import { useGoBack } from '../../utils/hooks';
import { isAuthenticated } from '../../services/slices/user/userSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch();
  const allIngedients = useSelector(ingredientsSelector);
  const navigate = useNavigate();
  //  провера состояния авторизации
  const checkAuth = useSelector(isAuthenticated);
  const { bunsArr: defaultBun, ...useless } = filterIngredients(allIngedients);
  //  то что добавляю
  const addedIngredients = useSelector(dividedIngrtsSelector);
  const dataNewOrder = useSelector(newOrder);
  //  что добавлено в корзину конструктора
  const {
    bunsArr: addedBunArr,
    mainsArr: addedMainsArr,
    saucesArr: addedSaucesArr
  } = filterIngredients(addedIngredients);
  //  устанавливаем булку по ум в хранилище
  useEffect(() => {
    if (defaultBun.length > 0) {
      const actionType = {
        type: 'increment' as const,
        _id: defaultBun[0]._id
      };
      dispatch(updateBurgConstrIngreds(actionType));
    }
  }, []);

  //  либо с клика либо с всех загруженых ингридиентов либо  дефолт
  const bunData = addedBunArr[0] || defaultBun[0] || null;
  const constructorItems = {
    bun: bunData,
    ingredients: [...addedMainsArr, ...addedSaucesArr]
  };

  let lockBtnStatus = useMemo(() => {
    //  если пользователь ничего не выбрал
    if (addedMainsArr.length === 0 && addedSaucesArr.length === 0) {
      //  ставим блок
      return true;
    } else {
      //  снимаем блок
      return false;
    }
  }, [addedMainsArr, addedSaucesArr, checkAuth]);
  const goBack = useGoBack();
  const orderRequest = useSelector(loading);

  const orderModalData = dataNewOrder || null;
  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!checkAuth) {
      navigate('/login');
    }
    if (checkAuth) {
      dispatch(createOrder());
    }
  };
  const closeOrderModal = () => {
    //  очистка хранилища по текущему новому заказу
    dispatch(setCurrentOrder({ show: false, order: null }));
    //  закртываем модалку => см в APP
    goBack();
  };

  const price = useMemo(() => {
    // если нет булки то цена 0 - подстраховка
    if (!constructorItems.bun) return 0;
    return (
      constructorItems.bun.price * 2 +
      constructorItems.ingredients.reduce((s, v) => s + (v?.price || 0), 0)
    );
  }, [constructorItems]);
  // return null;

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
      disabled={lockBtnStatus}
    />
  );
};
