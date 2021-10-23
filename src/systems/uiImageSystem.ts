import { createSystem } from '../ecs/createSystem';
import { componentName } from '../ecs/component';
import { State, UIImage } from '../ecs/type';
import { scene } from '..';
import { advancedTexture } from './uiSystem';
import { getUiControl } from './uiSystem/getUiControl';

export const uiImageSystem = (state: State) =>
  createSystem<UIImage, {}>({
    state,
    name: componentName.uiImage,
    create: ({ state, component }) => {
      const img = new BABYLON.GUI.Image(component.entity, component.url);

      // responsive({
      //   element: component,
      //   babylonElement: img,
      //   scene,
      // });

      advancedTexture?.addControl(img);

      return state;
    },
    remove: ({ state, component }) => {
      const control = getUiControl({ entity: component.entity });

      if (control) {
        control.dispose();
      }

      return state;
    },
  });

