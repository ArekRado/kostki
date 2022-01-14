import { Entity, setComponent } from '@arekrado/canvas-engine';
import { Game, State } from '../../type';
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
    return setComponent<Game, State>({
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
