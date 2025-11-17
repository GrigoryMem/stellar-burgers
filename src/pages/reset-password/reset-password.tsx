import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, AppDispatch, useSelector } from '../../services/store';
import {
  isLoadingUserSelector,
  isErrorUserSelector
} from '../../services/slices/user/userSlice';
import { ResetPasswordUI } from '@ui-pages';
import { resetPassword } from '../../services/slices/user/actionsApi/thunks';
import { Preloader } from '@ui';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const loading = useSelector(isLoadingUserSelector);
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState<Error | null>(null);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);
    //  для отражения состояния в сторе - нам нужна ошибка или ззагрузка
    dispatch(resetPassword({ password, token }))
      .unwrap() // распаковка промиса
      .then(() => {
        // после сброса пароля выполяем вход занво с новым паролем
        localStorage.removeItem('resetPassword');
        navigate('/login');
      })
      .catch((err) => setError(err));
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);
  if (loading) {
    return <Preloader />;
  }
  return (
    <ResetPasswordUI
      errorText={error?.message}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
