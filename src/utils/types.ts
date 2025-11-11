// ингридиент
export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
};
// ингредиент, добавленный пользователем в конструктор
export type TConstructorIngredient = TIngredient & {
  id: string; // уникальный id в конструкторе
};
// тип заказа
export type TOrder = {
  _id: string;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  ingredients: string[];
};
//  список заказов
export type TOrdersData = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export type TUser = {
  email: string;
  name: string;
};
// тип вкладок
// 'bun' — булки,

// 'sauce' — соусы,

// 'main' — начинки (основные ингредиенты).
export type TTabMode = 'bun' | 'sauce' | 'main';
