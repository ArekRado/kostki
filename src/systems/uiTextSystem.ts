import { createSystem } from '../ecs/createSystem';
import { componentName } from '../ecs/component';
import { Entity, State, UIText } from '../ecs/type';
import { scene } from '..';
import { advancedTexture } from './uiSystem';
import { getUiControl } from './uiSystem/getUiControl';
import { uiResize } from './uiSystem/uiResize';

const createTextControl = ({
  component,
  state,
}: {
  component: UIText;
  state: State;
}) => {
  const text = new BABYLON.GUI.TextBlock(component.entity);
  text.text = component.text;
  text.color = component.color ?? '#fff';
  text.fontSize = component.fontSize ? component.fontSize[0] : 24;
  text.textHorizontalAlignment = 0;

  advancedTexture?.addControl(text);

  // TODO for better performance it should recalculate only single control
  uiResize({ state, scene });
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
      createTextControl({ component, state });

      return state;
    },
    remove: ({ state, component }) => {
      removeTextControl({ entity: component.entity });

      return state;
    },
  });
