import { TOrder, TReadyOrder } from '@utils-types';

export type FeedUIProps = {
  orders: TOrder[] | TReadyOrder[];
  // orders: TOrder[];
  handleGetFeeds: () => void;
};
