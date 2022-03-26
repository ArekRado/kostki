import { DataGrid } from '../aiSystem'

type DisabledAIMove = (params: { dataGrid: DataGrid }) => DataGrid
export const disabledAIMove: DisabledAIMove = ({ dataGrid }) => {
  return dataGrid.reduce((acc1, row, i) => {
    acc1[i] = row.reduce((acc2, box, j) => {
      // This entity doesn't fit to any player so AI will never click on this box
      acc2[j].player = '-1'

      return acc2
    }, row)
    return acc1
  }, dataGrid)
}
