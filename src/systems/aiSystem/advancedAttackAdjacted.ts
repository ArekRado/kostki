import { Entity } from '@arekrado/canvas-engine';
import { DataGrid, EnhancedBox } from '../aiSystem';
import { hardAIGridPoints } from './aiGridPoints';
import { getAdjactedBoxes, getGrid3x3 } from './calculateLocalStrategy';

type CheckAdjactedBox = (params: {
  currentPlayer: Entity;
  adjactedBox: EnhancedBox;
  dataGrid: DataGrid;
  position: [number, number];
}) => boolean;
const checkAdjactedBox: CheckAdjactedBox = ({
  currentPlayer,
  adjactedBox,
  dataGrid,
  position: [i, j],
}) => {
  // AND enemy box is not adjacted to any non-player boxes (undefined is ok) which have more dots than enemy box (equal is ok)

  const grid3x3 = getGrid3x3(dataGrid, [i, j]);
  // adjacted boxes of adjacted box
  const adjactedBoxes = getAdjactedBoxes(grid3x3);

  const adjactedAdjactedBoxesAreNotProtectingBox = adjactedBoxes.every(
    (box) => {
      // AdjactedAdjacted box is player or empty so it's safe
      if (
        box === undefined ||
        box.player === currentPlayer ||
        box.player === undefined
      ) {
        return true;
      } else if (box.dots <= adjactedBox.dots) {
        return true;
      }

      return false;
    }
  );

  return adjactedAdjactedBoxesAreNotProtectingBox;
};

type AdvancedAttackAdjacted = (params: {
  currentPlayer: Entity;
  dataGrid: DataGrid;
}) => DataGrid;
/**
 * Tries to determine if it's worth to capture adjacted boxes:
 *
 * if player box
 *    is not adjacted to any 6 dots box // TODO questionable
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
      if (box.player !== currentPlayer) {
        return acc2;
      }

      const grid3x3 = getGrid3x3(dataGrid, [i, j]);
      const adjactedBoxes = getAdjactedBoxes(grid3x3);

      const isAdjactedToAny6DotsBox = adjactedBoxes.some(
        (box) => box?.dots === 6
      );

      if (isAdjactedToAny6DotsBox) {
        return acc2;
      }

      const points = adjactedBoxes.reduce((acc, adjactedBox) => {
        if (!adjactedBox) {
          return acc;
        }

        const isAdjactedToEnemyBox =
          adjactedBox.player !== undefined &&
          adjactedBox.player !== currentPlayer;

        const hasEqualOrMoreDotsThanEnemyBox = box.dots >= adjactedBox.dots;

        if (isAdjactedToEnemyBox && hasEqualOrMoreDotsThanEnemyBox) {
          const isWorhtToAttackThisBox = checkAdjactedBox({
            currentPlayer,
            adjactedBox,
            dataGrid,
            position: adjactedBox.gridPosition,
          });

          if (isWorhtToAttackThisBox) {
            const turnsToCaptureBox = 6 / box.dots;
            acc +=
              (adjactedBox.dots * hardAIGridPoints.advancedAttack) /
              turnsToCaptureBox;
          }
        }

        return acc;
      }, 0);

      // // Check if all branches are not protected
      // const branchIsProtected = points.some((point) => point === 0);
      // const totalPoints = branchIsProtected
      //   ? 0
      //   : points.reduce((acc, point) => acc + point, 0);

      acc2[j] = { ...box, points: box.points + points };
      return acc2;
    }, row);
    return acc1;
  }, dataGrid);
};
