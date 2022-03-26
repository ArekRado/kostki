import { AI, State } from '../../type'
import { set1 } from '../../utils/textureSets'
import { getGame } from '../gameSystem'

export const getTextureSet = ({
  state,
  ai,
}: {
  state: State
  ai: AI | undefined
}): AI['textureSet'] => {
  const game = getGame({ state })

  if (!ai) {
    return set1
  }

  return game?.colorBlindMode ? ai.textureSet : set1
}
