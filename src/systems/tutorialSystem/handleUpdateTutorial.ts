import { EventHandler, getComponent } from '@arekrado/canvas-engine'
import { updateComponent } from '@arekrado/canvas-engine'
import { gameComponent, State, Tutorial } from '../../type'
import { getGame } from '../gameSystem'
import { tutorialEntity } from '../tutorialSystem'

import { campaign0 } from '../../blueprints/maps/campaign0'
import { campaign1 } from '../../blueprints/maps/campaign1'
import { campaign2 } from '../../blueprints/maps/campaign2'
import { campaign3 } from '../../blueprints/maps/campaign3'

export const handleUpdateTutorial: EventHandler<null, State> = ({ state }) => {
  const tutorial = getComponent({
    state,
    entity: tutorialEntity,
    name: gameComponent.tutorial,
  })

  const game = getGame({ state })

  if (!tutorial || !game) {
    return state
  }

  const { round, currentCampaignLevelEntity } = game

  if (currentCampaignLevelEntity === campaign0.entity) {
    if (round === 0) {
      // forceUserToClickOnBox(...)
      state = updateComponent<Tutorial, State>({
        state,
        entity: tutorialEntity,
        name: gameComponent.tutorial,
        update: () => ({
          tipText: 'le',
        }),
      })
    }
  }
  if (currentCampaignLevelEntity === campaign1.entity) {
  }
  if (currentCampaignLevelEntity === campaign2.entity) {
  }
  if (currentCampaignLevelEntity === campaign3.entity) {
  }

  return state
}
