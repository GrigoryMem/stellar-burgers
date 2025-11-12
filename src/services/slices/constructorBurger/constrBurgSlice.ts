import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient, TOrder } from '@utils-types';
import {
  ingredients,
  TOperation,
  ingredientSlice
} from '../ingredients/ingredientSlice';
import { divideIngridientsById } from 'src/utils/utilsForArrs';
import { IngridientWithChoseCount } from '../ingredients/ingredientSlice';

type TBurgConstrState = {
  addedIngredients: TIngredient[];
  dividedIngwithId: TConstructorIngredient[];
};

const initialState: TBurgConstrState = {
  addedIngredients: [],
  dividedIngwithId: []
};

const burgConstrSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    setIngredients: (
      state,
      action: PayloadAction<IngridientWithChoseCount[]>
    ) => {
      state.addedIngredients = action.payload;
    },
    // настроим ингридиенты под корзину конструктора разделив их по id засчте count
    //  для рендера реакт
    divideIngridients: (state) => {
      if (state.addedIngredients.length > 0) {
        state.dividedIngwithId = divideIngridientsById(state.addedIngredients);
      }
    }
  }
});
export const { setIngredients, divideIngridients } = burgConstrSlice.actions;
export default burgConstrSlice.reducer;
