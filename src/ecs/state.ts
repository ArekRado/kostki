import { componentName } from './component';
import { State } from './type';

let state: State = {
  entity: {},
  component: {
    [componentName.box]: {},
  },
  system: [],
  enableBabylonjs: true,
};

// state = timeSystem(state);

export const initialState = state;

export const initialStateWithDisabledBabylon: State = {
  ...initialState,
  enableBabylonjs: false,
};
