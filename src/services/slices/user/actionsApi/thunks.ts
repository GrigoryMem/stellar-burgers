import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  TRegisterData
} from 'src/utils/burger-api';
import { clearUser, TLoginData, userActions } from '../userSlice';
import { deleteCookie, setCookie } from 'src/utils/cookie';
import { TUser } from '@utils-types';

const registr = userActions.registr;
const login = userActions.login;
const forgot = userActions.forgot;
const reset = userActions.reset;
const checkAuthAccessToken = userActions.checkAuthAccessToken;
const updateUser = userActions.updateUser;
const logout = userActions.logout;

export const registerUser = createAsyncThunk(
  registr,
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
    } catch (error) {
      // чтобы иметь чёткий текст ошибки для UI.
      // rejectWithValue позволяет передать свой payload для ошибки,
      // который потом будет доступен в редьюсере через action.payload.
      return thunkApi.rejectWithValue(
        `Ошибка регистрации пользователя: ${error}`
      );
    }
  }
);
// Вход
export const loginUser = createAsyncThunk(
  login,
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
    } catch (error) {
      // чтобы иметь чёткий текст ошибки для UI.
      // rejectWithValue позволяет передать свой payload для ошибки,
      // который потом будет доступен в редьюсере через action.payload.
      return thunkApi.rejectWithValue(`Ошибка входа пользователя: ${error}`);
    }
  }
);

//  забыли пароль

export const forgotPassword = createAsyncThunk(
  forgot,
  async (email: string, thunkApi) => {
    try {
      const data = await forgotPasswordApi({ email });
      return data;
    } catch (error) {
      // чтобы иметь чёткий текст ошибки для UI.
      // rejectWithValue позволяет передать свой payload для ошибки,
      // который потом будет доступен в редьюсере через action.payload.
      return thunkApi.rejectWithValue(
        `Ошибка "забыли пароль" пользователя: ${error}`
      );
    }
  }
);

// сброс пароля
export const resetPassword = createAsyncThunk(
  reset,
  //  не забудь получить рефреш токен из хранилища
  async (data: { password: string; token: string }, thunkApi) => {
    try {
      const res = await resetPasswordApi(data);
      return res;
    } catch (error) {
      // чтобы иметь чёткий текст ошибки для UI.
      // rejectWithValue позволяет передать свой payload для ошибки,
      // который потом будет доступен в редьюсере через action.payload.
      return thunkApi.rejectWithValue(`Ошибка сброса пароля: ${error}`);
    }
  }
);

// авторизация по токену доступа

export const checkAuthWithToken = createAsyncThunk(
  checkAuthAccessToken,
  async (_, thunkApi) => {
    try {
      const data = await getUserApi(); // вернём объект { success, user }
      // вернем данные пользователя
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(`Ошибка авторизации: ${error}`);
    }
  }
);

// обновить данные пользователя
export const updateUserData = createAsyncThunk(
  updateUser,
  async (user: Partial<TRegisterData>, thunkApi) => {
    try {
      const data = await getUserApi(); // вернём объект { success, user }
      // вернем данные пользователя
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(`Ошибка обновления данных: ${error}`);
    }
  }
);

//  выход из системы
export const logoutUser = createAsyncThunk(logout, async (_, thunkApi) => {
  try {
    const data = await logoutApi(); // вернём объект { success, user }
    // удалим токены
    localStorage.clear();
    deleteCookie('accessToken');
    // удалим данные пользователя из хранилища
    thunkApi.dispatch(clearUser());
    // вернем данные выхода из системы
    return data;
  } catch (error) {
    return thunkApi.rejectWithValue(`Ошибка выхода из системы: ${error}`);
  }
});
