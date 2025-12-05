import { TAuthResponse, TRegisterData } from '@api';
import { TUser } from '@utils-types';
import { TLoginData } from '../../services/slices/user/userSlice';

export const testUser = {
  email: 'john.doe@example.com',
  name: 'John Doe',
  password: 'password123'
};
// Данные для регистрации
export const testRegisterData: TRegisterData = {
  email: 'new.user@example.com',
  password: 'password123',
  name: 'New User'
};

//  ответ успешной регистрации

export const registerSuccessResponse: TAuthResponse = {
  success: true,
  user: testRegisterData,
  accessToken: 'Bearer access_token_123',
  refreshToken: 'refresh_token_123'
};

// Данные для входа

export const testLoginData: TLoginData = {
  email: 'john.doe@example.com',
  password: 'password123'
};
//  при успешном входе получим
export const loginSuccessResponse = {
  success: true,
  user: testUser,
  accessToken: 'Bearer access_token_456',
  refreshToken: 'refresh_token_456'
};

//  забыли пароль

export const testEmail: { email: string } = {
  email: 'john.doe@example.com'
};

//  успешный ответ при забыли пароль

export const forgotPasswordResponse = {
  success: true,
  message: 'Reset email sent'
};

//  сбросить пароль
export const testPasswordWithCodefromLetter = {
  password: '12345678qwerty!',
  token: 'Bearer access_token_456'
};
//  ответ на сброс пароля
export const resetPasswordResponse = {
  success: true,
  message: 'Password successfully reset'
};
//  успешный ответ при авторизации с токеном
export const userWithTokenResponse = {
  success: true,
  user: testUser
};

//  ответ при успешном обновлении данных пользователя
export const updateUserSuccessResponse = {
  success: true,
  user: {
    ...testUser
  }
};

//  тест ответ на выход из аккаунта
export const logoutResponse = {
  success: true,
  message: 'User logged out'
};
