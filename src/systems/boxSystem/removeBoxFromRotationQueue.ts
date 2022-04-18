import { Entity, updateComponent } from '@arekrado/canvas-engine'
import { Game, gameComponent, State } from '../../type'
import { gameEntity } from '../gameSystem'

type RemoveBoxFromRotationQueue = (params: {
  entity: Entity
  state: State
}) => State
export const removeBoxFromRotationQueue: RemoveBoxFromRotationQueue = ({
  entity,
  state,
}) => {
  return updateComponent<Game, State>({
    state,
    name: gameComponent.game,
    entity: gameEntity,
    update: (game) => ({
      boxRotationQueue: game.boxRotationQueue.filter(
        (boxEntity) => boxEntity !== entity,
      ),
    }),
  })
}
