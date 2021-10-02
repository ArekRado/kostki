import { createSystem } from '../ecs/createSystem';
import { componentName } from '../ecs/component';
import { State, UIText } from '../ecs/type';
import { scene } from '..';
import { responsive } from '../blueprints/ui/responsive';
import { advancedTexture } from './uiSystem';
import { getUiControl } from '../blueprints/ui/getUI';

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
        element: component,
        babylonElement: text,
        scene,
      });

      advancedTexture?.addControl(text);

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
