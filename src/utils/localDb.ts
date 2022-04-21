import {
  CustomLevelSettingsDifficulty,
  Game,
  GameMap,
  gameComponent,
  State,
} from '../type'
import { getGame } from '../systems/gameSystem'
import { Entity, getComponentsByName } from '@arekrado/canvas-engine'
import { playersList } from '../systems/gameSystem/handleChangeSettings'

const localDbKey = 'localDbKey'

export type SavedData = {
  unlockedCampaignMapEntities: Entity[]
  players: Game['customLevelSettings']['players']
  difficulty: Game['customLevelSettings']['difficulty']
  quickStart: Game['customLevelSettings']['quickStart']
  mapEntity: Game['customLevelSettings']['mapEntity']
  colorBlindMode: Game['colorBlindMode']
  version: Game['version']
}

export const getSavedData = (): SavedData => {
  const data: unknown = JSON.parse(localStorage.getItem(localDbKey) || 'null')

  if (typeof data === 'object' && data !== null) {
    const maybeData = data as Partial<SavedData>
    let difficulty: CustomLevelSettingsDifficulty =
      CustomLevelSettingsDifficulty.easy

    switch (maybeData.difficulty) {
      case CustomLevelSettingsDifficulty.easy:
        difficulty = CustomLevelSettingsDifficulty.easy
        break
      case CustomLevelSettingsDifficulty.medium:
        difficulty = CustomLevelSettingsDifficulty.medium
        break
      case CustomLevelSettingsDifficulty.hard:
        difficulty = CustomLevelSettingsDifficulty.hard
        break
      case CustomLevelSettingsDifficulty.random:
        difficulty = CustomLevelSettingsDifficulty.random
        break
    }

    return {
      unlockedCampaignMapEntities: maybeData.unlockedCampaignMapEntities ?? [],
      difficulty,
      colorBlindMode: maybeData?.colorBlindMode ?? false,
      players: maybeData?.players ?? playersList().slice(0, 4),
      quickStart: maybeData?.quickStart ?? true,
      mapEntity: maybeData?.mapEntity ?? '',
      version: maybeData?.version ?? '',
    }
  }
  return {
    unlockedCampaignMapEntities: [],
    difficulty: CustomLevelSettingsDifficulty.easy,
    colorBlindMode: false,
    players: playersList().slice(0, 4),
    quickStart: true,
    mapEntity: '',
    version: '',
  }
}

export const saveStateToData = (state: State) => {
  const game = getGame({ state })
  const maps = Object.values(
    getComponentsByName<GameMap>({
      name: gameComponent.gameMap,
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
      version: game.version,
    })
}

export const saveData = (data: SavedData) => {
  localStorage.setItem(localDbKey, JSON.stringify(data))
}

export const removeSavedData = () => {
  localStorage.removeItem(localDbKey)
}
