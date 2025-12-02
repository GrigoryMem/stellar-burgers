import { expect, test, describe } from '@jest/globals';
import { rootReducerBurger } from '../../src/services/rootReducer';
import { configureStore } from '@reduxjs/toolkit';
import { store } from '../../src/services/store';

let initialStore: typeof store;

describe('настройка и работа rootReducer(rR)', () => {
  beforeEach(() => {
    initialStore = configureStore({
      reducer: rootReducerBurger
    });
  });
  test('вызов с состоянием undefined и  неизв Action(rR)', () => {
    const testReducerState = rootReducerBurger(undefined, {
      type: 'UNKNOWN_ACTION'
    });
    const state = initialStore.getState();
    expect(state).toEqual(testReducerState);
  });
});
