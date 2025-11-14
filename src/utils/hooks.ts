import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useGoBack = (steps = 1) => {
  const navigate = useNavigate();

  const goBack = useCallback(() => {
    navigate(-steps);
  }, [navigate, steps]);

  return goBack;
};
