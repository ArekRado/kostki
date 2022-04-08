import { Box, name, State } from '../type'
import { createComponent, Entity, setEntity } from '@arekrado/canvas-engine'
import { setCamera } from '../wrappers/setCamera'
import { getGame, setGame } from '../systems/gameSystem'
import { getGridDimensions } from '../systems/gameSystem/startLevelUtils'

export type BasicBox = { dots: number; player: Entity | undefined }

type GridBlueprint = (params: { dataGrid: BasicBox[][]; state: State }) => State
export const gridBlueprint: GridBlueprint = ({ dataGrid, state }) => {
  const { center, cameraDistance } = getGridDimensions({ state })

  setCamera({
    state,
    data: { position: [center[0], center[1]], distance: cameraDistance },
  })

  state = dataGrid.reduce(
    (acc1, row, x) =>
      row.reduce((acc2, { dots, player }, y) => {
        const entity = Math.random().toString()
        acc2 = setEntity({ state: acc2, entity })
        acc2 = createComponent<Box, State>({
          state: acc2,
          data: {
            name: name.box,
            entity,
            isAnimating: false,
            dots,
            gridPosition: [x, y],
            player,
          },
        })

        const game = getGame({ state: acc2 })

        if (!game) {
          return acc2
        }

        return setGame({
          state: acc2,
          data: {
            ...game,
            grid: [...game.grid, entity],
          },
        })
      }, acc1),
    state,
  )

  return state
}
