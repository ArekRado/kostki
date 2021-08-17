import { createSystem } from '../ecs/createSystem';
import { componentName } from '../ecs/component';
import { State, UIText } from '../ecs/type';
import { scene } from '..';
import { normalizePosition, responsive } from '../blueprints/ui/responsive';
import { advancedTexture } from './uiSystem';
import { getAspectRatio } from '../utils/getAspectRatio';

export const uiTextSystem = (state: State) =>
  createSystem<UIText, {}>({
    state,
    name: componentName.uiText,
    create: ({ state, component }) => {
      const text = new BABYLON.GUI.TextBlock(component.entity);
      text.text = component.text;
      text.color = component.color ?? '#fff';
      text.fontSize = component.fontSize ?? 24;

      responsive({
        element: text,
        scene,
        sizes: component.size,
        callback: (size) => {
          text.width = size[0];
          const ratio = getAspectRatio(scene);
          text.height = size[1] / ratio;
        },
      });

      const [left, top] = normalizePosition(component.position[0]);
      text.top = top;
      text.left = left;

      advancedTexture?.addControl(text);

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
