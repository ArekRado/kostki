import { Box, Guid } from '../../ecs/type';
import { DataGrid } from '../aiSystem';

type GetBestRandomBox = (params: {
  currentPlayer: Guid;
  dataGrid: DataGrid;
}) => Box | undefined;
export const getBestRandomBox: GetBestRandomBox = ({
  currentPlayer,
  dataGrid,
}) => {
  let highestScore = -Infinity;
  let highestBoxes: Box[] = [];

  dataGrid.forEach((row) => {
    row.forEach((box) => {
      const isEmpty = box.player === undefined;
      const isPlayer = box.player === currentPlayer;

      if (isEmpty || isPlayer) {
        if (box.points > highestScore) {
          highestBoxes = [];
        }

        if (box.points >= highestScore) {
          highestScore = box.points;
          highestBoxes.push(box);
        }
      }
    });
  });

  const randomIndex = Math.floor(Math.random() * highestBoxes.length);
  return highestBoxes[randomIndex];
};
