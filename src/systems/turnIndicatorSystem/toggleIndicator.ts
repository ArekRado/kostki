import { scene } from '../..';
import { componentName, getComponent, setComponent } from '../../ecs/component';
import { State, TurnIndicator, UIText } from '../../ecs/type';
import { getTurnIndicator } from '../turnIndicatorSystem';
import { doesIndicatorCollidesWithGrid } from './doesIndicatorCollidesWithGrid';

export const toggleIndicator = ({ state }: { state: State }): State => {
  const component = getTurnIndicator({ state });

  if (!component) {
    return state;
  }

  const shouldHideIndicator = doesIndicatorCollidesWithGrid({
    state,
    component,
  });

  const shouldToggle =
    (component.isVisible === true && shouldHideIndicator === true) ||
    (component.isVisible === false && shouldHideIndicator === false);

  if (shouldToggle) {
    const isVisible = !component.isVisible;

    state = setComponent<TurnIndicator>({
      state,
      data: {
        ...component,
        isVisible,
      },
    });

    component.boxes.forEach((boxEntity, i) => {
      const mesh = scene.getTransformNodeByUniqueId(parseFloat(boxEntity));

      if (mesh) {
        mesh.setEnabled(isVisible);
      }
    });

    !isVisible &&
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
  }

  return state;
};
