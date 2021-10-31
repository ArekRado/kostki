import { createSystem } from '../ecs/createSystem';
import { componentName } from '../ecs/component';
import { State, UIButton } from '../ecs/type';
import { advancedTexture } from './uiSystem';
import { getUiControl } from './uiSystem/getUiControl';

export const uiButtonSystem = (state: State) =>
  createSystem<UIButton, {}>({
    state,
    name: componentName.uiButton,
    create: ({ state, component }) => {
      const btn = BABYLON.GUI.Button.CreateImageWithCenterTextButton(
        component.entity,
        component.text,
        component.src[0]
      );

      btn.color = component.color ?? 'black';
      btn.fontSize = component.fontSize ?? 30;
      btn.isPointerBlocker = component.isPointerBlocker ?? true;

      advancedTexture?.addControl(btn);

      return state;
    },
    update: ({ state, component }) => {
      const control = getUiControl({
        entity: component.entity,
      }) as BABYLON.GUI.Button;

      if (control && control.textBlock) {
        control.textBlock.text = component.text;
      }

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
