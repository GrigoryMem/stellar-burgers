import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import {
  selectedIngredient,
  setSelectedIngredientById
} from '../../services/slices/ingredients/ingredientSlice';
import { useSelector, useDispatch, AppDispatch } from '../../services/store';
import { ingredientsSelector } from '../../services/slices/ingredients/ingredientSlice';
import { useParams } from 'react-router-dom';
import { getIngredients } from '../../services/slices/ingredients/ingredientSlice';
export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const { id: ingredientId } = useParams(); // получаем значение динамического маршрута из стора
  console.log(ingredientId);
  const dispatch: AppDispatch = useDispatch();
  //  селектор выбранноо заказа клик на карточку или прямой маршрут:
  const ingredientData = useSelector(selectedIngredient); // если данные есть, если прямой маршрут данных нет
  //  если не кликали на карточку те прямой маршрут:
  // 1 получаем все ингредиенты из стора + useEffect
  const ingredients = useSelector(ingredientsSelector);
  let classContent = '';
  //  прямой маршрут - загружаем ингредиенты в стор если они еще не загружены
  useEffect(() => {
    if (ingredients.length === 0 && !ingredientData) {
      dispatch(getIngredients());
    }
  }, [dispatch, ingredients, ingredientData]);
  //  прямой маршрут - подгружаем данные встор выбранноо для просмотра заказа
  useEffect(() => {
    // если id есть - переход прямой ссылке
    // ingredients.length - если пдогрузили ингридиенты и
    //  и нет данных которые получены через клик карточки ingredientData
    if (ingredientId && ingredients.length > 0 && !ingredientData) {
      // ingredientData - если несмогли по кликусюда данные получить
      //  выполняем повторный установка текущего открытого ингридиента
      dispatch(setSelectedIngredientById(ingredientId));
    }
  }, [ingredientId, ingredients, ingredientData, dispatch]);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
