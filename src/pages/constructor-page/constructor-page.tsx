import { useSelector } from '../../services/store';
import styles from './constructor-page.module.css';
import {
  getIngredients,
  loadingSelector
} from '../../services/slices/ingredients/ingredientSlice';
import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC } from 'react';
import { useDispatch, AppDispatch } from '../../services/store';
import { useEffect } from 'react';

export const ConstructorPage: FC = () => {
  const isIngredientsLoading = useSelector(loadingSelector);

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    // загружаем ингридиенты в гаш стор
    dispatch(getIngredients());
  }, []);
  return (
    <>
      {isIngredientsLoading ? (
        <Preloader />
      ) : (
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};
