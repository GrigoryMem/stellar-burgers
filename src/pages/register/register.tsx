import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, AppDispatch, useSelector } from '../../services/store';
import { registerUser } from '../../services/slices/user/actionsApi/thunks';
import { Preloader } from '@ui';
import { isLoadingUserSelector } from '../../services/slices/user/userSlice';

export const Register: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const loading = useSelector(isLoadingUserSelector);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    //  отправляем данные насервер для регистрации
    dispatch(registerUser({ name: userName, email, password }));
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <RegisterUI
      errorText=''
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
