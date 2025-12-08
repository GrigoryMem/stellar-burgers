import { TIngredient } from '../types';

export function resolveAfterDelay<T>(
  value: T,
  delayMs: number = 0
): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value);
    }, delayMs);
  });
}

// Массив тестовых данных
export const testIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Булка традиционная',
    type: 'bun',
    proteins: 8,
    fat: 3,
    carbohydrates: 25,
    calories: 180,
    price: 50,
    image: 'https://example.com/images/bun.png',
    image_large: 'https://example.com/images/bun_large.png',
    image_mobile: 'https://example.com/images/bun_mobile.png'
  },
  {
    _id: '2',
    name: 'Котлета из говядины',
    type: 'main',
    proteins: 20,
    fat: 15,
    carbohydrates: 0,
    calories: 250,
    price: 120,
    image: 'https://example.com/images/beef.png',
    image_large: 'https://example.com/images/beef_large.png',
    image_mobile: 'https://example.com/images/beef_mobile.png'
  },
  {
    _id: '3',
    name: 'Соус фирменный острый',
    type: 'sauce',
    proteins: 2,
    fat: 10,
    carbohydrates: 5,
    calories: 120,
    price: 30,
    image: 'https://example.com/images/sauce.png',
    image_large: 'https://example.com/images/sauce_large.png',
    image_mobile: 'https://example.com/images/sauce_mobile.png'
  }
];
