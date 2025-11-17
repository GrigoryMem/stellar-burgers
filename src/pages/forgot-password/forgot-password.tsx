import { FC, useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, AppDispatch, useSelector } from '../../services/store';
import { forgotPassword } from '../../services/slices/user/actionsApi/thunks';
import {
  isLoadingUserSelector,
  isErrorUserSelector
} from '../../services/slices/user/userSlice';

import { forgotPasswordApi } from '@api';
import { ForgotPasswordUI } from '@ui-pages';
import { Preloader } from '@ui';

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const dispatch: AppDispatch = useDispatch();
  const errorFromStore = useSelector(isErrorUserSelector);
  const loading = useSelector(isLoadingUserSelector);
  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    // unwrap() позволяет получить реальный результат из Promise, который возвращает асинхронная операция, вместо объекта с промисом.
    dispatch(forgotPassword({ email }))
      .unwrap() // получаем реальный промис из thunk
      .then(() => {
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password', { replace: true });
      })
      .catch((err) => setError(err));
  };
  if (loading) {
    return <Preloader />;
  }

  return (
    <ForgotPasswordUI
      errorText={error?.message}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
