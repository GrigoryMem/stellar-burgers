import { AppDispatch, RootState } from '../../store';
import {
  changeCountIngredientById,
  TOperation
} from '../ingredients/ingredientSlice';
import { IngridientWithChoseCount } from '../ingredients/ingredientSlice';
import {
  divideIngridients,
  setIngredients,
  setTotalSum
} from './constrBurgSlice';
import { calcSum } from '../../../utils/utils';
//  Используем на кнопку добавить ингридиент в корзину
export const updateBurgConstrIngreds =
  (operation: TOperation) =>
  //  можно удалить или добавить ингридиент: тип операции и уник _id ингредиента
  (dispatch: AppDispatch, getState: () => RootState) => {
    // хотим пометить ингредиент  как добавленный или убрать
    dispatch(changeCountIngredientById(operation));
    //  получаем актуальное состояние стора всех  ингридиентов
    const stateIngredients = getState().ingredients
      .ingredients as IngridientWithChoseCount[];
    //  формируем добав ингридиенты в конструктор
    const addedIngrs = stateIngredients.filter(
      (ingr) => ingr.count && ingr.count > 0
    );
    console.log(addedIngrs);
    //  сообщаем что состояние конструктора бургера  должно создать массив добавленных ингридиентов
    dispatch(setIngredients(addedIngrs));
    //  создаем ингридиенты для корзины бургера
    //  теперь каждый ингредиент разделен на id и уже без count
    dispatch(divideIngridients(addedIngrs));
    //  подсчитыаем сумму будущего заказа и кладем ее в слайс конструктора бургера
    dispatch(setTotalSum(calcSum(addedIngrs)));
  };
// Пользователь нажал кнопку "Добавить котлету"
// dispatch(updateBurgConstrIngreds({ _id: '2', type: 'add' }));
