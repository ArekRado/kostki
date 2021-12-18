import { scene } from '../..';
import { componentName, getComponent, setComponent } from '../../ecs/component';
import { Box, EventHandler } from '../../ecs/type';
import { emitEvent } from '../../eventSystem';
import { BoxEvent } from '../boxSystem';
import { GameEvent, getGame } from '../gameSystem';
import { boxExplosion } from './boxExplosion';
import { getTextureSet } from './getTextureSet';
import { removeBoxFromRotationQueue } from './removeBoxFromRotationQueue';
import { resetBoxRotation } from './resetBoxRotation';

export const rotationEndHandler: EventHandler<BoxEvent.RotationEndEvent> = ({
  state,
  event,
}) => {
  const { ai, shouldExplode, boxEntity } = event.payload;
  const component = getComponent<Box>({
    state,
    name: componentName.box,
    entity: boxEntity,
  });

  if (!component) {
    return state;
  }

  state = removeBoxFromRotationQueue({ entity: component.entity, state });
  const game = getGame({ state });

  // todo it should not be a part of rotationEndHandler
  if (ai && game) {
    resetBoxRotation({
      boxUniqueId: component.entity,
      texture: getTextureSet({ state, ai })[component.dots],
      color: ai.color,
    });

    if (shouldExplode) {
      state = boxExplosion({
        state,
        box: component,
        ai,
      });
    } else {
      if (game.boxRotationQueue.length === 0) {
        emitEvent<GameEvent.NextTurnEvent>({
          type: GameEvent.Type.nextTurn,
          payload: {},
        });
      }
    }
  }

  const box = scene.getTransformNodeByUniqueId(parseInt(component.entity));
  if (box) {
    box.animations = [];
  }

  state = setComponent<Box>({
    state,
    data: {
      ...component,
      isAnimating: false,
    },
  });

  return state;
};
