import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { changeCountIngredientById } from '../../services/slices/ingredients/ingredientSlice';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { AppDispatch, useDispatch } from '../../services/store';
import { updateBurgConstrIngreds } from '../../services/slices/constructorBurger/updateBurgerConsrIngreds';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch: AppDispatch = useDispatch();
    // ingredient.
    const handleAdd = () => {
      console.log(ingredient);
      dispatch(
        updateBurgConstrIngreds({ _id: ingredient._id, type: 'increment' })
      );
    };
    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
