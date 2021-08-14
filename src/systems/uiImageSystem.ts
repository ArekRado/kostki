import { createSystem } from '../ecs/createSystem';
import { componentName } from '../ecs/component';
import { State, UIImage } from '../ecs/type';
import { scene } from '..';
import { normalizePosition, responsive } from '../blueprints/ui/responsive';
import { advancedTexture } from './uiSystem';
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
        sizes: component.size,
        callback: (size) => {
          img.width = size[0];
          const ratio = getAspectRatio(scene);
          img.height = size[1] / ratio;
        },
      });

      const [left, top] = normalizePosition(component.position[0]);
      img.top = top;
      img.left = left;

      advancedTexture?.addControl(img);

      return state;
    },
    remove: ({ state, component }) => {
      const control = advancedTexture
        ?.getChildren()
        .find((x) => x.name === component.entity);

      if (control) {
        control.dispose();
      }

      return state;
    },
  });
