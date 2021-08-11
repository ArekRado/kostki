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
    [componentName.ui]: {},
    [componentName.uiButton]: {},
    [componentName.uiImage]: {},
  },
  system: [],
};

export const initialState = state;
