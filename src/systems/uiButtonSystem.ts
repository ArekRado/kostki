import { createSystem } from '../ecs/createSystem';
import { componentName } from '../ecs/component';
import { State, UIButton } from '../ecs/type';
import { scene } from '..';
import { responsive } from '../blueprints/ui/responsive';
import { grid } from './uiSystem';

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
        sizes: component.width,
        callback: (size) => {
          btn.width = size;
        },
      });

      btn.height = component.height[0];
      btn.color = component.color;
      btn.cornerRadius = component.cornerRadius;
      btn.background = component.background;
      btn.fontSize = component.fontSize;
      btn.isPointerBlocker = component.isPointerBlocker;

      grid.addControl(
        btn,
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
