import { FC, useEffect, useMemo } from 'react';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { ingredientsSelector } from '../../services/slices/ingredients/ingredientSlice';
import { useSelector, useDispatch, AppDispatch } from '../../services/store';
import { filterIngredients } from '../../utils/utils';
import { ConstructorElement } from '@zlden/react-developer-burger-ui-components';
import { dividedIngrtsSelector } from '../../services/slices/constructorBurger/constrBurgSlice';
import { createOrder } from '../../services/slices/constructorBurger/createOrder';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch: AppDispatch = useDispatch();
  const allIngedients = useSelector(ingredientsSelector);
  const { bunsArr: defaultBun, ...useless } = filterIngredients(allIngedients);
  const addedIngredients = useSelector(dividedIngrtsSelector);

  //  что добавлено в корзину конструктора
  const {
    bunsArr: addedBunArr,
    mainsArr: addedMainsArr,
    saucesArr: addedSaucesArr
  } = filterIngredients(addedIngredients);
  //  либо с клика либо с всех загруженых ингридиентов либо  дефолт
  const bunData = addedBunArr[0] || defaultBun[0] || null;
  const constructorItems = {
    bun: bunData,
    ingredients: [...addedMainsArr, ...addedSaucesArr]
  };
  let disabledButton = useMemo(
    () => addedMainsArr.length === 0 && addedSaucesArr.length === 0,
    [addedMainsArr, addedSaucesArr]
  );

  const orderRequest = false;

  const orderModalData = null;

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    //  оформляем заказ
    dispatch(createOrder());
  };
  const closeOrderModal = () => {};

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
      disabled={disabledButton}
    />
  );
};
