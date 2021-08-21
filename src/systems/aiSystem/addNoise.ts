import { Guid } from '../../ecs/type';
import { DataGrid } from '../aiSystem';

type AddNoise = (params: {
  dataGrid: DataGrid;
  minNoise: number;
  currentPlayer: Guid;
}) => DataGrid;
export const addNoise: AddNoise = ({ dataGrid, minNoise, currentPlayer }) => {
  return dataGrid.reduce((acc1, row, i) => {
    acc1[i] = row.reduce((acc2, box, j) => {
      if (box.player !== currentPlayer || box.player === undefined) {
        return acc2;
      }

      const randomPercentage = Math.max(minNoise, Math.random() * 100);
      const noise = (box.points * randomPercentage) / 100;

      acc2[j] = { ...box, points: box.points - noise };
      return acc2;
    }, row);
    return acc1;
  }, dataGrid);
};