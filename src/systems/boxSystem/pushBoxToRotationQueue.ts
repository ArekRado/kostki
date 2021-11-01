import { setComponent } from '../../ecs/component';
import { Entity, Game, State } from '../../ecs/type';
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
    return setComponent<Game>({
      state,
      data: {
        ...game,
        boxRotationQueue: [...game.boxRotationQueue, entity],
      },
    });
  }

  return state;
};
