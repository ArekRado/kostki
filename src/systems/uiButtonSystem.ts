import { createSystem } from '../ecs/createSystem';
import { componentName } from '../ecs/component';
import { State, UIButton } from '../ecs/type';
import { scene } from '..';
import { responsive } from '../blueprints/ui/responsive';
import { advancedTexture } from './uiSystem';
import { getUI } from '../blueprints/ui/getUI';

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
        element: component,
        babylonElement: btn,
        scene,
      });

      btn.color = component.color ?? 'white';
      btn.cornerRadius = component.cornerRadius ?? 0;
      btn.background = component.background ?? 'transparent';
      btn.fontSize = component.fontSize ?? 30;
      btn.isPointerBlocker = component.isPointerBlocker ?? true;

      advancedTexture?.addControl(btn);

      return state;
    },
    update: ({ state, component }) => {
      const control = getUI({ entity: component.entity }) as BABYLON.GUI.Button;

      if (control && control.textBlock) {
        control.textBlock.text = component.text;
      }

      return state;
    },
    remove: ({ state, component }) => {
      const control = getUI({ entity: component.entity });

      if (control) {
        control.dispose();
      }

      return state;
    },
  });
