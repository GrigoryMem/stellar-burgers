import { combineReducers } from '@reduxjs/toolkit';
import ingredientReducer from './slices/ingredients/ingredientSlice';
import burgerConsructor from './slices/constructorBurger/constrBurgSlice';
import orderSlice from './slices/orders/orderSlice';
import CommonOrders from './slices/orders/commonOrdersSlice';
import User from './slices/user/userSlice';

export const rootReducerBurger = combineReducers({
  ingredients: ingredientReducer,
  constructorBurgers: burgerConsructor,
  newOrder: orderSlice,
  allOrders: CommonOrders,
  user: User
});
