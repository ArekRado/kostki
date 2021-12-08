import { componentName } from './component';
import { State } from './type';

let state: State = {
  entity: {},
  component: {
    [componentName.event]: {},
    [componentName.box]: {},
    [componentName.ai]: {},
    [componentName.game]: {},
    [componentName.camera]: {},
    [componentName.marker]: {},
    [componentName.background]: {},
    [componentName.logo]: {},
  },
  system: [],
};

export const initialState = state;
