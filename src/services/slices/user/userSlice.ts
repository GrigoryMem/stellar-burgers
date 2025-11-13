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

export const userActions = {
  registr: 'user/registr',
  login: 'user/login',
  forgot: 'user/forgotPassword',
  reset: 'user/resetPassword',
  logout: 'user/logout',
  checkAuthAccessToken: 'user/checkAuthByToken',
  updateUser: 'user/updateUser'
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
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isAuthChecked = false;
      state.customResetMessage = null;
      state.isLoading = false;
      state.error = null;
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
      // Авторизация по токену
      .addCase(checkAuthWithToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isAuthChecked = false;
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
        state.isAuthChecked = true;
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
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
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
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = false;
        state.customResetMessage = action.payload.message;
      });
  }
});
export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
