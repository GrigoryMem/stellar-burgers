import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch, AppDispatch } from '../../services/store';
import { updateBurgConstrIngreds } from '../../services/slices/constructorBurger/updateBurgerConsrIngreds';
import { replaceTwoElements } from '../../services/slices/constructorBurger/constrBurgSlice';
export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch: AppDispatch = useDispatch();
    const handleMoveDown = () => {
      const lowerIndex = index - 1;
      const typeAction = {
        from: index,
        to: lowerIndex
      };
      dispatch(replaceTwoElements(typeAction));
    };

    const handleMoveUp = () => {
      const highIndex = index + 1;
      const typeAction = {
        from: index,
        to: highIndex
      };
      dispatch(replaceTwoElements(typeAction));
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
