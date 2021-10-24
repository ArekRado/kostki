import { scene } from '../..';
import { componentName, getComponent, setComponent } from '../../ecs/component';
import { State, TurnIndicator, UIText } from '../../ecs/type';

export const toggleIndicator = ({
  state,
  component,
}: {
  state: State;
  component: TurnIndicator;
}): State => {
  component.boxes.forEach((boxEntity, i) => {
    const mesh = scene.getTransformNodeByUniqueId(parseFloat(boxEntity));

    if (mesh) {
      mesh.setEnabled(component.isVisible);
    }
  });

  component.texts.forEach((textEntity) => {
    const text = getComponent<UIText>({
      state,
      name: componentName.uiText,
      entity: textEntity,
    });

    if (text) {
      state = setComponent<UIText>({
        state,
        data: {
          ...text,
          position: [
            [-1, -1],
            [-1, -1],
            [-1, -1],
          ],
        },
      });
    }
  });

  return state;
};
