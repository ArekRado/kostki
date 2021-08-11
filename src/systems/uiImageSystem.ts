import { createSystem } from '../ecs/createSystem';
import { componentName } from '../ecs/component';
import { State, UIImage } from '../ecs/type';
import { scene } from '..';
import { responsive } from '../blueprints/ui/responsive';
import { advancedTexture, grid } from './uiSystem';
import { getAspectRatio } from '../utils/getAspectRatio';

export const uiImageSystem = (state: State) =>
  createSystem<UIImage, {}>({
    state,
    name: componentName.uiImage,
    create: ({ state, component }) => {
      const img = new BABYLON.GUI.Image(component.entity, component.url);

      responsive({
        element: img,
        scene,
        sizes: component.width,
        callback: (size) => {
          img.width = size;
          const ratio = getAspectRatio(scene);
          img.height = (component.height[0] * size) / ratio;
        },
      });

      // img.height = component.height[0];

      // if (advancedTexture) {
      //   advancedTexture.addControl(img);
      // }

      grid.addControl(
        img,
        component.gridPosition[0],
        component.gridPosition[1]
      );

      return state;
    },
    remove: ({ state, component }) => {
      const control = grid.getChildByName(component.entity);
      control?.dispose();

      return state;
    },
  });
