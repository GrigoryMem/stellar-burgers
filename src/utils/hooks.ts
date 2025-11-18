import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector, useStore } from 'react-redux';
import type { AppDispatch, AppStore, RootState } from '../services/store'
export const useGoBack = (steps = 1) => {
  const navigate = useNavigate();

  const goBack = useCallback(() => {
    navigate(-steps);
  }, [navigate, steps]);

  return goBack;
};

//  для Redux Toolkit
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
//  хранилище
export const useAppStore = useStore.withTypes<AppStore>();
