import { getFeedsApi, TFeedsResponse } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { RootState } from 'src/services/store';

type TMainOptions = {
  loading: boolean;
  error: string | null;
};
//  лента всех заказов
type TFeedState = TMainOptions & {
  ordersFeed: TOrder[];
  total: number;
  totalToday: number;
};
//  история заказов авториз пользователя
type TUserOrdersState = TMainOptions & {
  ordersHistory: TOrder[];
};

type CommonOrdersState = {
  feedOrders: TFeedState;
  userOrders: TUserOrdersState;
  selectOrder: TOrder | null;
};

const initialState: CommonOrdersState = {
  feedOrders: {
    loading: false,
    error: null,
    ordersFeed: [],
    total: 0,
    totalToday: 0
  },
  userOrders: {
    loading: false,
    error: null,
    ordersHistory: []
  },
  selectOrder: null
};
// // получаем ленту заказов
// export const getAnyOrders = (actionName: string, apiClient: any) => {

//     // const 

// };


export const getFeedOrders = createAsyncThunk(
  'feedOrders/getFeedOrders',
  async (_, thunkApi) => {
    try {
      const data = await getFeedsApi();
      return data;
    } catch (error) {
      // чтобы иметь чёткий текст ошибки для UI.
      // rejectWithValue позволяет передать свой payload для ошибки,
      // который потом будет доступен в редьюсере через action.payload.
      return thunkApi.rejectWithValue(`Error: ${error}`);
    }
  }
);

const feedOrdersSlice = createSlice({
  name: 'AllOrders',
  initialState,
  reducers: {
    
  }
});

export default feedOrdersSlice.reducer;
