import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import {
  userDataSelector,
  setValuesUserData
} from '../../services/slices/user/userSlice';
import { useSelector, useDispatch } from '../../services/store';
import {
  checkAuthWithToken,
  updateUserData
} from '../../services/slices/user/actionsApi/thunks';
import {
  isLoadingUserSelector,
  isAuthenticated
} from '../../services/slices/user/userSlice';
import { Preloader } from '@ui';

export const Profile: FC = () => {
  /** TODO: взять переменную из стора */
  const authenticated = useSelector(isAuthenticated);
  const isLoading = useSelector(isLoadingUserSelector);
  const userData = useSelector(userDataSelector);
  // const user = {
  //   name: userData?.name || '',
  //   email: userData?.email || ''
  // };
  const dispatch = useDispatch();
  // Инициализируем локальное состояние формы данными из стора
  // когда данные пользователя уже пришли.- запишем их в фомру
  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });
  // Используем этот эффект для синхронизации локального состояния
  useEffect(() => {
    if (!userData) return; // ждём userData
    // когда данные пришли встор при монтировании запишем их в полянашей формы
    setFormValue((prev) => ({
      name: prev.name || userData.name,
      email: prev.email || userData.email,
      password: prev.password || ''
    }));
  }, [userData]);
  //  сравниваем локальное состояние формы(что сейчас ввели) с данными из стора
  const isFormChanged =
    formValue.name !== userData?.name || formValue.email !== userData?.email;
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    // отправляем данные из ЛОКАЛЬНОГО СОСТОЯНИЯ ФОРМЫ на сервер
    dispatch(updateUserData(formValue));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    // Сбрасываем локальное состояние формы к текущим значениям из стора
    setFormValue({
      name: userData?.name as string,
      email: userData?.email as string,
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

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
