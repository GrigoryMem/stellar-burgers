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
export const filterWithoutElem = <T, K extends keyof T>(
  arr: T[],
  key: K,
  value: T[K]
): T[] => arr.filter((item) => item[key] !== value);
