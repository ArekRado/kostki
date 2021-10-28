import { Scene } from 'babylonjs';
import { componentName, getComponent, setComponent } from '../../ecs/component';
import { State, UIText } from '../../ecs/type';
import { getTurnIndicator } from '../turnIndicatorSystem';
import { getIndicatorSizes } from './getIndicatorSizes';
import { moveHighlighter } from './moveHighlighter';

export const updateIndicatorPosition = ({
  state,
  scene,
}: {
  state: State;
  scene: Scene;
}): State => {
  const component = getTurnIndicator({ state });

  if (!component || component.isVisible === false) {
    return state;
  }

  const { leftEdge, topEdge, boxSize, screenSize } = getIndicatorSizes({
    state,
  });

  component.boxes.forEach((boxEntity, i) => {
    const boxPosition: [number, number] = [
      leftEdge + boxSize,
      topEdge - i * boxSize - boxSize,
    ];
    const percentagePosition = [
      (boxPosition[0] - leftEdge + boxSize) / screenSize[0],
      (topEdge - boxPosition[1]) / screenSize[1],
    ];

    const mesh = scene.getTransformNodeByUniqueId(parseFloat(boxEntity));

    if (mesh) {
      mesh.position.x = boxPosition[0];
      mesh.position.y = boxPosition[1];
    } else {
      console.log('mesh doesnt exist', boxEntity);
    }

    const text = getComponent<UIText>({
      state,
      name: componentName.uiText,
      entity: component.texts[i],
    });

    if (text) {
      const textLeftEdge = percentagePosition[0] + text.size[0][0] / 2; // Because babylon positions are centered
      state = setComponent<UIText>({
        state,
        data: {
          ...text,
          position: [
            [textLeftEdge, percentagePosition[1]],
            [textLeftEdge, percentagePosition[1]],
            [textLeftEdge, percentagePosition[1]],
          ],
        },
      });
    }
  });

  state = moveHighlighter({ state });

  return state;
};
