import { expect, test, describe } from '@jest/globals';
import constructorBurgerReducer, {
  setIngredients,
  divideIngridients,
  TBurgConstrState
} from '../services/slices/constructorBurger/constrBurgSlice';
import { createDeepCopyObj } from '../utils/utils';
import { IngridientWithChoseCount } from '../services/slices/ingredients/ingredientSlice';

describe('работа редьюсера конструктора бургера', () => {
  // задаем начальное состояние для тестов бургера
  let initialState: TBurgConstrState;
  let ingredient: IngridientWithChoseCount;
  //  начальное состояние для тестов
  beforeEach(() => {
    initialState = {
      addedIngredients: [
        {
          _id: '643d69a5c3f7b9001cfa093c',
          name: 'Краторная булка N-200i',
          type: 'bun',
          proteins: 80,
          fat: 24,
          carbohydrates: 53,
          calories: 420,
          price: 1255,
          image: 'https://code.s3.yandex.net/react/code/bun-02.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
          image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
          count: 2
        },
        {
          _id: '643d69a5c3f7b9001cfa0941',
          name: 'Биокотлета из марсианской Магнолии',
          type: 'main',
          proteins: 420,
          fat: 142,
          carbohydrates: 242,
          calories: 4242,
          price: 424,
          image: 'https://code.s3.yandex.net/react/code/meat-01.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
          image_large:
            'https://code.s3.yandex.net/react/code/meat-01-large.png',
          count: 3
        }
      ],
      dividedIngwithId: [],
      idIngredsForOrder: [],
      totalSum: 0
    };
    ingredient = {
      _id: '643d69a5c3f7b9001cfa093e',
      name: 'Филе Люминесцентного тетраодонтимформа',
      type: 'main',
      proteins: 44,
      fat: 26,
      carbohydrates: 85,
      calories: 643,
      price: 988,
      image: 'https://code.s3.yandex.net/react/code/meat-03.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
      count: 1
    };
  });
  test('обработка экшена добавления ингредиента в костр бургер', () => {
    //  обновляем массив - чтобы в него добавился новый элемент
    const updatedIngrsWithNewIng = createDeepCopyObj([
      ...initialState.addedIngredients,
      // просто добавили
      ingredient
    ]);
    //  добавим массив с новым ингредиентом
    const newStateaAddNew = constructorBurgerReducer(
      initialState,
      setIngredients([...updatedIngrsWithNewIng])
    );
    // теперь добавим еще одну единицу этого ингредиента в ту же 'корзину'
    //  обновим массив так чтобы было две единицы нов игредиента
    const updateIngredientIncrem = {
      ...ingredient,
      // имитируем 2 единицы
      count: 2
    };
    // опять создаем массив уже с игредиентом с 2 единицами
    const updateIngrsWithIncremIng = createDeepCopyObj([
      ...initialState.addedIngredients,
      updateIngredientIncrem
    ]);
    // добавляем обновленный массив с ингредиентом в количестве 2 шт
    const newStateIncremCountIng = constructorBurgerReducer(
      newStateaAddNew,
      setIngredients([...updateIngrsWithIncremIng])
    );
    //  проверяем что добавили новый ингредиент - теперь три типа товара в корз
    expect(newStateaAddNew.addedIngredients.length).toBe(3);
    //  проверяем что при обновлении количества у одного из ингредиентов количество доб типов товаров не изменилось
    expect(newStateIncremCountIng.addedIngredients.length).toBe(3);
    // проверим что добав ингредиент с количеством 1 есть в корзине
    expect(newStateaAddNew.addedIngredients).toEqual(
      expect.arrayContaining([ingredient])
    );
    //  проверим что добав ингредиаент с количеством 2 есть в корзине
    expect(newStateIncremCountIng.addedIngredients).toEqual(
      expect.arrayContaining([updateIngredientIncrem])
    );
    //  какие данные видит пользователь?
    const viewDataState = constructorBurgerReducer(
      newStateIncremCountIng,
      // разделяем наши товары по id и по штучно
      divideIngridients(newStateIncremCountIng.addedIngredients)
    );
    // определим общее количество всех товаров уже в вью корзине
    const sumCountsAllAddedIngs =
      newStateIncremCountIng.addedIngredients.reduce(
        (acc, ingr) => acc + (ingr.count ?? 0),
        0
      );
    // количество штук равно общему количеству добаленных в корзине которую 'видит пользов'?
    expect(viewDataState.dividedIngwithId.length).toBe(sumCountsAllAddedIngs);
  });
  test('обработка экшена удаления ингредиента из костр бургера', () => {
    //  создадим массив без одного ингредиента в initialState
    const updatedWithoutOneIng = createDeepCopyObj([
      ...initialState.addedIngredients
    ]);
    // удалим первый ингредиент
    updatedWithoutOneIng.splice(0, 1);
    //  добавим массив с удаленным ингредиентом
    const newStateWithoutOne = constructorBurgerReducer(
      initialState,
      setIngredients([...updatedWithoutOneIng])
    );

    // При удалении в корзине остается один элемент с кол-вом count 3 шт
    expect(newStateWithoutOne.addedIngredients.length).toBe(1);
    expect(newStateWithoutOne.addedIngredients[0].count).toBe(3);
    //  пробуем уменьшить его количество в корзине
    const ingredientWithCount2 = {
      ...newStateWithoutOne.addedIngredients[0],
      count: 2
    };
    const updateIngredients = createDeepCopyObj([ingredientWithCount2]);
    const newStateWithIngDecrementCount = constructorBurgerReducer(
      newStateWithoutOne,
      setIngredients([...updateIngredients])
    );
    // теперь имеем только один ингредиент сколичеством 2 в корзине
    expect(newStateWithIngDecrementCount.addedIngredients[0].count).toBe(2);
    // посмотрим что пользователь увидит данные одного товара в корзине в кол 2 шт разделенныые на 2 позиции в корзине
    const divedeStateIngs = constructorBurgerReducer(
      newStateWithIngDecrementCount,
      divideIngridients(newStateWithIngDecrementCount.addedIngredients)
    );
    //  проверим что появилось свойство id у каждого добавленного ингредиента в нашем случае у 2 позиций
    divedeStateIngs.dividedIngwithId.forEach((ing) => {
      // имеет свойство id
      expect(ing).toHaveProperty('id');
    });
    //  проверим что в коризне 2 позиции одного ингредиента
    expect(divedeStateIngs.dividedIngwithId.length).toBe(2);
  });
});
