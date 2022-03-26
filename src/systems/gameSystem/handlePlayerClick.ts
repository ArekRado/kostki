import { EventHandler, getComponent } from '@arekrado/canvas-engine'
import { boxWithGap } from '../../blueprints/gridBlueprint'
import { AI, Box, name, State } from '../../type'
import { onClickBox } from '../boxSystem/onClickBox'
import { GameEvent, getGame } from '../gameSystem'
import { setMarker } from '../markerSystem'

export const handlePlayerClick: EventHandler<
  GameEvent.PlayerClickEvent,
  State
> = ({ state, event }) => {
  const game = getGame({ state })
  if (!game) {
    return state
  }

  const { currentPlayer, gameStarted, boxRotationQueue } = game

  const box = getComponent<Box, State>({
    state,
    name: name.box,
    entity: event.payload.boxEntity,
  })

  const canClickOnBox =
    box?.player === undefined || box?.player === currentPlayer

  if (gameStarted && boxRotationQueue.length === 0 && canClickOnBox) {
    const ai = getComponent<AI, State>({
      name: name.ai,
      state,
      entity: currentPlayer,
    })

    if (box && ai?.human) {
      state = setMarker({
        state,
        data: {
          color: ai.color,
          position: [
            box.gridPosition[0] * boxWithGap,
            box.gridPosition[1] * boxWithGap,
          ],
        },
      })
      state = onClickBox({ box, state, ai })
    }
  }

  return state
}
