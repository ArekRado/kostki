import { getComponent, Guid } from '@arekrado/canvas-engine'
import { AI, State, name } from '../../type'
import { getGame } from '../gameSystem'

type GetNextActivePlayer = (params: {
  playersQueue: Guid[]
  index: number
  state: State
}) => AI | undefined
const getNextActivePlayer: GetNextActivePlayer = ({
  playersQueue,
  index,
  state,
}) => {
  const ai = getComponent<AI>({
    state,
    name: name.ai,
    entity: playersQueue[index],
  })

  if (ai?.active) {
    return ai
  }

  return getNextActivePlayer({
    playersQueue,
    index: index >= playersQueue.length ? 0 : index + 1,
    state,
  })
}

type GetNextPlayer = (params: { state: State }) => AI | undefined
export const getNextPlayer: GetNextPlayer = ({ state }) => {
  const game = getGame({ state })

  if (!game || game?.playersQueue.length === 0) {
    return undefined
  }

  const currentPlayerIndex = game.playersQueue.findIndex(
    (entity) => game.currentPlayer === entity,
  )

  const nextAi = getNextActivePlayer({
    playersQueue: game.playersQueue,
    index: currentPlayerIndex + 1,
    state,
  })

  return nextAi
}
