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
  idIngredsForOrder: string[];
  totalSum: number;
};

const initialState: TBurgConstrState = {
  addedIngredients: [],
  dividedIngwithId: [],
  idIngredsForOrder: [],
  totalSum: 0
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
    },
    // подготовим добавленные ингридиенты в корзине к созданию заказа
    prepareToOrder: (state) => {
      //  положим все id ингридиентов в массив для нашего заказ
      state.idIngredsForOrder = state.dividedIngwithId.map((item) => item._id);
    },
    //  подсчитаем сумму заказа в сторе
    setTotalSum: (state, action: PayloadAction<number>) => {
      state.totalSum = action.payload;
    },
    //  очистим корзину конструктора - => напр если промис будет успешным
    clearConstructor: (state) => {
      state.addedIngredients = [];
      state.dividedIngwithId = [];
      state.idIngredsForOrder = [];
      state.totalSum = 0;
    }
  }
});
export const {
  setIngredients,
  divideIngridients,
  prepareToOrder,
  setTotalSum,
  clearConstructor
} = burgConstrSlice.actions;
export default burgConstrSlice.reducer;
