import { FC, useMemo } from 'react';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { ingredientsSelector } from '../../services/slices/ingredients/ingredientSlice';
import { useSelector } from '../../services/store';
import { filterIngredients } from '../../utils/utils';
import { ConstructorElement } from '@zlden/react-developer-burger-ui-components';
import { dividedIngrtsSelector } from '../../services/slices/constructorBurger/constrBurgSlice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
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
  const bunData = addedBunArr[0] ?? defaultBun[0];
  const constructorItems = {
    bun: {
      ...bunData
    },
    ingredients: [...addedMainsArr, ...addedSaucesArr]
  };

  const orderRequest = false;

  const orderModalData = null;

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
  };
  const closeOrderModal = () => {};

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient | TIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  // return null;

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
