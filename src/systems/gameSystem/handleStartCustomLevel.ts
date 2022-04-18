import { Page, State } from '../../type'
import { GameEvent, getGame, setGame } from '../gameSystem'
import { getNextPlayer } from './getNextPlayer'
import { EventHandler } from '@arekrado/canvas-engine'
import {
  runQuickStart,
  setLevelFromGameSettings,
  startLevel,
} from './startLevelUtils'
import { Game, gameComponent } from '../../type'
import { gameEntity } from '../gameSystem'
import { updateComponent } from '@arekrado/canvas-engine'
import { collectTurnStatistics } from './handleNextTurn'

export const handleStartCustomLevel: EventHandler<
  GameEvent.StartCustomLevelEvent,
  State
> = ({ state }) => {
  state = updateComponent<Game, State>({
    state,
    name: gameComponent.game,
    entity: gameEntity,
    update: () => ({
      statistics: [],
      gameStarted: true,
      page: Page.customLevel,
    }),
  })

  state = setLevelFromGameSettings({ state })
  state = collectTurnStatistics({ state })

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
