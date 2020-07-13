import { createStore } from 'redux';
import { rootReducer } from './reducer';

export const configureStore = () => {
  return createStore(rootReducer);
};
