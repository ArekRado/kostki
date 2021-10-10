import { createSystem } from '../ecs/createSystem';
import {
  componentName,
  createGetSetForUniqComponent,
  getComponent,
  setComponent,
} from '../ecs/component';
import { AI, State, TurnIndicator, UIText } from '../ecs/type';
import { scene } from '..';
import { Breakpoints } from '../blueprints/ui/responsive';
import { getGame } from './gameSystem';
import { boxBlueprint } from '../blueprints/boxBlueprint';
import { boxWithGap } from '../blueprints/gridBlueprint';
import { createEntity } from '../ecs/entity';
import { getCamera } from './cameraSystem';
import { logWrongPath } from '../utils/logWrongPath';

export const turnIndicatorEntity = '68127445920450266';

const turnIndicatorGetSet = createGetSetForUniqComponent<TurnIndicator>({
  entity: turnIndicatorEntity,
  name: componentName.turnIndicator,
});

export const getTurnIndicator = turnIndicatorGetSet.getComponent;
export const setTurnIndicator = turnIndicatorGetSet.setComponent;

const updateIndicatorPosition = ({
  state,
  component,
}: {
  state: State;
  component: TurnIndicator;
}): State => {
  const camera = getCamera({ state });

  if (camera) {
    const leftEdge = camera.position[0] + camera.left;
    const topEdge = camera.position[1] + camera.top;
    const scaleFactor = 3;
    const boxSize = boxWithGap / scaleFactor;
    const screenSize = [camera.right * 2, camera.top * 2];

    component.boxes.forEach((boxEntity, i) => {
      const boxPosition: [number, number] = [
        leftEdge + boxSize,
        topEdge - i * boxSize - boxSize,
      ];
      const percentagePosition = [
        (boxPosition[0] - leftEdge + boxSize) / screenSize[0],
        (topEdge - boxPosition[1]) / screenSize[1],
      ];

      const textSize: Breakpoints<[number, number]> = [
        [0.1, 0.1],
        [0.1, 0.1],
        [0.1, 0.1],
      ];

      const mesh = scene.getTransformNodeByUniqueId(parseFloat(boxEntity));

      if (mesh) {
        mesh.position.x = boxPosition[0];
        mesh.position.y = boxPosition[1];
      } else {
        logWrongPath(state);
      }

      const text = getComponent<UIText>({
        state,
        name: componentName.uiText,
        entity: component.texts[i],
      });

      if (text) {
        state = setComponent<UIText>({
          state,
          data: {
            ...text,
            position: [
              [
                percentagePosition[0] + textSize[0][0] / 2,
                percentagePosition[1],
              ],
              [
                percentagePosition[0] + textSize[0][0] / 2,
                percentagePosition[1],
              ],
              [
                percentagePosition[0] + textSize[0][0] / 2,
                percentagePosition[1],
              ],
            ],
          },
        });
      } else {
        logWrongPath(state);
      }
    });
  }

  return state;
};

export const turnIndicatorSystem = (state: State) =>
  createSystem<TurnIndicator, {}>({
    state,
    name: componentName.turnIndicator,
    create: ({ state, component }) => {
      const game = getGame({ state });
      const camera = getCamera({ state });
      const scaleFactor = 3;

      if (game && camera) {
        const boxes = game?.playersQueue.map((aiEntity, i) => {
          const ai = getComponent<AI>({
            state,
            name: componentName.ai,
            entity: aiEntity,
          });

          const boxEntity = createEntity('turnIndicatorBox');

          const box = boxBlueprint({
            scene,
            name: `turnIndicatorBox-${i}`,
            position: [0, 0],
            uniqueId: parseFloat(boxEntity),
            color: ai?.color || [1, 1, 1],
            ai,
            dots: 1,
            state,
            isClickable: false,
          });

          box.scaling.x = 1 / scaleFactor;
          box.scaling.y = 1 / scaleFactor;

          return boxEntity;
        });

        const texts = game?.playersQueue.map((aiEntity, i) => {
          const ai = getComponent<AI>({
            state,
            name: componentName.ai,
            entity: aiEntity,
          });

          const textEntity = createEntity('text');

          state = setComponent<UIText>({
            state,
            data: {
              entity: textEntity,
              name: componentName.uiText,
              text: ai?.human ? 'Player' : 'Computer',
              size: [
                [0.1, 0.1],
                [0.1, 0.1],
                [0.1, 0.1],
              ],
              color: '#444',
              fontSize: 24,
              position: [
                [0, 0],
                [0, 0],
                [0, 0],
              ],
            },
          });

          return textEntity;
        });

        state = setComponent<TurnIndicator>({
          state,
          data: {
            ...component,
            boxes,
            texts,
          },
        });
      }

      return state;
    },
    update: ({ state, component }) => {
      state = updateIndicatorPosition({ state, component });
      return state;
    },
  });
