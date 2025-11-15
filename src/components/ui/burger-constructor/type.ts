import { TNewOrderResponse } from '@api';
import { TOrder } from '@utils-types';

export type BurgerConstructorUIProps = {
  constructorItems: any;
  orderRequest: boolean;
  price: number;
  // orderModalData: TOrder | null;
  orderModalData: TNewOrderResponse | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
  disabled?: boolean;
};
