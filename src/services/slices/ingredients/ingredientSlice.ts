import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '../../../utils/types';
import { getIngredientsApi } from '@api';
import { resolveAfterDelay, testIngredients } from 'src/utils/testApi';
import { RootState } from 'src/services/store';

export type IngridientWithChoseCount = TIngredient & {
  count?: number;
};

export type TIngredientsState = {
  ingredients: Array<IngridientWithChoseCount>;
  loading: boolean;
  error: string | null;
  selectedIngredient?: string | null;
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
    setOpenIngredient: (
      state,
      action: PayloadAction<TIngredientsState['selectedIngredient']>
    ) => {
      state.selectedIngredient = action.payload;
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

export const { setOpenIngredient } = ingredientSlice.actions;
export const selectIngredients = (state: RootState) => state.ingredients;
export default ingredientSlice.reducer;
