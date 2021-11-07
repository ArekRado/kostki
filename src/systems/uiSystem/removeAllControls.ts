import { componentName, removeComponentsByName } from '../../ecs/component';
import { State } from '../../ecs/type';
import { uiRoot } from '../uiSystem';

type RemoveAllControls = (params: {
  advancedTexture: BABYLON.GUI.AdvancedDynamicTexture;
  state: State;
}) => State;
export const removeAllControls: RemoveAllControls = ({ state, advancedTexture }) => {
  advancedTexture
    .getChildren()
    .find((x) => x.name === uiRoot)
    ?.clearControls();

  state = removeComponentsByName({ state, name: componentName.uiImage });
  state = removeComponentsByName({ state, name: componentName.uiButton });
  state = removeComponentsByName({ state, name: componentName.uiText });

  return state;
};
