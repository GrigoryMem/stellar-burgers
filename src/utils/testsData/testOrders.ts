import { TOrder } from '@utils-types';

export const TestOrders: TOrder[] = [
  {
    _id: '673a9f1c45e812345678aaa1',
    status: 'done',
    name: 'Метеор-бургер',
    createdAt: '2025-12-04T10:15:30.000Z',
    updatedAt: '2025-12-04T10:20:10.000Z',
    number: 12345,
    ingredients: [
      '60d3b41abdacab0026a733c6',
      '60d3b41abdacab0026a733cd',
      '60d3b41abdacab0026a733ce',
      '60d3b41abdacab0026a733c6'
    ],
    price: 450
  },
  {
    _id: '673a9f1c45e812345678aaa2',
    status: 'pending',
    name: 'Космо-дог',
    createdAt: '2025-12-05T08:10:00.000Z',
    updatedAt: '2025-12-05T08:10:00.000Z',
    number: 12346,
    ingredients: [
      '60d3b41abdacab0026a733c1',
      '60d3b41abdacab0026a733d1',
      '60d3b41abdacab0026a733d2'
    ],
    price: 310
  },
  {
    _id: '673a9f1c45e812345678aaa3',
    status: 'created',
    name: 'Галактический супрем',
    createdAt: '2025-12-06T12:45:20.000Z',
    updatedAt: '2025-12-06T12:45:20.000Z',
    number: 12347,
    ingredients: [
      '60d3b41abdacab0026a733c6',
      '60d3b41abdacab0026a733dd',
      '60d3b41abdacab0026a733de',
      '60d3b41abdacab0026a733df'
    ],
    price: 520
  }
];
