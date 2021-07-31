import { componentName } from './component';
import { State } from './type';

let state: State = {
  entity: {},
  component: {
    [componentName.box]: {},
    [componentName.ai]: {},
    [componentName.game]: {},
  },
  system: [],
};

export const initialState = state;

