import { Entity, updateComponent } from '@arekrado/canvas-engine'
import { Game, gameComponent, State } from '../../type'
import { gameEntity } from '../gameSystem'

type PushBoxToRotationQueue = (params: {
  entity: Entity
  state: State
}) => State
export const pushBoxToRotationQueue: PushBoxToRotationQueue = ({
  entity,
  state,
}) => {
  return updateComponent<Game, State>({
    state,
    name: gameComponent.game,
    entity: gameEntity,
    update: (game) => ({
      boxRotationQueue: [...game.boxRotationQueue, entity],
    }),
  })
}
