import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { selectedIngredient } from '../../services/slices/ingredients/ingredientSlice';
import { useSelector } from '../../services/store';
export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */

  const ingredientData = useSelector(selectedIngredient);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
