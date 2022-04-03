import { State } from '../../type'
import { GameEvent, setGame } from '../gameSystem'
import { getNextPlayer } from './getNextPlayer'
import { EventHandler } from '@arekrado/canvas-engine'
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
  state = setLevelFromMapEntity({ state, mapEntity })

  state = setGame({
    state,
    data: {
      currentPlayer: getNextPlayer({ state })?.entity,
    },
  })

  state = startLevel({ state })

  return state
}
