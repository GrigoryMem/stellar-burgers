import { loginUserApi, TRegisterData } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  checkAuthWithToken,
  forgotPassword,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updateUserData
} from './actionsApi/thunks';
import { TUser } from '@utils-types';
import { RootState } from 'src/services/store';
// хранимые поля

export type TLoginData = Omit<TRegisterData, 'name'>;

type AuthState = {
  user: TUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean; // предоставлен ли пользователю доступ к ресурсу
  isAuthChecked: boolean; // флаг для статуса проверки токена пользователя - при регистрации не проверяем
  customResetMessage: string | null; // при сбросе пароляможем сообщить пользователю что он сброшен чтобы он пошел на почту
};

//  описываем кокретное поле фомры
export type TFieldType<T> = {
  field: keyof T;
  value: string;
};

// 2. Начальное состояние
const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isAuthChecked: false,
  customResetMessage: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    //  очистка данных
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isAuthChecked = false;
      state.customResetMessage = null;
      state.isLoading = false;
      state.error = null;
    },
    setValuesUserData: (
      state,
      action: PayloadAction<Partial<TRegisterData>>
    ) => {
      if (!state.user) return; //например если пользователь не залогинен
      state.user = {
        ...state.user,
        ...action.payload
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // регистрация
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || action.error.message || 'Error';
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      // вход
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || action.error.message || 'Error';
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      // забыли пароль
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || action.error.message || 'Error';
        state.user = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customResetMessage = action.payload.message;
      })
      // сброс пароля
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || action.error.message || 'Error';
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customResetMessage = action.payload.message;
      })
      // Авторизация по токену - получение данных пользователя
      .addCase(checkAuthWithToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuthWithToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || action.error.message || 'Error';
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true; // проверка токена окончена
      })
      .addCase(checkAuthWithToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true; // проверка токена окончена
      })
      // обновление данных позльзователя
      .addCase(updateUserData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || action.error.message || 'Error';
        state.isAuthChecked = true; // ?
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthChecked = true; // ?
      })
      // выход
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || action.error.message || 'Error';
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.customResetMessage = action.payload.message;
      });
  }
});
export const { clearUser, setValuesUserData } = userSlice.actions;
export const userDataSelector = (state: RootState) => state.user.user;
export default userSlice.reducer;
export const isLoadingUserSelector = (state: RootState) => state.user.isLoading;
export const isAuthCheckedSelector = (state: RootState) =>
  state.user.isAuthChecked;
export const isUserSelector = (state: RootState) => state.user.user;
export const isErrorUserSelector = (state: RootState) => state.user.error;
