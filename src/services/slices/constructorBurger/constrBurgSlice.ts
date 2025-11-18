import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import { divideIngridientsById } from '../../../utils/utils';
import { IngridientWithChoseCount } from '../ingredients/ingredientSlice';
import { RootState } from 'src/services/store';

// парметры замены элементов
type TReplacer = {
  from: number;
  to: number;
};

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
      state.addedIngredients = [...action.payload];
    },
    // настроим ингридиенты под корзину конструктора разделив их по id засчте count
    //  для рендера реакт
    divideIngridients: (state, action) => {
      state.dividedIngwithId = [...divideIngridientsById(action.payload)];
    },
    // подготовим добавленные ингридиенты в корзине к созданию заказа
    prepareToOrder: (state) => {
      //  положим все id ингридиентов в массив для нашего заказ
      state.idIngredsForOrder = [
        ...state.dividedIngwithId.map((item) => item._id)
      ];
    },
    //  подсчитаем сумму заказа в сторе
    setTotalSum: (state, action: PayloadAction<number>) => {
      state.totalSum = action.payload;
    },
    //  меняем порядок элементов в массиве добавленных ингредиентов
    replaceTwoElements: (state, action: PayloadAction<TReplacer>) => {
      const { from, to } = action.payload;
      if (from === to || !state.dividedIngwithId[to]) {
        return;
      }
      const temp = state.dividedIngwithId[from];
      const next = state.dividedIngwithId[to];
      //  меняем местами предыдущий и следующий
      state.dividedIngwithId[from] = next;
      state.dividedIngwithId[to] = temp;
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

export const addedIngrtsSelector = (state: RootState) =>
  state.constructorBurgers.addedIngredients;
export const dividedIngrtsSelector = (state: RootState) =>
  state.constructorBurgers.dividedIngwithId;
export const totalSumSelector = (state: RootState) =>
  state.constructorBurgers.totalSum;
export const { replaceTwoElements } = burgConstrSlice.actions;
