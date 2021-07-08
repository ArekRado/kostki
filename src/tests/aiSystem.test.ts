import 'regenerator-runtime/runtime';
import { scene, camera } from '../.';
import { BasicBox, createGrid } from '../blueprints/createGrid';
import {
  calculateLocalStrategy,
  getBestRandomBox,
  getDataGrid,
  getMovesForEmptyBoxes,
  localStrategyAdjacted,
  localStrategyDiagonall,
  pointsFor,
} from '../systems/aiSystem';
import { getGameInitialState } from '../utils/getGameInitialState';

const basicBox: BasicBox = {
  player: '',
  dots: 0,
};

const basicGrid2x2 = [
  [basicBox, basicBox],
  [basicBox, basicBox],
];

describe('aiSystem', () => {
  it('getDataGrid - should return all boxes in a matrix', () => {
    let state = createGrid({
      dataGrid: basicGrid2x2,
      scene,
      camera,
      state: getGameInitialState(),
    });

    const grid = getDataGrid({ state });

    expect(grid[0][0]).toBeDefined();
    expect(grid[0][1]).toBeDefined();
    expect(grid[1][0]).toBeDefined();
    expect(grid[1][1]).toBeDefined();

    expect(grid[2]).toBeUndefined();

    expect(grid[0][0].gridPosition).toEqual([0, 0]);
    expect(grid[0][1].gridPosition).toEqual([0, 1]);
    expect(grid[1][0].gridPosition).toEqual([1, 0]);
    expect(grid[1][1].gridPosition).toEqual([1, 1]);
  });

  describe('getMovesForEmptyBoxes', () => {
    it('all empty boxes - should return grid with points', () => {
      let state = createGrid({
        dataGrid: basicGrid2x2,
        scene,
        camera,
        state: getGameInitialState(),
      });

      const grid = getMovesForEmptyBoxes({
        dataGrid: getDataGrid({ state }),
      });

      expect(grid[0][0].points).toEqual(pointsFor.emptyBox);
      expect(grid[0][1].points).toEqual(pointsFor.emptyBox);
      expect(grid[1][0].points).toEqual(pointsFor.emptyBox);
      expect(grid[1][1].points).toEqual(pointsFor.emptyBox);
    });

    it('one non empty box - should return grid with points', () => {
      let state = createGrid({
        dataGrid: [
          [basicBox, { ...basicBox, dots: 1 }],
          [{ ...basicBox, player: 'any' }, basicBox],
        ],
        scene,
        camera,
        state: getGameInitialState(),
      });

      const grid = getMovesForEmptyBoxes({
        dataGrid: getDataGrid({ state }),
      });

      expect(grid[0][0].points).toEqual(pointsFor.emptyBox);
      expect(grid[0][1].points).toEqual(0);
      expect(grid[1][0].points).toEqual(0);
      expect(grid[1][1].points).toEqual(pointsFor.emptyBox);
    });
  });

  describe('getBestRandomBox', () => {
    it('should return best box to click', () => {
      let state = createGrid({
        dataGrid: basicGrid2x2,
        scene,
        camera,
        state: getGameInitialState(),
      });

      const bestBox = getBestRandomBox(getDataGrid({ state }));

      expect(bestBox.gridPosition).toEqual([0, 0]);
    });

    it('should return best box to click', () => {
      let state = createGrid({
        dataGrid: [
          [
            { ...basicBox, player: 'any' },
            { ...basicBox, dots: 1 },
          ],
          [basicBox, basicBox],
        ],
        scene,
        camera,
        state: getGameInitialState(),
      });

      const grid = getMovesForEmptyBoxes({
        dataGrid: getDataGrid({ state }),
      });

      const bestBox = getBestRandomBox(grid);

      expect(bestBox.gridPosition).toEqual([1, 0]);
    });
  });

  describe('localStrategyAdjacted', () => {
    it('should set proper points - only equal oponents', () => {
      const player1 = 'player1';
      const player2 = 'player2';

      let state = createGrid({
        dataGrid: [
          [
            { dots: 1, player: player2 },
            { dots: 0, player: player2 },
            { dots: 1, player: player2 },
          ],
          [
            { dots: 0, player: player2 },
            { dots: 0, player: player1 }, // center
            { dots: 0, player: player2 },
          ],
          [
            { dots: 1, player: player2 },
            { dots: 0, player: player2 },
            { dots: 1, player: player2 },
          ],
        ],
        scene,
        camera,
        state: getGameInitialState(),
      });

      const points = localStrategyAdjacted(getDataGrid({ state }));

      // Box is surronded by 4 equal opononents
      // diagonall boxes should not change points
      expect(points).toEqual(
        pointsFor.adjacted.playerEqualToOponent +
          pointsFor.adjacted.playerEqualToOponent +
          pointsFor.adjacted.playerEqualToOponent +
          pointsFor.adjacted.playerEqualToOponent
      );
    });

    it('should set proper points - only better oponents', () => {
      const player1 = 'player1';
      const player2 = 'player2';

      let state = createGrid({
        dataGrid: [
          [
            { dots: 1, player: player2 },
            { dots: 5, player: player2 },
            { dots: 1, player: player2 },
          ],
          [
            { dots: 5, player: player2 },
            { dots: 0, player: player1 }, // center
            { dots: 5, player: player2 },
          ],
          [
            { dots: 1, player: player2 },
            { dots: 5, player: player2 },
            { dots: 1, player: player2 },
          ],
        ],
        scene,
        camera,
        state: getGameInitialState(),
      });

      const points = localStrategyAdjacted(getDataGrid({ state }));

      // Box is surronded by 4 better opononents
      // diagonall boxes should not change points
      expect(points).toEqual(
        pointsFor.adjacted.playerLessThanOponent +
          pointsFor.adjacted.playerLessThanOponent +
          pointsFor.adjacted.playerLessThanOponent +
          pointsFor.adjacted.playerLessThanOponent
      );
    });

    it('should set proper points - only worse oponents', () => {
      const player1 = 'player1';
      const player2 = 'player2';

      let state = createGrid({
        dataGrid: [
          [
            { dots: 1, player: player2 },
            { dots: 2, player: player2 },
            { dots: 1, player: player2 },
          ],
          [
            { dots: 2, player: player2 },
            { dots: 5, player: player1 }, // center
            { dots: 2, player: player2 },
          ],
          [
            { dots: 1, player: player2 },
            { dots: 2, player: player2 },
            { dots: 1, player: player2 },
          ],
        ],
        scene,
        camera,
        state: getGameInitialState(),
      });

      const points = localStrategyAdjacted(getDataGrid({ state }));

      // Box is surronded by 4 worse opononents
      // diagonall boxes should not change points
      expect(points).toEqual(
        pointsFor.adjacted.playerMoreThanOponent +
          pointsFor.adjacted.playerMoreThanOponent +
          pointsFor.adjacted.playerMoreThanOponent +
          pointsFor.adjacted.playerMoreThanOponent
      );
    });
  });

  describe('localStrategyDiagonall', () => {
    it('should set proper points - only equal oponents', () => {
      const player1 = 'player1';
      const player2 = 'player2';

      let state = createGrid({
        dataGrid: [
          [
            { dots: 0, player: player2 },
            { dots: 1, player: player2 },
            { dots: 0, player: player2 },
          ],
          [
            { dots: 1, player: player2 },
            { dots: 0, player: player1 }, // center
            { dots: 1, player: player2 },
          ],
          [
            { dots: 0, player: player2 },
            { dots: 1, player: player2 },
            { dots: 0, player: player2 },
          ],
        ],
        scene,
        camera,
        state: getGameInitialState(),
      });

      const points = localStrategyDiagonall(getDataGrid({ state }));

      // Box is surronded by 4 equal opononents
      // Adjacted boxes should not change points
      expect(points).toEqual(
        pointsFor.diagonall.playerEqualToOponent +
          pointsFor.diagonall.playerEqualToOponent +
          pointsFor.diagonall.playerEqualToOponent +
          pointsFor.diagonall.playerEqualToOponent
      );
    });

    it('should set proper points - only better oponents', () => {
      const player1 = 'player1';
      const player2 = 'player2';

      let state = createGrid({
        dataGrid: [
          [
            { dots: 5, player: player2 },
            { dots: 1, player: player2 },
            { dots: 5, player: player2 },
          ],
          [
            { dots: 1, player: player2 },
            { dots: 0, player: player1 }, // center
            { dots: 1, player: player2 },
          ],
          [
            { dots: 5, player: player2 },
            { dots: 1, player: player2 },
            { dots: 5, player: player2 },
          ],
        ],
        scene,
        camera,
        state: getGameInitialState(),
      });

      const points = localStrategyDiagonall(getDataGrid({ state }));

      // Box is surronded by 4 better opononents
      // Adjacted boxes should not change points
      expect(points).toEqual(
        pointsFor.diagonall.playerLessThanOponent +
          pointsFor.diagonall.playerLessThanOponent +
          pointsFor.diagonall.playerLessThanOponent +
          pointsFor.diagonall.playerLessThanOponent
      );
    });

    it('should set proper points - only worse oponents', () => {
      const player1 = 'player1';
      const player2 = 'player2';

      let state = createGrid({
        dataGrid: [
          [
            { dots: 2, player: player2 },
            { dots: 1, player: player2 },
            { dots: 2, player: player2 },
          ],
          [
            { dots: 1, player: player2 },
            { dots: 5, player: player1 }, // center
            { dots: 1, player: player2 },
          ],
          [
            { dots: 2, player: player2 },
            { dots: 1, player: player2 },
            { dots: 2, player: player2 },
          ],
        ],
        scene,
        camera,
        state: getGameInitialState(),
      });

      const points = localStrategyDiagonall(getDataGrid({ state }));

      // Box is surronded by 4 worse opononents
      // Adjacted boxes should not change points
      expect(points).toEqual(
        pointsFor.diagonall.playerMoreThanOponent +
          pointsFor.diagonall.playerMoreThanOponent +
          pointsFor.diagonall.playerMoreThanOponent +
          pointsFor.diagonall.playerMoreThanOponent
      );
    });
  });

  describe('calculateLocalStrategy', () => {
    it('should set proper points - only equal oponents', () => {
      const player1 = 'player1';
      const player2 = 'player2';

      let state = createGrid({
        dataGrid: [
          [
            { dots: 0, player: player2 },
            { dots: 1, player: player2 },
            { dots: 0, player: player2 },
          ],
          [
            { dots: 1, player: player2 },
            { dots: 0, player: player1 }, // center
            { dots: 1, player: player2 },
          ],
          [
            { dots: 0, player: player2 },
            { dots: 1, player: player2 },
            { dots: 0, player: player2 },
          ],
        ],
        scene,
        camera,
        state: getGameInitialState(),
      });

      const points = calculateLocalStrategy({
        dataGrid: getDataGrid({ state }),
        state,
      });

      // Box is surronded by 4 equal opononents
      // Adjacted boxes should not change points
      expect(points).toEqual(
        pointsFor.diagonall.playerEqualToOponent +
          pointsFor.diagonall.playerEqualToOponent +
          pointsFor.diagonall.playerEqualToOponent +
          pointsFor.diagonall.playerEqualToOponent
      );
    });

    it('should set proper points - only better oponents', () => {
      const player1 = 'player1';
      const player2 = 'player2';

      let state = createGrid({
        dataGrid: [
          [
            { dots: 5, player: player2 },
            { dots: 1, player: player2 },
            { dots: 5, player: player2 },
          ],
          [
            { dots: 1, player: player2 },
            { dots: 0, player: player1 }, // center
            { dots: 1, player: player2 },
          ],
          [
            { dots: 5, player: player2 },
            { dots: 1, player: player2 },
            { dots: 5, player: player2 },
          ],
        ],
        scene,
        camera,
        state: getGameInitialState(),
      });

      const points = calculateLocalStrategy({
        dataGrid: getDataGrid({ state }),
        state,
      });

      // Box is surronded by 4 better opononents
      // Adjacted boxes should not change points
      expect(points).toEqual(
        pointsFor.diagonall.playerLessThanOponent +
          pointsFor.diagonall.playerLessThanOponent +
          pointsFor.diagonall.playerLessThanOponent +
          pointsFor.diagonall.playerLessThanOponent
      );
    });

    it('should set proper points - only worse oponents', () => {
      const player1 = 'player1';
      const player2 = 'player2';

      let state = createGrid({
        dataGrid: [
          [
            { dots: 2, player: player2 },
            { dots: 1, player: player2 },
            { dots: 2, player: player2 },
          ],
          [
            { dots: 1, player: player2 },
            { dots: 5, player: player1 }, // center
            { dots: 1, player: player2 },
          ],
          [
            { dots: 2, player: player2 },
            { dots: 1, player: player2 },
            { dots: 2, player: player2 },
          ],
        ],
        scene,
        camera,
        state: getGameInitialState(),
      });

      const points = calculateLocalStrategy({
        dataGrid: getDataGrid({ state }),
        state,
      });

      // Box is surronded by 4 worse opononents
      // Adjacted boxes should not change points
      expect(points).toEqual(
        pointsFor.diagonall.playerMoreThanOponent +
          pointsFor.diagonall.playerMoreThanOponent +
          pointsFor.diagonall.playerMoreThanOponent +
          pointsFor.diagonall.playerMoreThanOponent
      );
    });
  });
});
