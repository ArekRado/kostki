import { Box, name, State } from '../../type';
import { emitEvent } from '../../eventSystem';
import { BoxEvent } from '../boxSystem';
import { GameEvent, getGame } from '../gameSystem';
import { boxExplosion } from './boxExplosion';
import { getTextureSet } from './getTextureSet';
import { removeBoxFromRotationQueue } from './removeBoxFromRotationQueue';
import { resetBoxRotation } from './resetBoxRotation';
import {
  EventHandler,
  getComponent,
  setComponent,
} from '@arekrado/canvas-engine';

export const rotationEndHandler: EventHandler<
  BoxEvent.RotationEndEvent,
  State
> = ({ state, event }) => {
  const sceneRef = state.babylonjs.sceneRef;
  const { ai, shouldExplode, boxEntity } = event.payload;
  const component = getComponent<Box, State>({
    state,
    name: name.box,
    entity: boxEntity,
  });

  if (!component || !sceneRef) {
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
      scene: sceneRef,
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

  const box = sceneRef.getTransformNodeByUniqueId(parseInt(component.entity));
  if (box) {
    box.animations = [];
  }

  state = setComponent<Box, State>({
    state,
    data: {
      ...component,
      isAnimating: false,
    },
  });

  return state;
};
