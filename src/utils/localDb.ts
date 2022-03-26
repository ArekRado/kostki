import { Game, State } from '../type'
import { getGame } from '../systems/gameSystem'

const localDbKey = 'localDbKey'

type SavedData = {
  players: Game['customLevelSettings']['players']
  difficulty: Game['customLevelSettings']['difficulty']
  quickStart: Game['customLevelSettings']['quickStart']
  mapType: Game['customLevelSettings']['mapType']
  colorBlindMode: Game['colorBlindMode']
}

export const getSavedData = (): SavedData | null =>
  JSON.parse(localStorage.getItem(localDbKey) || 'null') as SavedData | null

export const saveStateToData = (state: State) => {
  const game = getGame({ state })

  game &&
    saveData({
      players: game.customLevelSettings.players,
      difficulty: game.customLevelSettings.difficulty,
      quickStart: game.customLevelSettings.quickStart,
      mapType: game.customLevelSettings.mapType,
      colorBlindMode: game.colorBlindMode,
    })
}

export const saveData = (data: SavedData) => {
  localStorage.setItem(localDbKey, JSON.stringify(data))
}

export const removeSavedData = () => {
  localStorage.removeItem(localDbKey)
}
