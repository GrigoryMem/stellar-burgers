import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { isUserSelector } from '../../services/slices/user/userSlice';

export const AppHeader: FC = () => {
  const user = useSelector(isUserSelector);
  return <AppHeaderUI userName={user?.name as string} />;
};
