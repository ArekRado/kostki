import { gameComponent, State, GameMap } from '../type'
import { createComponent } from '@arekrado/canvas-engine'
import { createEntity } from '@arekrado/canvas-engine/entity/createEntity'
import { SavedData } from '../utils/localDb'
import { small0 } from './maps/small0'
import { small1 } from './maps/small1'
import { small2 } from './maps/small2'
import { medium0 } from './maps/medium0'
import { medium1 } from './maps/medium1'
import { medium2 } from './maps/medium2'
import { huge1 } from './maps/huge1'
import { huge0 } from './maps/huge0'
import { huge2 } from './maps/huge2'
import { huge3 } from './maps/huge3'
import { huge4 } from './maps/huge4'
import { campaign0 } from './maps/campaign0'
import { campaign1 } from './maps/campaign1'
import { campaign2 } from './maps/campaign2'
import { campaign3 } from './maps/campaign3'

const maps: Omit<GameMap, 'name'>[] = [
  small0,
  small1,
  small2,
  medium0,
  medium1,
  medium2,
  huge0,
  huge1,
  huge2,
  huge3,
  huge4,

  campaign0,
  campaign1,
  campaign2,
  campaign3,
]

export const gameMapsBlueprint = ({
  state,
  savedData,
}: {
  state: State
  savedData: SavedData
}): State => {
  maps.forEach((map) => {
    state = createEntity({ state, entity: map.entity })

    const locked = !savedData.unlockedCampaignMapEntities.find(
      (unlockedMapEntity) => unlockedMapEntity === map.entity,
    )

    state = createComponent<GameMap, State>({
      state,
      data: {
        name: gameComponent.gameMap,
        ...map,
        locked: map.locked === false ? false : locked,
      },
    })
  })

  return state
}
