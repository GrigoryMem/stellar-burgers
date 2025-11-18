import { configureStore } from '@reduxjs/toolkit';
import { ApiClients } from './extraArg';
import { useDispatch, useSelector, useStore } from 'react-redux';

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

//  для Redux Toolkit
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
//  хранилище
export const useAppStore = useStore.withTypes<AppStore>();

export default store;
