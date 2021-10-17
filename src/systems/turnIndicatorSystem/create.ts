import { scene } from '../..';
import { boxBlueprint } from '../../blueprints/boxBlueprint';
import { highlighterBlueprint } from '../../blueprints/highlighterBlueprint';
import { componentName, getComponent, setComponent } from '../../ecs/component';
import { createEntity } from '../../ecs/entity';
import { AI, State, TurnIndicator, UIText } from '../../ecs/type';
import { getCamera } from '../cameraSystem';
import { getGame } from '../gameSystem';

export const create = ({
  state,
  component,
}: {
  state: State;
  component: TurnIndicator;
}) => {
  const game = getGame({ state });
  const camera = getCamera({ state });
  const scaleFactor = 3;

  if (!game || !camera) {
    return state;
  }

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
        fontSize: [
          24,24,24
        ],
        position: [
          [0, 0],
          [0, 0],
          [0, 0],
        ],
      },
    });

    return textEntity;
  });

  const highlighterEntity = createEntity('highlighter');
  highlighterBlueprint({
    scene,
    entity: highlighterEntity,
  });

  state = setComponent<TurnIndicator>({
    state,
    data: {
      ...component,
      boxes,
      texts,
      highlighter: highlighterEntity,
    },
  });

  return state;
};
