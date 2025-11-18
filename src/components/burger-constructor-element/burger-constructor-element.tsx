import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import { updateBurgConstrIngreds } from '../../services/slices/constructorBurger/updateBurgerConsrIngreds';
import { replaceTwoElements } from '../../services/slices/constructorBurger/constrBurgSlice';
export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();
    //  можно ли переместить элемент вверх или вниз
    // totalItems - длина массива
    //  проверяем границы массива
    const isFirst = index === 0; //  это первый элемент?
    const isLast = index === totalItems - 1; // это последний элемент
    const handleMoveDown = () => {
      // если элемент не последний (который идет после нашего)
      if (!isLast) {
        const lowerIndex = index + 1; // получаем след за ним индекс
        const typeAction = {
          from: index,
          to: lowerIndex
        };
        dispatch(replaceTwoElements(typeAction));
      }
    };

    const handleMoveUp = () => {
      //  если эелмент не первый
      if (!isFirst) {
        const highIndex = index - 1; // если элемент не первый можем выполнить  перестановку назад
        const typeAction = {
          from: index,
          to: highIndex
        };
        dispatch(replaceTwoElements(typeAction));
      }
    };

    const handleClose = () => {
      console.log('handleClose');
      const typeAction = {
        type: 'decrement' as const, // теперь TS понимает, что это точно 'decrement'
        _id: ingredient._id
      };
      dispatch(updateBurgConstrIngreds(typeAction));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
