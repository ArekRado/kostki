import { componentName } from './component';
import { State } from './type';

let state: State = {
  entity: {},
  component: {
    [componentName.box]: {},
    [componentName.ai]: {},
    [componentName.game]: {},
    [componentName.marker]: {},
    [componentName.background]: {},
    [componentName.logo]: {},
    
    [componentName.camera]: {},
    [componentName.event]: {},
    [componentName.animation]: {},
    [componentName.time]: {},
    [componentName.transform]: {},
  },
  system: [],
};

export const initialState = state;
