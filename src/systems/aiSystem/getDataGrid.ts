import { getComponent } from '@arekrado/canvas-engine'
import { Box, name, State } from '../../type'
import { DataGrid } from '../aiSystem'
import { getGame } from './../gameSystem'

type GetDataGrid = (params: { state: State }) => DataGrid
export const getDataGrid: GetDataGrid = ({ state }) => {
  const game = getGame({ state })

  if (game) {
    const grid: DataGrid = game.grid.reduce((acc, entity) => {
      const box = getComponent<Box>({
        name: name.box,
        state,
        entity,
      })

      if (box) {
        const x = box.gridPosition[0]
        const y = box.gridPosition[1]

        if (!acc[x]) {
          acc[x] = []
        }

        acc[x][y] = {
          ...box,
          points: 0,
        }
      }

      return acc
    }, [] as DataGrid)

    return grid
  }

  return []
}
