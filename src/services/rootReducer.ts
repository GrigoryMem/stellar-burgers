import { combineReducers } from '@reduxjs/toolkit';
import ingredientReducer from './slices/ingredients/ingredientSlice';
import burgerConsructor from './slices/constructorBurger/constrBurgSlice';
import  orderSlice  from './slices/orderSlice';

export const rootReducerBurger = combineReducers({
  ingredients: ingredientReducer,
  constructorBurgers: burgerConsructor,
  newOrder: orderSlice
});
