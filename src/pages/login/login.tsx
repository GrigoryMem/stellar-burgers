import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, AppDispatch, useSelector } from '../../services/store';
import { loginUser } from '../../services/slices/user/actionsApi/thunks';
import { isLoadingUserSelector } from '../../services/slices/user/userSlice';
import { Preloader } from '@ui';
export const Login: FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loading = useSelector(isLoadingUserSelector);
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    //  отправляем запрос на вход в систему
    dispatch(loginUser({ email, password }));
  };
  if (loading) {
    return <Preloader />;
  }

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
