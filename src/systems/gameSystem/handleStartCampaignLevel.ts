import { Game, State, gameComponent, Page } from '../../type'
import { gameEntity, GameEvent } from '../gameSystem'
import { getNextPlayer } from './getNextPlayer'
import {
  createComponent,
  EventHandler,
  updateComponent,
} from '@arekrado/canvas-engine'
import { setLevelFromMapEntity, startLevel } from './startLevelUtils'
import { handleCleanScene } from './handleCleanScene'
import { collectTurnStatistics } from './startNextTurn'
import { tutorialEntity } from '../tutorialSystem'
import { createEntity } from '@arekrado/canvas-engine/entity/createEntity'
import { updateTutorial } from '../tutorialSystem/updateTutorial'

export const handleStartCampaignLevel: EventHandler<
  GameEvent.StartCampaignLevelEvent,
  State
> = ({
  state,
  event: {
    payload: { mapEntity },
  },
}) => {
  state = handleCleanScene({
    state,
    event: {
      type: GameEvent.Type.cleanScene,
      payload: {
        newPage: Page.campaignLevel,
      },
    },
  })

  state = updateComponent<Game, State>({
    state,
    name: gameComponent.game,
    entity: gameEntity,
    update: () => ({
      statistics: [],
      gameStarted: true,
    }),
  })

  state = setLevelFromMapEntity({ state, mapEntity })
  state = collectTurnStatistics({ state })

  state = updateComponent<Game, State>({
    state,
    name: gameComponent.game,
    entity: gameEntity,
    update: () => ({
      currentPlayer: getNextPlayer({ state })?.entity,
      currentCampaignLevelEntity: mapEntity,
    }),
  })

  state = createEntity({ state, entity: tutorialEntity })
  state = createComponent({
    state,
    data: {
      entity: tutorialEntity,
      name: gameComponent.tutorial,
    },
  })

  state = updateTutorial({ state })
  state = startLevel({ state, mapEntity })

  return state
}
