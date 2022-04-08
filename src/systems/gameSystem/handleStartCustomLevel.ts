import { State } from '../../type'
import { GameEvent, getGame, setGame } from '../gameSystem'
import { getNextPlayer } from './getNextPlayer'
import { EventHandler } from '@arekrado/canvas-engine'
import {
  runQuickStart,
  setLevelFromGameSettings,
  startLevel,
} from './startLevelUtils'

export const handleStartCustomLevel: EventHandler<
  GameEvent.StartCustomLevelEvent,
  State
> = ({ state }) => {
  state = setLevelFromGameSettings({ state })

  state = setGame({
    state,
    data: {
      currentPlayer: getNextPlayer({ state })?.entity,
    },
  })

  const game = getGame({ state })

  if (!game) {
    return state
  }

  if (game?.customLevelSettings.quickStart) {
    state = runQuickStart({ state })
  }

  state = startLevel({ state, mapEntity: game?.customLevelSettings.mapEntity })

  return state
}
