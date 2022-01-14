import { Entity, setComponent } from '@arekrado/canvas-engine';
import { Game, State } from '../../type';
import { getGame } from '../gameSystem';

type PushBoxToRotationQueue = (params: {
  entity: Entity;
  state: State;
}) => State;
export const pushBoxToRotationQueue: PushBoxToRotationQueue = ({
  entity,
  state,
}) => {
  const game = getGame({ state });

  if (game) {
    return setComponent<Game, State>({
      state,
      data: {
        ...game,
        boxRotationQueue: [...game.boxRotationQueue, entity],
      },
    });
  }

  return state;
};
