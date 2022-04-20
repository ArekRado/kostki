import {
  componentName,
  EventHandler,
  getComponent,
  Transform,
} from '@arekrado/canvas-engine'
import { AI, Box, gameComponent, State } from '../../type'
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
    name: gameComponent.box,
    entity: event.payload.boxEntity,
  })

  const canClickOnBox =
    box?.player === undefined || box?.player === currentPlayer

  const boxTransform = getComponent<Transform>({
    name: componentName.transform,
    entity: event.payload.boxEntity,
    state,
  })

  if (
    boxTransform &&
    gameStarted &&
    boxRotationQueue.length === 0 &&
    canClickOnBox
  ) {
    const ai = getComponent<AI, State>({
      name: gameComponent.ai,
      state,
      entity: currentPlayer,
    })

    if (box && ai?.human) {
      state = setMarker({
        state,
        data: {
          color: ai.color,
          position: [boxTransform.position[0], boxTransform.position[1]],
        },
      })

      state = onClickBox({ box, state, ai })
    }
  }

  return state
}
