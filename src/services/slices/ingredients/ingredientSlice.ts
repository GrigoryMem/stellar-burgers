import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '../../../utils/types';
import { getIngredientsApi } from '@api';
import { resolveAfterDelay, testIngredients } from 'src/utils/testApi';
import { RootState } from 'src/services/store';
import { findElement } from 'src/utils/findElement';
// ингридент с отмеченным количеством
export type IngridientWithChoseCount = TIngredient & {
  count?: number;
};
//  манипуляции добавления/удаления ингридиента в конструктор
export type TOperation = {
  type: 'increment' | 'decrement';
  id: string;
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
  error: null
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
        action.payload.id
      );
      if (!foundInged) return;
      const { element, index } = foundInged;
      if (action.payload.type === 'increment') {
        element.count = (element.count || 0) + 1;
        state.ingredients[index] = element;
      }
      if (action.payload.type === 'decrement') {
        // защита от отрицательного количества ингридиента Math.max(x,0)
        element.count = (element.count || 0) - 1;
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
export default ingredientSlice.reducer;
