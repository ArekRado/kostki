import { createSystem } from '../ecs/createSystem';
import { componentName } from '../ecs/component';
import { Entity, State, UIText } from '../ecs/type';
import { scene } from '..';
import { responsive } from '../blueprints/ui/responsive';
import { advancedTexture } from './uiSystem';
import { getUiControl } from '../blueprints/ui/getUI';

const createTextControl = ({ component }: { component: UIText }) => {
  const text = new BABYLON.GUI.TextBlock(component.entity);
  text.text = component.text;
  text.color = component.color ?? '#fff';
  text.fontSize = component.fontSize ? component.fontSize[0] : 24;
  text.textHorizontalAlignment = 0;

  responsive({
    element: component,
    babylonElement: text,
    scene,
  });

  advancedTexture?.addControl(text);
};

const removeTextControl = ({ entity }: { entity: Entity }) => {
  const control = getUiControl({ entity });

  if (control) {
    control.dispose();
  }
};

export const uiTextSystem = (state: State) =>
  createSystem<UIText, {}>({
    state,
    name: componentName.uiText,
    create: ({ state, component }) => {
      createTextControl({ component });

      return state;
    },
    update: ({ state, component }) => {
      // Todo update should update "responsive" function instead of recreating whole control
      removeTextControl({ entity: component.entity });
      createTextControl({ component });

      return state;
    },
    remove: ({ state, component }) => {
      removeTextControl({ entity: component.entity });

      return state;
    },
  });
