import { updateComponent } from '@arekrado/canvas-engine'
import { allMaps } from '../../blueprints/mapsBlueprint'
import { gameComponent, GameMap, State } from '../../type'
import { saveStateToData } from '../../utils/localDb'
import { getGame } from '../gameSystem'

export const unlockNextMap = ({ state }: { state: State }): State => {
  const game = getGame({ state })

  if (game?.currentCampaignLevelEntity) {
    const currentMapIndex = allMaps.findIndex(
      ({ entity }) => entity === game?.currentCampaignLevelEntity,
    )

    state = updateComponent<GameMap, State>({
      state,
      name: gameComponent.gameMap,
      entity: allMaps[currentMapIndex + 1]?.entity ?? '',
      update: () => ({
        locked: false,
      }),
    })
  }

  saveStateToData(state)
  return state
}
