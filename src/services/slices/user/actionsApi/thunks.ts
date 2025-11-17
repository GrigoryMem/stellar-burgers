import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  TRegisterData,
  updateUserApi
} from '../../../../utils/burger-api';
import { clearUser, TLoginData } from '../userSlice';
import { deleteCookie, setCookie } from '../../../../utils/cookie';
import { TErrorResp, TUser } from '@utils-types';

export const userActions = {
  registr: 'user/registr',
  login: 'user/login',
  forgot: 'user/forgotPassword',
  reset: 'user/resetPassword',
  logout: 'user/logout',
  checkAuthAccessToken: 'user/checkAuthByToken',
  updateUser: 'user/updateUser'
};

export const registerUser = createAsyncThunk(
  userActions.registr,
  async ({ name, email, password }: TRegisterData, thunkApi) => {
    try {
      const data = await registerUserApi({ name, email, password });
      // устанавливаем в хранилище новую связку access- и refresh-токенов
      // document.cookie = `token=${data.accessToken.split('Bearer ')[1]}`
      //  установка резервного токена в localStorage
      localStorage.setItem('refreshToken', data.refreshToken);
      // установка основного токена в куки бразуером
      setCookie('accessToken', data.accessToken);
      return data;
    } catch (error: TErrorResp | unknown) {
      const textError = (error as TErrorResp).message;
      return thunkApi.rejectWithValue(
        `Ошибка регистрации пользователя: ${textError}` || 'Неизвестная ошибка'
      );
    }
  }
);
// Вход
export const loginUser = createAsyncThunk(
  userActions.login,
  async ({ email, password }: TLoginData, thunkApi) => {
    try {
      const data = await loginUserApi({ email, password });
      // устанавливаем в хранилище новую связку access- и refresh-токенов
      // document.cookie = `token=${data.accessToken.split('Bearer ')[1]}`
      //  установка резервного токена в localStorage
      localStorage.setItem('refreshToken', data.refreshToken);
      // установка основного токена в куки бразуером
      setCookie('accessToken', data.accessToken);
      return data;
    } catch (error: TErrorResp | unknown) {
      const textError = (error as TErrorResp).message;
      return thunkApi.rejectWithValue(
        `Ошибка входа пользователя: ${textError}` || 'Неизвестная ошибка'
      );
    }
  }
);

//  забыли пароль

export const forgotPassword = createAsyncThunk(
  userActions.forgot,
  async ({ email }: { email: string }, thunkApi) => {
    try {
      const data = await forgotPasswordApi({ email });
      return data;
    } catch (error: TErrorResp | unknown) {
      const textError = (error as TErrorResp).message;
      return thunkApi.rejectWithValue(
        `Ошибка ввода забыли пароль пользователя: ${textError}` ||
          'Неизвестная ошибка'
      );
    }
  }
);

// сброс пароля
export const resetPassword = createAsyncThunk(
  userActions.reset,
  //  не забудь получить рефреш токен из хранилища
  async (data: { password: string; token: string }, thunkApi) => {
    try {
      const res = await resetPasswordApi(data);
      return res;
    } catch (error: TErrorResp | unknown) {
      const textError = (error as TErrorResp).message;
      return thunkApi.rejectWithValue(
        `Ошибка сброса пароля пользователя: ${textError}` ||
          'Неизвестная ошибка'
      );
    }
  }
);

// авторизация по токену доступа
//  получаем данные пользователя
export const checkAuthWithToken = createAsyncThunk(
  userActions.checkAuthAccessToken,
  async (_, thunkApi) => {
    try {
      const data = await getUserApi(); // вернём объект { success, user }
      // вернем данные пользователя
      return data;
    } catch (error: TErrorResp | unknown) {
      const textError = (error as TErrorResp).message;
      return thunkApi.rejectWithValue(
        `Ошибка получения данных: ${textError}` || 'Неизвестная ошибка'
      );
    }
  }
);

// обновить данные пользователя
export const updateUserData = createAsyncThunk(
  userActions.updateUser,
  async (user: Partial<TRegisterData>, thunkApi) => {
    try {
      const data = await updateUserApi(user); // вернём объект { success, user }
      // вернем данные пользователя
      return data;
    } catch (error: TErrorResp | unknown) {
      const textError = (error as TErrorResp).message;
      return thunkApi.rejectWithValue(
        `Ошибка обновления данных: ${textError}` || 'Неизвестная ошибка'
      );
    }
  }
);

//  выход из системы
export const logoutUser = createAsyncThunk(
  userActions.logout,
  async (_, thunkApi) => {
    try {
      const data = await logoutApi(); // вернём объект { success, user }
      // удалим токены
      localStorage.clear();
      deleteCookie('accessToken');
      // удалим данные пользователя из хранилища
      thunkApi.dispatch(clearUser());
      // вернем данные выхода из системы
      return data;
    } catch (error: TErrorResp | unknown) {
      const textError = (error as TErrorResp).message;
      return thunkApi.rejectWithValue(
        `Ошибка выхода из системы: ${textError}` || 'Неизвестная ошибка'
      );
    }
  }
);
