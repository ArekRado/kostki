import { Game, GameMap, name, State } from '../type'
import { getGame } from '../systems/gameSystem'
import { Entity, getComponentsByName } from '@arekrado/canvas-engine'

const localDbKey = 'localDbKey'

export type SavedData = {
  unlockedCampaignMapEntities: Entity[]
  players: Game['customLevelSettings']['players']
  difficulty: Game['customLevelSettings']['difficulty']
  quickStart: Game['customLevelSettings']['quickStart']
  mapEntity: Game['customLevelSettings']['mapEntity']
  colorBlindMode: Game['colorBlindMode']
}

export const getSavedData = (): Partial<SavedData> | null =>
  JSON.parse(localStorage.getItem(localDbKey) || 'null') as SavedData | null

export const saveStateToData = (state: State) => {
  const game = getGame({ state })
  const maps = Object.values(
    getComponentsByName<GameMap>({
      name: name.gameMap,
      state,
    }) ?? {},
  )

  game &&
    saveData({
      unlockedCampaignMapEntities: maps.reduce((acc, { entity, locked }) => {
        if (!locked) {
          return [...acc, entity]
        }

        return acc
      }, [] as SavedData['unlockedCampaignMapEntities']),
      players: game.customLevelSettings.players,
      difficulty: game.customLevelSettings.difficulty,
      quickStart: game.customLevelSettings.quickStart,
      mapEntity: game.customLevelSettings.mapEntity,
      colorBlindMode: game.colorBlindMode,
    })
}

export const saveData = (data: SavedData) => {
  localStorage.setItem(localDbKey, JSON.stringify(data))
}

export const removeSavedData = () => {
  localStorage.removeItem(localDbKey)
}
