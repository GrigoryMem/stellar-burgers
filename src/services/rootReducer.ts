import { combineReducers } from '@reduxjs/toolkit';
import ingredientReducer from './slices/ingredients/ingredientSlice';
import burgerConsructor from './slices/constructorBurger/constrBurgSlice';

export const rootReducerBurger = combineReducers({
  ingredients: ingredientReducer,
  constructorBurgers: burgerConsructor
});
