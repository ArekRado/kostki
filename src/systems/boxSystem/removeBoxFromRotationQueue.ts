import { setComponent } from '../../ecs/component';
import { Entity, Game, State } from '../../ecs/type';
import { getGame } from '../gameSystem';

type RemoveBoxFromRotationQueue = (params: {
  entity: Entity;
  state: State;
}) => State;
export const removeBoxFromRotationQueue: RemoveBoxFromRotationQueue = ({
  entity,
  state,
}) => {
  const game = getGame({ state });

  if (game) {
    return setComponent<Game>({
      state,
      data: {
        ...game,
        boxRotationQueue: game.boxRotationQueue.filter(
          (boxEntity) => boxEntity !== entity
        ),
      },
    });
  }

  return state;
};
