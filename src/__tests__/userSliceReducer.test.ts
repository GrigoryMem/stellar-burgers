import { expect, test, describe } from '@jest/globals';
import userSliceReducer, { AuthState } from '../services/slices/user/userSlice';
import { TIngredient, TOrder } from '@utils-types';
import { createDeepCopyObj } from '../utils/utils';
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  checkAuthWithToken,
  updateUserData,
  logoutUser
} from '../services/slices/user/actionsApi/thunks';
import {
  registerSuccessResponse,
  testRegisterData,
  testUser,
  testLoginData,
  loginSuccessResponse,
  testEmail,
  forgotPasswordResponse,
  resetPasswordResponse,
  testPasswordWithCodefromLetter,
  userWithTokenResponse,
  updateUserSuccessResponse,
  logoutResponse
} from '../utils/testsData/testUser';
import { error } from '../utils/testsData/testErrors';

describe('обработка экшенов(при выполнении асинхр запроса) редюсером хранения данных пользователя ', () => {
  // обозначим начальное состояние 'заказа'
  let initialState: AuthState;
  beforeEach(() => {
    // при каждом тесте инициализируем начальное состояние
    initialState = {
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      isAuthChecked: false,
      customResetMessage: null
    };
  });
  describe('регистрация пользователя', () => {
    test('регистрация: загрузка', () => {
      const expectedUser = {
        user: null,
        isLoading: true,
        error: null,
        isAuthenticated: false,
        isAuthChecked: false,
        customResetMessage: null
      };
      const actualState = userSliceReducer(
        {
          ...initialState
        },
        registerUser.pending('', testRegisterData)
      );
      expect(actualState).toEqual(expectedUser);
    });

    test('регистрация: получение данных пользователя', () => {
      const expectedUser = {
        user: createDeepCopyObj(testRegisterData),
        isLoading: false,
        error: null,
        isAuthenticated: true,
        isAuthChecked: false,
        customResetMessage: null
      };
      const actualState = userSliceReducer(
        {
          ...initialState,
          isLoading: true
        },
        //  1 - что ожидаем получить в ответ
        //  3 - что отправляе при регистрациии
        registerUser.fulfilled(registerSuccessResponse, '', testRegisterData)
      );
      expect(actualState).toEqual(expectedUser);
    });
    test('регистрация: отклонено', () => {
      const expectedUser = {
        user: null,
        isLoading: false,
        error: error.message,
        isAuthenticated: false,
        isAuthChecked: false,
        customResetMessage: null
      };
      const actualState = userSliceReducer(
        {
          ...initialState,
          isLoading: true
        },
        registerUser.rejected(error, '', testRegisterData)
      );
      expect(actualState).toEqual(expectedUser);
    });
  });
  describe('вход пользователя', () => {
    test('вход: загрузка', () => {
      const expectedUser = {
        user: null,
        isLoading: true,
        error: null,
        isAuthenticated: false,
        isAuthChecked: false,
        customResetMessage: null
      };
      const actualState = userSliceReducer(
        {
          ...initialState
        },
        loginUser.pending('', testLoginData)
      );
      expect(actualState).toEqual(expectedUser);
    });

    test('вход: получение данных пользователя', () => {
      const expectedUser = {
        user: createDeepCopyObj(testUser),
        isLoading: false,
        error: null,
        isAuthenticated: true,
        isAuthChecked: false,
        customResetMessage: null
      };
      const actualState = userSliceReducer(
        {
          ...initialState,
          isLoading: true
        },
        //  1 - что ожидаем получить в ответ
        //  3 - что отправляе при входе - почту и пароль
        loginUser.fulfilled(loginSuccessResponse, '', testLoginData)
      );
      expect(actualState).toEqual(expectedUser);
    });
    test('вход: отклонено', () => {
      const expectedUser = {
        user: null,
        isLoading: false,
        error: error.message,
        isAuthenticated: false,
        isAuthChecked: false,
        customResetMessage: null
      };
      const actualState = userSliceReducer(
        {
          ...initialState,
          isLoading: true
        },
        loginUser.rejected(error, '', testLoginData)
      );
      expect(actualState).toEqual(expectedUser);
    });
  });
  describe('сброс пароля', () => {
    test('сброс пароля: загрузка', () => {
      const expectedUser = {
        user: null,
        isLoading: true,
        error: null,
        isAuthenticated: false,
        isAuthChecked: false,
        customResetMessage: null
      };
      const actualState = userSliceReducer(
        {
          ...initialState
        },
        //  сбрасываем пароль с помощью кода из письма
        resetPassword.pending('', testPasswordWithCodefromLetter)
      );
      expect(actualState).toEqual(expectedUser);
    });

    test('сброс пароля: успех', () => {
      const expectedUser = {
        user: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,
        isAuthChecked: false,
        customResetMessage: 'Password successfully reset'
      };
      const actualState = userSliceReducer(
        {
          ...initialState,
          isLoading: true
        },
        //  1 - что ожидаем получить в ответ
        //  3 - что отправляе при сбросе пароля - почту и пароль
        resetPassword.fulfilled(
          resetPasswordResponse,
          '',
          testPasswordWithCodefromLetter
        )
      );
      expect(actualState).toEqual(expectedUser);
    });
    test('сброс пароля: отклонено', () => {
      const expectedUser = {
        user: null,
        isLoading: false,
        error: error.message,
        isAuthenticated: false,
        isAuthChecked: false,
        customResetMessage: null
      };
      const actualState = userSliceReducer(
        {
          ...initialState,
          isLoading: true
        },
        resetPassword.rejected(error, '', testPasswordWithCodefromLetter)
      );
      expect(actualState).toEqual(expectedUser);
    });
  });
  describe('забыли пароль', () => {
    test('забыли пароль: загрузка', () => {
      const expectedUser = {
        user: null,
        isLoading: true,
        error: null,
        isAuthenticated: false,
        isAuthChecked: false,
        customResetMessage: null
      };
      const actualState = userSliceReducer(
        {
          ...initialState
        },
        // вводим тестовую почту
        forgotPassword.pending('', testEmail)
      );
      expect(actualState).toEqual(expectedUser);
    });

    test('забыли пароль: позитивный ответ', () => {
      const expectedUser = {
        user: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,
        isAuthChecked: false,
        customResetMessage: 'Reset email sent'
      };
      const actualState = userSliceReducer(
        {
          ...initialState,
          isLoading: true
        },
        //  1 - что ожидаем получить в ответ
        //  3 - что отправляе в поле забыли пароль
        forgotPassword.fulfilled(forgotPasswordResponse, '', testEmail)
      );
      expect(actualState).toEqual(expectedUser);
    });
    test('забыли пароль: отклонено', () => {
      const expectedUser = {
        user: null,
        isLoading: false,
        error: error.message,
        isAuthenticated: false,
        isAuthChecked: false,
        customResetMessage: null
      };
      const actualState = userSliceReducer(
        {
          ...initialState,
          isLoading: true
        },
        forgotPassword.rejected(error, '', testEmail)
      );
      expect(actualState).toEqual(expectedUser);
    });
  });
  describe('авторизация пользователя', () => {
    test('авторизация: загрузка', () => {
      const expectedUser = {
        user: null,
        isLoading: true,
        error: null,
        isAuthenticated: false,
        isAuthChecked: false,
        customResetMessage: null
      };
      const actualState = userSliceReducer(
        {
          ...initialState
        },
        checkAuthWithToken.pending('')
      );
      expect(actualState).toEqual(expectedUser);
    });

    test('авторизация: получение данных пользователя', () => {
      const expectedUser = {
        user: createDeepCopyObj(testUser),
        isLoading: false,
        error: null,
        //  мы авторизованы
        isAuthenticated: true,
        //  проверка токеном была пройдена
        isAuthChecked: true,
        customResetMessage: null
      };
      const actualState = userSliceReducer(
        {
          ...initialState,
          isLoading: true
        },
        //  1 - что ожидаем получить в ответ
        //  3 - что отправляе при авторизации
        checkAuthWithToken.fulfilled(userWithTokenResponse, '')
      );
      expect(actualState).toEqual(expectedUser);
    });
    test('авторизация: отклонено', () => {
      const expectedUser = {
        user: null,
        isLoading: false,
        error: error.message,
        // доступа нет
        isAuthenticated: false,
        //  проверка авторизации пройдена отрицательно
        isAuthChecked: true,
        customResetMessage: null
      };
      const actualState = userSliceReducer(
        {
          ...initialState,
          isLoading: true
        },
        checkAuthWithToken.rejected(error, '')
      );
      expect(actualState).toEqual(expectedUser);
    });
  });
  describe('изменение данных пользователя', () => {
    test('изменение данных: загрузка', () => {
      const expectedUser = {
        user: null,
        isLoading: true,
        error: null,
        isAuthenticated: false,
        isAuthChecked: false,
        customResetMessage: null
      };
      const actualState = userSliceReducer(
        {
          ...initialState
        },
        updateUserData.pending('', testUser)
      );
      expect(actualState).toEqual(expectedUser);
    });

    test('изменение данных: успех', () => {
      const expectedUser = {
        user: createDeepCopyObj(testUser),
        isLoading: false,
        error: null,
        isAuthenticated: false,
        isAuthChecked: true,
        customResetMessage: null
      };
      const actualState = userSliceReducer(
        {
          ...initialState,
          isLoading: true
        },
        //  1 - что ожидаем получить в ответ
        //  3 - что отправляе при изменении данных - почту пароль или имя
        updateUserData.fulfilled(
          updateUserSuccessResponse,
          '',
          testRegisterData
        )
      );
      expect(actualState).toEqual(expectedUser);
    });
    test('изменение данных: отклонено', () => {
      const expectedUser = {
        user: null,
        isLoading: false,
        error: error.message,
        isAuthenticated: false,
        isAuthChecked: true,
        customResetMessage: null
      };
      const actualState = userSliceReducer(
        {
          ...initialState,
          isLoading: true
        },
        updateUserData.rejected(error, '', testRegisterData)
      );
      expect(actualState).toEqual(expectedUser);
    });
  });
  describe('выход пользователя', () => {
    test('выход: ожидание', () => {
      const expectedUser = {
        user: null,
        isLoading: true,
        error: null,
        isAuthenticated: false,
        isAuthChecked: false,
        customResetMessage: null
      };
      const actualState = userSliceReducer(
        {
          ...initialState
        },
        logoutUser.pending('')
      );
      expect(actualState).toEqual(expectedUser);
    });

    test('выход: успех', () => {
      const expectedUser = {
        user: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,
        isAuthChecked: true,
        customResetMessage: 'User logged out'
      };
      const actualState = userSliceReducer(
        {
          ...initialState,
          isLoading: true
        },
        //  1 - что ожидаем получить в ответ выходе
        logoutUser.fulfilled(logoutResponse, '')
      );
      expect(actualState).toEqual(expectedUser);
    });
    test('выход: отклонено', () => {
      const expectedUser = {
        user: null,
        isLoading: false,
        error: error.message,
        isAuthenticated: false,
        isAuthChecked: true,
        customResetMessage: null
      };
      const actualState = userSliceReducer(
        {
          ...initialState,
          isLoading: true
        },
        logoutUser.rejected(error, '')
      );
      expect(actualState).toEqual(expectedUser);
    });
  });
});
