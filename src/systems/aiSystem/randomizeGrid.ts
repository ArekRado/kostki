import { Guid } from '@arekrado/canvas-engine';
import { DataGrid } from '../aiSystem';

type RandomizeGrid = (params: {
  dataGrid: DataGrid;
  currentPlayer: Guid;
}) => DataGrid;
export const randomizeGrid: RandomizeGrid = ({ dataGrid, currentPlayer }) => {
  return dataGrid.reduce((acc1, row, i) => {
    acc1[i] = row.reduce((acc2, box, j) => {
      if (box.player !== currentPlayer || box.player === undefined) {
        return acc2;
      }

      acc2[j] = { ...box, points: Math.random() * 100 };
      return acc2;
    }, row);
    return acc1;
  }, dataGrid);
};
