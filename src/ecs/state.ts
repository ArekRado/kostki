import { aiSystem } from '../systems/aiSystem';
import { boxSystem } from '../systems/boxSystem';
import { gameSystem } from '../systems/gameSystem';
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

// Systems
state = boxSystem(state);
state = aiSystem(state);
state = gameSystem(state);

export const initialState = state;
