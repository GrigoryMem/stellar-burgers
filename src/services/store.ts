import { configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { ingredientSlice } from './slices/ingredients/ingredientSlice';
import { rootReducerBurger as rootReducer } from './rootReducer';
import extraArgument from './extraArg';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: extraArgument // <-- Подключение
      },
    }),
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;
export const dispatch: AppDispatch = useDispatch();

export default store;
