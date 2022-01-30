import { EventHandler, getComponent } from '@arekrado/canvas-engine';
import { emitEvent } from '../../eventSystem';
import { AI, Box, name, State } from '../../type';
import { AIEvent } from '../aiSystem';
import { boxExplosion } from '../boxSystem/boxExplosion';
import { GameEvent, getGame } from '../gameSystem';

export const handleBoxRotationEnd: EventHandler<
  AIEvent.BoxRotationEndEvent,
  State
> = ({ state, event }) => {
  const game = getGame({ state });
  const box = getComponent<Box, State>({
    state,
    name: name.box,
    entity: event.payload.boxEntity,
  });
  const ai = getComponent<AI, State>({
    state,
    name: name.ai,
    entity: box?.player || '',
  });

  if (ai && game && box) {
    const shouldExplode = box.dots === 1;

    if (shouldExplode) {
      state = boxExplosion({
        state,
        box,
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

  return state;
};
