import { Scene } from 'babylonjs';
import { componentName, getComponent, setComponent } from '../../ecs/component';
import { AI, Entity, State, UIText } from '../../ecs/type';
import { getTurnIndicator } from '../turnIndicatorSystem';
import { getCameraSizes } from '../cameraSystem/getCameraSizes';
import { moveHighlighter } from './moveHighlighter';
import { removeTurnIndicatorElement } from './remove';
import { setUi } from '../uiSystem';

const isAiActive = ({
  state,
  aiEntity,
}: {
  state: State;
  aiEntity: Entity;
}): boolean =>
  getComponent<AI>({
    state,
    name: componentName.ai,
    entity: aiEntity,
  })?.active || false;

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

  const { leftEdge, topEdge, boxSize, screenSize } = getCameraSizes({
    state,
    boxScaleFactor: 3,
  });

  component.list.forEach(({ boxEntity, textEntity, aiEntity }) => {
    if (!isAiActive({ state, aiEntity })) {
      state = removeTurnIndicatorElement({
        state,
        boxEntity,
        textEntity,
        aiEntity,
      });
    }
  });

  component.list.forEach(({ boxEntity, textEntity }, i) => {
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
    }

    const text = getComponent<UIText>({
      state,
      name: componentName.uiText,
      entity: textEntity,
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
  state = setUi({ state, data: {}, cleanControls: false }); // to refresh text position

  return state;
};
