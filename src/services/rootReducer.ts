import { combineReducers } from '@reduxjs/toolkit';
import ingredientReducer from './slices/ingredients/ingredientSlice';

export const rootReducerBurger = combineReducers({
  ingredients: ingredientReducer
});
