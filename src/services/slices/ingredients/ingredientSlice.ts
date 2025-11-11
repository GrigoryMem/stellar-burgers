import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '../../../utils/types';
import { getIngredientsApi } from '@api';
import { resolveAfterDelay, testIngredients } from 'src/utils/testApi';
import { RootState } from 'src/services/store';
import { filterElems, findElement } from 'src/utils/findElement';
// ингридент с отмеченным количеством
export type IngridientWithChoseCount = TIngredient & {
  count?: number | '';
};
//  манипуляции добавления/удаления ингридиента в конструктор
export type TOperation = {
  type: 'increment' | 'decrement';
  _id: string;
};

export type TIngredientsState = {
  ingredients: Array<IngridientWithChoseCount>;
  loading: boolean;
  error: string | null;
  selectedIngredient?: IngridientWithChoseCount | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  loading: false,
  error: null,
  selectedIngredient: null // по ум модальное окно закрыто
};

export const getIngredients = createAsyncThunk(
  'ingredients/getIngredients',
  async (_, thunkApi) => {
    try {
      const data = await getIngredientsApi();
      return data;
    } catch (error) {
      // чтобы иметь чёткий текст ошибки для UI.
      // rejectWithValue позволяет передать свой payload для ошибки,
      // который потом будет доступен в редьюсере через action.payload.
      return thunkApi.rejectWithValue(`Error: ${error}`);
    }
  }
);

export const ingredientSlice = createSlice({
  name: 'ingredients',
  reducers: {
    // для открытия модалки
    setSelectedIngredientById: (state, action: PayloadAction<string>) => {
      // const ingredient = state.ingredients.find(
      //   (item) => item._id === action.payload
      // );
      // action.payload - цифра id напр _id = 2
      const foundInged = findElement(state.ingredients, '_id', action.payload);
      if (foundInged && foundInged.element) {
        //  установим выбранный ингридиент
        state.selectedIngredient = foundInged.element;
      }
    },
    //  отвечаем на действие удаление и добавление эелмента в корзину конструктора
    changeCountIngredientById: (state, action: PayloadAction<TOperation>) => {
      //  найдем эдемент по id и поменяем ему count
      const foundInged = findElement(
        state.ingredients,
        '_id',
        action.payload._id
      );
      if (!foundInged) return;
      const { element, index } = foundInged;
      //  можно выбрать только один тип булки
      if (element.type === 'bun') {
        //  если уже вообще выбранная булка кроме которую сейчас кликаем чтоб выбрать?
        const choseLastBunInd = state.ingredients.findIndex(
          (ing) => ing.type === 'bun' && ing.count && ing.count > 0
        );
        //  если выбранная булка совпадает с нашей - не даем увеличить количество
        // чтобы ее значение осталось 1
        if (choseLastBunInd === index) return;
        //  если кроме нашей булку выбрали другую
        if (choseLastBunInd !== -1) {
          // - сбрасываем  количество у предыдущей выбр булки
          state.ingredients[choseLastBunInd].count = 0;
          state.ingredients[index].count = 1;
        }
        //  если ничего не выбрано из булок воощбе -  то просто добавляем булку
        else state.ingredients[index].count = 1;
      } else {
        // Условие если ингридиент не булка
        // решаем ...либо вычитание либо сложение
        const searchOperation = action.payload.type === 'increment' ? 1 : -1;
        //  выполняем операцию и зазищаем от отриц числа
        const num = Math.max((element.count || 0) + searchOperation, 0);
        //  если число ноль то его и не записываем
        element.count = num ? num : '';
        //  сохраняем результат в любом случае
        state.ingredients[index] = element;
      }
    }
  },
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || action.error.message || 'Error';
        // action.payload - запищем кокрентую ошибку через rejectWithValue
        // action.error.message  стандартное поле для ошибки
      })
      .addCase(
        getIngredients.fulfilled,
        (state, action: PayloadAction<TIngredientsState['ingredients']>) => {
          state.loading = false;
          state.ingredients = action.payload;
        }
      );
  }
});

export const { setSelectedIngredientById, changeCountIngredientById } =
  ingredientSlice.actions;
export const selectIngredient = (state: RootState) =>
  state.ingredients.selectedIngredient;
export const ingredients = (state: RootState) =>
  state.ingredients.ingredients.filter((item) => item.count);
export default ingredientSlice.reducer;
