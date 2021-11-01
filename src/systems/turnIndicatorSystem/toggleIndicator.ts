import { scene } from '../..';
import { getGridDimensions } from '../../blueprints/gridBlueprint';
import { componentName, getComponent, setComponent } from '../../ecs/component';
import { State, TurnIndicator, UIText } from '../../ecs/type';
import { getAspectRatio } from '../../utils/getAspectRatio';
import { getTurnIndicator, highlighterEntity } from '../turnIndicatorSystem';
import { getCameraSizes } from '../cameraSystem/getCameraSizes';

export const indicatorWidth = 2;

export const doesIndicatorCollidesWithGrid = ({
  state,
  component,
}: {
  state: State;
  component: TurnIndicator;
}) => {
  const { boxSize, screenSize } = getCameraSizes({
    state,
    boxScaleFactor: 3
  });
  const aspect = getAspectRatio(scene);

  const indicatorHeight = component.boxes.length * boxSize;

  const { width, height } = getGridDimensions({ state });

  const gridSizeWithRightGap = (screenSize[0] - width) / 2 + width;
  const gridSizeWithTopGap = (screenSize[1] - height) / 2 + height;

  const collisions = [
    aspect < 1
      ? screenSize[0] - gridSizeWithRightGap - indicatorWidth <= 0
      : false,
    aspect > 1
      ? screenSize[1] - gridSizeWithTopGap - indicatorHeight <= 0
      : false,
  ];

  return collisions[0] || collisions[1];
};

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
      mesh?.setEnabled(isVisible);
    });

    const highlighterMesh = scene.getMeshByUniqueId(parseFloat(highlighterEntity));
    highlighterMesh?.setEnabled(isVisible);

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
