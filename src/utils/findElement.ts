//  вернем найденный элемент и его индекс в массиве
export const findElement = <T, K extends keyof T>(
  arr: T[],
  key: K,
  value: T[K]
): { element: T; index: number } | undefined => {
  const index = arr.findIndex((item) => item[key] === value);
  if (index === -1) return;
  return { element: arr[index], index };
};
