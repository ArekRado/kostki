import { Box, gameComponent, State } from '../../type'
import { LogoEvent } from '../logoSystem'
import { logoGrid } from './logoGrid'
import { createComponent, emitEvent, createEntity } from '@arekrado/canvas-engine'
import { setCamera } from '../../wrappers/setCamera'

export const create = ({ state }: { state: State }): State => {
  const sceneRef = state.babylonjs.sceneRef
  if (!sceneRef) {
    return state
  }

  state = logoGrid.reduce(
    (acc1, row, y) =>
      row.reduce((acc2, boxEntity, x) => {
        if (boxEntity === '') {
          return acc2
        }

        acc2 = createEntity({ state: acc2, entity: boxEntity })
        return createComponent<Box, State>({
          state: acc2,
          data: {
            name: gameComponent.box,
            entity: boxEntity,
            isAnimating: false,
            dots: 0,
            gridPosition: [x, y],
            player: '',
          },
        })
      }, acc1),
    state,
  )

  // I don't know why updateLogoPosition is not enough
  state = setCamera({ state, data: {} })

  emitEvent<LogoEvent.RotateRandomLogoBoxEvent>({
    type: LogoEvent.Type.rotateRandomLogoBox,
    payload: null,
  })

  return state
}
