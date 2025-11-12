import { combineReducers } from '@reduxjs/toolkit';
import ingredientReducer from './slices/ingredients/ingredientSlice';
import burgerConsructor from './slices/constructorBurger/constrBurgSlice';
import orderSlice from './slices/orders/orderSlice';
import CommonOrders from './slices/orders/commonOrdersSlice';

export const rootReducerBurger = combineReducers({
  ingredients: ingredientReducer,
  constructorBurgers: burgerConsructor,
  newOrder: orderSlice,
  allOrders: CommonOrders
});
