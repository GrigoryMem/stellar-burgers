import { TLoginData } from 'src/services/slices/user/userSlice';
import { setCookie, getCookie } from './cookie';
import { TIngredient, TOrder, TOrdersData, TUser } from './types';
// Проверка ответа сервера
const URL = process.env.BURGER_API_URL;

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));
// Типы для ответов сервера
type TServerResponse<T> = {
  success: boolean;
} & T;

type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;
// Обновление токена (refresh token)
// чтобы пользователь не вылетал из системы, когда accessToken устаревает.
export const refreshToken = (): Promise<TRefreshResponse> =>
  fetch(`${URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  })
    .then((res) => checkResponse<TRefreshResponse>(res))
    .then((refreshData) => {
      if (!refreshData.success) {
        return Promise.reject(refreshData);
      }
      localStorage.setItem('refreshToken', refreshData.refreshToken);
      setCookie('accessToken', refreshData.accessToken);
      return refreshData;
    });
// Универсальная функция fetchWithRefresh
export const fetchWithRefresh = async <T>(
  url: RequestInfo,
  // Тип RequestInfo — это строка или объект URL
  options: RequestInit
  // Тип RequestInit — это объект с настройками запроса
) => {
  try {
    const res = await fetch(url, options);
    return await checkResponse<T>(res);
  } catch (err) {
    if ((err as { message: string }).message === 'jwt expired') {
      // ловим ошибку если токен устарел 'jwt expired'
      // Пытаемся обновить его запросом
      const refreshData = await refreshToken();
      // вставляет новый accessToken в заголовки;
      if (options.headers) {
        // Это type assertion — принудительное указание типа в TypeScript.
        (options.headers as { [key: string]: string }).authorization =
          refreshData.accessToken; // добавляем токен достпа в заголовки запроса
      }
      // повторяет запрос новым токеном
      const res = await fetch(url, options);
      return await checkResponse<T>(res);
    } else {
      // Если ошибка не связана с токеном —  напр по др техничеким причинам просто выбрасываем ее
      return Promise.reject(err);
    }
  }
};
//  тип ответа от сервера котрый возвращает ингридиенты
type TIngredientsResponse = TServerResponse<{
  data: TIngredient[];
}>;
//  лента заказов : тип ответа от сервера котрый возвращает объеьм заказов
// для ленты заказов (feed)
export type TFeedsResponse = TServerResponse<{
  orders: TOrder[];
  total: number;
  totalToday: number;
}>;
//  ответ от серверас историей заказов
// для истории заказов пользователя ("/orders")
export type TOrdersResponse = TServerResponse<{
  data: TOrder[]; // этот параметр должен быть типом ответа в ?getOrdersApi
}>;
// получаем ингридиенты
export const getIngredientsApi = () =>
  fetch(`${URL}/ingredients`)
    .then((res) => checkResponse<TIngredientsResponse>(res))
    .then((data) => {
      if (data?.success) return data.data;
      return Promise.reject(data);
    });
// получаем ленту заказов
export const getFeedsApi = () =>
  fetch(`${URL}/orders/all`)
    .then((res) => checkResponse<TFeedsResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });
// получаем историю заказов
export const getOrdersApi = () =>
  fetchWithRefresh<TFeedsResponse>(`${URL}/orders`, {
    //  !поставил TOrdersResponse вместо TFeedsResponse!
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit // говорим TypeScript, что headers точно правильного типа
  }).then((data) => {
    if (data?.success) return data.orders; // убрал data.orders
    return Promise.reject(data);
  });
//  удалено тип данных для создания заказа
// type TNewOrderResponse = TServerResponse<{
//   order: TOrder;
//   name: string; //название заказа, которое сервер возвращает отдельно
// }>;
// Корректировка  вместо удаленного - согласно POstman выполнения `${URL}/orders`
//  тип данных для создания заказа

export type TNewOrderResponse = TServerResponse<{
  order: {
    number: number;
  };
  name: string; //название заказа, которое сервер возвращает отдельно
}>;
// создаем заказ
// исправление вместо data: string[]
//  стави в место data: { ingredients: string[] }
export type dataIngIds = {
  ingredients: string[];
};
export const orderBurgerApi = (data: string[]) =>
  fetchWithRefresh<TNewOrderResponse>(`${URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify({
      ingredients: data
    })
  }).then((data) => {
    console.log(data);
    if (data?.success) return data;
    return Promise.reject(data);
  });
// Этот тип нужен для другого эндпоинта, где сервер возвращает похожие данные,
// но с другим именем поля — не data, а orders.
// Эндпоинт /orders/all для общего списка заказов ("/orders/all")
type TOrderResponse = TServerResponse<{
  orders: TOrder[];
}>;
// получить информацию о конкретном заказе по его номеру.
//  получаем заказ по номеру мо посмотретьзаказ подробнее
export const getOrderByNumberApi = (number: number) =>
  fetch(`${URL}/orders/${number}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((res) => checkResponse<TOrderResponse>(res));
// регистрируем пользователя
export type TRegisterData = {
  email: string;
  name: string;
  password: string;
};
// тип ответа от сервера котрый возвращает юзера и токены при регистрации или обовлении токена
type TAuthResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;
//  регистрируем пользователя
export const registerUserApi = (data: TRegisterData) =>
  fetch(`${URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });
//  авторизация
// export type TLoginData = {
//   email: string;
//   password: string;
// };
//  производим саму авторизацию без токенов
export const loginUserApi = (data: TLoginData) =>
  fetch(`${URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

type customMessage = {
  message: string;
};
// вводим если забыли пароль - без токенов
export const forgotPasswordApi = (data: { email: string }) =>
  fetch(`${URL}/password-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    // УБРАЛ.then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((res) => checkResponse<TServerResponse<customMessage>>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });
//  сброспароля
export const resetPasswordApi = (data: { password: string; token: string }) =>
  fetch(`${URL}/password-reset/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    // .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((res) => checkResponse<TServerResponse<customMessage>>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });
//  отве по авторизирующему токену
type TUserResponse = TServerResponse<{ user: TUser }>;
//  авторизация по токену доступа
export const getUserApi = () =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    headers: {
      authorization: getCookie('accessToken')
    } as HeadersInit // типзаголовков
  });
//  токен
// используется тогда, когда нужно изменить данные пользователя на его стр с помощью токена.
// используем с обновлением токена
// Этот эндпоинт требует авторизации,
// потому что пользователь меняет свои данные.

// fetchWithRefresh автоматически обновит accessToken, если он устарел, и повторит запрос.
export const updateUserApi = (user: Partial<TRegisterData>) =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify(user)
  });
//  выход
export const logoutApi = () =>
  fetch(`${URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  }).then((res) => checkResponse<TServerResponse<customMessage>>(res));
// }).then((res) => checkResponse<TServerResponse<{}>>(res));

// 1.fetchWithRefresh нужен только там,
// где запрос требует авторизации (т.е. accessToken)
// fetchWithRefresh:
// используется там, где:
// запрос делает авторизованный пользователь (например, getUserApi, updateUserApi, getOrdersApi, orderBurgerApi);

// 2.fetch (обычный):
// используется там, где:

// авторизация не нужна,

// или токен не проверяется.

// 📘 Примеры:

// getIngredientsApi — любой может посмотреть ингредиенты.

// getFeedsApi — лента заказов общая, доступна всем.

// forgotPasswordApi, resetPasswordApi, registerUserApi, loginUserApi — это регистрация/вход, токена ещё нет.

// Поэтому здесь обычный fetch, без логики обновления токена.
