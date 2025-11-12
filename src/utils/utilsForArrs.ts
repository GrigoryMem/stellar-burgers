// Общие
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { IngridientWithChoseCount } from 'src/services/slices/ingredients/ingredientSlice';

//  вернем найденный элемент и его индекс в массиве по ключу элемента(объект)
export const findElement = <T, K extends keyof T>(
  arr: T[],
  key: K,
  value: T[K]
): { element: T; index: number } | undefined => {
  const index = arr.findIndex((item) => item[key] === value);
  if (index === -1) return;
  return { element: arr[index], index };
};
// фильтруем элементы по типу ключа  напр type=== 'bun', чтобы получить все булки
export const filterElems = <T, K extends keyof T>(
  arr: T[],
  key: K,
  value: T[K]
): T[] => arr.filter((item) => item[key] === value);
//  построим массив элементов без элемента с указанным значение ключа
// напр id!=2
//  переделать!!!!!
export const filterWithoutElem = <T, K extends keyof T>(
  arr: T[],
  key: K,
  value: T[K]
): T[] => arr.filter((item) => item[key] !== value);

//  касателньо проекта

// создаем id каждому добавленном ингридиенту в корзине

export const divideIngridientsById = (
  ingredients: IngridientWithChoseCount[]
): TConstructorIngredient[] => {
  const arr = ingredients.reduce<TConstructorIngredient[]>((acc, item) => {
    const numberIngr = Number(item.count);
    if (numberIngr === 0 || !numberIngr) return acc;
    const countNumber = Number(item.count) || 0;
    for (let i = 1; i <= countNumber; i++) {
      //  создаем переменную для разделения ингридиентов по id
      let { count, ...rest } = item;
      let itemWithId = { ...rest, id: String(i) };
      acc.push(itemWithId);
    }
    return acc;
  }, []);
  return arr;
};
