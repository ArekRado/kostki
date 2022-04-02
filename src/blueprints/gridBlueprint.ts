import { Box, GameMap, name, State } from '../type'
import {
  createComponent,
  Entity,
  getComponent,
  setEntity,
} from '@arekrado/canvas-engine'
import { setCamera } from '../wrappers/setCamera'
import { getGame, setGame } from '../systems/gameSystem'

export const boxSize = 1
export const boxGap = 0.2
export const boxWithGap = boxSize + boxGap

export const getGridDimensions = ({ state }: { state: State }) => {
  const mapType = getGame({ state })?.customLevelSettings.mapType
  const gameMap = getComponent<GameMap>({
    state,
    name: name.gameMap,
    entity: mapType || '',
  })

  const grid = gameMap?.grid ?? [[]]
  const boxWithGap = boxSize + boxGap
  const gridWidth = grid[0] ? -grid[0].length * boxWithGap : 1
  const gridHeight = grid.length * boxWithGap
  const longerDimension = gridWidth > gridHeight ? gridWidth : gridHeight

  const center = [(gridWidth + 1 + boxGap) / 2, (gridHeight - 1 - boxGap) / 2]

  return {
    width: gridWidth,
    height: gridHeight,
    center,
    cameraDistance: longerDimension / 2 + boxGap,
  }
}

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
