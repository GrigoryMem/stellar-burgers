import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch, AppDispatch } from '../../services/store';
import { updateBurgConstrIngreds } from '../../services/slices/constructorBurger/updateBurgerConsrIngreds';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch: AppDispatch = useDispatch();
    const handleMoveDown = () => {
      //  зачем ?
      console.log('handleMoveDown');
    };

    const handleMoveUp = () => {
      //  зачем ?
      console.log('handleMoveUp');
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
