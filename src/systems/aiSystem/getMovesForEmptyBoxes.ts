import { DataGrid } from '../aiSystem'
import { AIGridPoints } from './../aiSystem/aiGridPoints'

type GetMovesForEmptyBoxes = (params: {
  dataGrid: DataGrid
  aIGridPoints: AIGridPoints
}) => DataGrid
export const getMovesForEmptyBoxes: GetMovesForEmptyBoxes = ({
  dataGrid,
  aIGridPoints,
}) =>
  dataGrid.reduce((acc1, row, i) => {
    acc1[i] = row.reduce((acc2, box, j) => {
      const isEmpty = box.player === undefined
      const points = isEmpty ? box.points + aIGridPoints.emptyBox : box.points

      acc2[j] = { ...box, points }

      return acc2
    }, row)
    return acc1
  }, dataGrid)
