import { Game, State, name } from '../../type'
import { gameEntity, GameEvent, setGame } from '../gameSystem'
import { getNextPlayer } from './getNextPlayer'
import { EventHandler, updateComponent } from '@arekrado/canvas-engine'
import { setLevelFromMapEntity, startLevel } from './startLevelUtils'

export const handleStartCampaignLevel: EventHandler<
  GameEvent.StartCampaignLevelEvent,
  State
> = ({
  state,
  event: {
    payload: { mapEntity },
  },
}) => {
  state = updateComponent<Game, State>({
    state,
    name: name.game,
    entity: gameEntity,
    update: () => ({
      statistics: [],
    }),
  })

  state = setLevelFromMapEntity({ state, mapEntity })

  state = setGame({
    state,
    data: {
      currentPlayer: getNextPlayer({ state })?.entity,
    },
  })

  state = updateComponent<Game, State>({
    state,
    name: name.game,
    entity: gameEntity,
    update: () => ({
      currentPlayer: getNextPlayer({ state })?.entity,
    }),
  })

  state = startLevel({ state, mapEntity })

  return state
}
