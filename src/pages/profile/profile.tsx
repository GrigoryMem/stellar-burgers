import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import {
  userDataSelector,
  setValuesUserData
} from '../../services/slices/user/userSlice';
import { useSelector, AppDispatch, useDispatch } from '../../services/store';
import {
  checkAuthWithToken,
  updateUserData
} from '../../services/slices/user/actionsApi/thunks';

export const Profile: FC = () => {
  /** TODO: взять переменную из стора */
  const userData = useSelector(userDataSelector);
  const user = {
    name: userData?.name || '',
    email: userData?.email || ''
  };
  const dispatch: AppDispatch = useDispatch();
  // Инициализируем локальное состояние формы данными из стора
  const [formValue, setFormValue] = useState({
    name: user.name,
    email: user.email,
    password: ''
  });
  // Используем этот эффект для синхронизации локального состояния
  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user.name, user.email]);

  // получаем  данные пользователя при загр  если пользователь авторизован
  useEffect(() => {
    // загружаем полученные данных если они есть
    dispatch(checkAuthWithToken());
  }, [dispatch]);
  //  сравниваем локальное состояние формы(что сейчас ввели) с данными из стора
  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    // отправляем данные из ЛОКАЛЬНОГО СОСТОЯНИЯ ФОРМЫ на сервер
    dispatch(updateUserData(formValue));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    // Сбрасываем локальное состояние формы к текущим значениям из стора
    setFormValue({
      name: user.name,
      email: user.email,
      // очистка пароля
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );

  return null;
};
