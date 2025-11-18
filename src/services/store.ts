import { configureStore } from '@reduxjs/toolkit';
import { ApiClients } from './extraArg';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { rootReducerBurger as rootReducer } from './rootReducer';
import extraArgument from './extraArg';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: extraArgument as ApiClients // <-- Подключение extraArgument
      }
    }),
  devTools: process.env.NODE_ENV !== 'production'
});
export type AppStore = typeof store;

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
