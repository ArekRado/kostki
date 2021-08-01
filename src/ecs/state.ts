import { componentName } from './component';
import { State } from './type';

let state: State = {
  entity: {},
  component: {
    [componentName.box]: {},
    [componentName.ai]: {},
    [componentName.game]: {},
    [componentName.camera]: {},
    [componentName.marker]: {},
  },
  system: [],
};

export const initialState = state;

