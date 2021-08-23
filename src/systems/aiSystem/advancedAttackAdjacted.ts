import { AI } from '../../ecs/type';
import { DataGrid } from '../aiSystem';

type AdvancedAttackAdjacted = (params: {
  currentPlayer: AI;
  dataGrid: DataGrid;
}) => DataGrid;
/**
 * Tries to determine if it's worth to capture adjacted boxes:
 * 
 * if player box 
 *    is not adjacted to any 6 dots box // questionable
 *    AND is adjacted to enemy box
 *    AND has equal or more dots than adjacted enemy box 
 *    AND enemy box is not adjacted to any non-player boxes (undefined is ok) which have more dots than enemy box (equal is ok)
 * then
 *    add points to player box depending on:
 *      how many turns player needs to capture box
 *      how many points will have captured box
 *      how many points have nearby (enemy and player) boxes (it's losing box risk)
 * else 
 *    do nothing
 */
export const advancedAttackAdjacted: AdvancedAttackAdjacted = ({
  dataGrid,
  currentPlayer,
}) => {
  return dataGrid.reduce((acc1, row, i) => {
    acc1[i] = row.reduce((acc2, box, j) => {
      if (box.player !== currentPlayer.entity && box.player !== undefined) {
        return acc2;
      }


      acc2[j] = { ...box, points: box.points };
      return acc2;
    }, row);
    return acc1;
  }, dataGrid);
};
