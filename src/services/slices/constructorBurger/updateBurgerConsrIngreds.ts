import { AppDispatch, dispatch, RootState } from 'src/services/store';
import {
  changeCountIngredientById,
  TOperation
} from '../ingredients/ingredientSlice';
import { IngridientWithChoseCount } from '../ingredients/ingredientSlice';
import { setIngredients } from './constrBurgSlice';

export const updateBurgConstrIngreds =
  (operation: TOperation) =>
  //  можно удалить или добавить ингридиент: тип операции
  (dispatch: AppDispatch, getState: () => RootState) => {
    // хотим пометить ингредиент  как добавленный или убрать
    dispatch(changeCountIngredientById(operation));
    //  получаем актуальное состояние стора всех  ингридиентов
    const stateIngredients = getState()
      .ingredients as unknown as IngridientWithChoseCount[];
    //  формируем добав ингридиенты в конструктор
    const addedIngrs = stateIngredients.filter(
      (ingr) => ingr.count && ingr.count > 0
    );
    //  сообщаем что состояние конструктора  должно создать массив добавленных ингридиентов
    dispatch(setIngredients(addedIngrs));
  };
