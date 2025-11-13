// Функция setCookie принимает три аргумента: name (имя куки), value (значение куки) и props (объект, содержащий дополнительные свойства куки)
export function setCookie(
  name: string,
  value: string,
  props: { [key: string]: string | number | Date | boolean } = {}
) {
  console.log(props);
  props = {
    path: '/',
    ...props
  };
  let exp = props.expires;
  //  Если в объекте props передано значение для свойства expires (время жизни куки), то оно обрабатывается
  //Если expires — число (предполагается, что это количество секунд), то к текущей дате прибавляется это количество секунд и устанавливается новая дата истечения
  if (typeof exp == 'number' && exp) {
    const d = new Date();
    d.setTime(d.getTime() + exp * 1000);
    exp = props.expires = d;
  }
  //  Если expires — объект типа Date, то он преобразуется в строку в формате UTC
  if (exp && exp instanceof Date) {
    props.expires = exp.toUTCString();
  }
  //  Значение value кодируется с использованием encodeURIComponent, чтобы убедиться, что оно может быть использовано внутри куки без проблем
  value = encodeURIComponent(value);
  //  Создадим строку updatedCookie, которая содержит имя и значение куки
  let updatedCookie = name + '=' + value;
  //  Проходим по всем свойствам объекта props. Каждое переданное свойство и его значение добавляем к строке updatedCookie , разеделяя их «;»
  for (const propName in props) {
    updatedCookie += '; ' + propName;
    const propValue = props[propName];
    if (propValue !== true) {
      updatedCookie += '=' + propValue;
    }
  }
  document.cookie = updatedCookie;
}

export function getCookie(name: string) {
  const matches = document.cookie.match(
    // eslint-disable-next-line no-useless-escape
    new RegExp(
      '(?:^|; )' +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)'
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
