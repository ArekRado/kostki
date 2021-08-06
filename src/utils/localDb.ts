import { State } from '../ecs/type';

const localDbKey = 'localDbKey';

export const getSavedState = (): State | null => {
  return JSON.parse(localStorage.getItem(localDbKey) || 'null');
};

export const saveState = (state: State) => {
  localStorage.setItem(localDbKey, JSON.stringify(state));
};

export const removeState = () => {
  localStorage.removeItem(localDbKey);
};
