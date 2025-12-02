import { configureStore } from '@reduxjs/toolkit';
import { ApiClients } from './extraArg';
import {
  useDispatch as useAppDispatch,
  useSelector as useAppSelector
} from 'react-redux';

import { rootReducerBurger as rootReducer } from './rootReducer';
import extraArgument from './extraArg';

export const store = configureStore({
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
export const useDispatch = useAppDispatch.withTypes<AppDispatch>();
export const useSelector = useAppSelector.withTypes<RootState>();
//  хранилище
export default store;
// export const useAppStore = useStore.withTypes<AppStore>();
