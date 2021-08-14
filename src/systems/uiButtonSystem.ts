import { createSystem } from '../ecs/createSystem';
import { componentName } from '../ecs/component';
import { State, UIButton } from '../ecs/type';
import { scene } from '..';
import { normalizePosition, responsive } from '../blueprints/ui/responsive';
import { advancedTexture } from './uiSystem';

export const uiButtonSystem = (state: State) =>
  createSystem<UIButton, {}>({
    state,
    name: componentName.uiButton,
    create: ({ state, component }) => {
      const btn = BABYLON.GUI.Button.CreateSimpleButton(
        component.entity,
        component.text
      );

      responsive({
        element: btn,
        scene,
        sizes: component.size,
        callback: (size) => {
          btn.width = size[0];
          btn.height = size[1];
        },
      });

      btn.color = component.color ?? 'white';
      btn.cornerRadius = component.cornerRadius ?? 20;
      btn.background = component.background ?? 'green';
      btn.fontSize = component.fontSize ?? 30;
      btn.isPointerBlocker = component.isPointerBlocker ?? true;

      const [left, top] = normalizePosition(component.position[0]);
      btn.top = top;
      btn.left = left;

      advancedTexture?.addControl(btn);

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
