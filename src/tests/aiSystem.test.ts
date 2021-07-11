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
import {
  getGameInitialState,
  humanPlayerEntity,
} from '../utils/getGameInitialState';

const player2 = 'player2';

const basicBox: BasicBox = {
  player: undefined,
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
          [{ ...basicBox, player: humanPlayerEntity }, basicBox],
        ],
        scene,
        camera,
        state: getGameInitialState(),
      });

      const grid = getMovesForEmptyBoxes({
        dataGrid: getDataGrid({ state }),
      });

      expect(grid[0][0].points).toEqual(pointsFor.emptyBox);
      expect(grid[0][1].points).toEqual(pointsFor.emptyBox);
      expect(grid[1][0].points).toEqual(0);
      expect(grid[1][1].points).toEqual(pointsFor.emptyBox);
    });
  });

  describe('getBestRandomBox', () => {
    it('should return best box to click', () => {
      let state = createGrid({
        dataGrid: [
          [
            { ...basicBox, player: humanPlayerEntity },
            { ...basicBox, player: player2 },
          ],
          [
            { ...basicBox, player: player2 },
            { ...basicBox, player: player2 },
          ],
        ],
        scene,
        camera,
        state: getGameInitialState(),
      });

      const dataGrid = getDataGrid({ state });

      const bestBox = getBestRandomBox({
        dataGrid,
        currentPlayer: humanPlayerEntity,
      });
      expect(bestBox?.gridPosition).toEqual([0, 0]);
    });

    it('should return best box to click', () => {
      let state = createGrid({
        dataGrid: [
          [
            { ...basicBox, dots: 1 },
            { ...basicBox, player: humanPlayerEntity },
          ],
          [basicBox, basicBox],
        ],
        scene,
        camera,
        state: getGameInitialState(),
      });

      const dataGrid = getMovesForEmptyBoxes({
        dataGrid: getDataGrid({ state }),
      });

      const bestBox = getBestRandomBox({
        dataGrid,
        currentPlayer: humanPlayerEntity,
      });

      expect(bestBox?.gridPosition).toEqual([0, 0]);
    });
  });

  describe('localStrategyAdjacted', () => {
    it('should set proper points - only equal oponents', () => {
      let state = createGrid({
        dataGrid: [
          [
            { dots: 1, player: player2 },
            { dots: 0, player: player2 },
            { dots: 1, player: player2 },
          ],
          [
            { dots: 0, player: player2 },
            { dots: 0, player: humanPlayerEntity }, // center
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
      let state = createGrid({
        dataGrid: [
          [
            { dots: 1, player: player2 },
            { dots: 5, player: player2 },
            { dots: 1, player: player2 },
          ],
          [
            { dots: 5, player: player2 },
            { dots: 0, player: humanPlayerEntity }, // center
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
      let state = createGrid({
        dataGrid: [
          [
            { dots: 1, player: player2 },
            { dots: 2, player: player2 },
            { dots: 1, player: player2 },
          ],
          [
            { dots: 2, player: player2 },
            { dots: 5, player: humanPlayerEntity }, // center
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
      let state = createGrid({
        dataGrid: [
          [
            { dots: 0, player: player2 },
            { dots: 1, player: player2 },
            { dots: 0, player: player2 },
          ],
          [
            { dots: 1, player: player2 },
            { dots: 0, player: humanPlayerEntity }, // center
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
      let state = createGrid({
        dataGrid: [
          [
            { dots: 5, player: player2 },
            { dots: 1, player: player2 },
            { dots: 5, player: player2 },
          ],
          [
            { dots: 1, player: player2 },
            { dots: 0, player: humanPlayerEntity }, // center
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
      let state = createGrid({
        dataGrid: [
          [
            { dots: 2, player: player2 },
            { dots: 1, player: player2 },
            { dots: 2, player: player2 },
          ],
          [
            { dots: 1, player: player2 },
            { dots: 5, player: humanPlayerEntity }, // center
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
    describe('only oponent boxes', () => {
      it('should set proper points - only equal oponents', () => {
        let state = createGrid({
          dataGrid: [
            [
              { dots: 0, player: player2 },
              { dots: 1, player: player2 },
              { dots: 0, player: player2 },
            ],
            [
              { dots: 1, player: player2 },
              { dots: 0, player: humanPlayerEntity }, // center
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

        const newDataGrid = calculateLocalStrategy({
          dataGrid: getDataGrid({ state }),
          currentPlayer: humanPlayerEntity,
        });

        expect(newDataGrid[0][0].points).toEqual(0);
        expect(newDataGrid[1][0].points).toEqual(0);
        expect(newDataGrid[2][0].points).toEqual(0);
        expect(newDataGrid[0][1].points).toEqual(0);
        // AI really don't want to click on this box because probably oponents will capture box faster than ai achieve 6 dots
        expect(newDataGrid[1][1].points).toEqual(-20);
        expect(newDataGrid[2][1].points).toEqual(0);
        expect(newDataGrid[0][2].points).toEqual(0);
        expect(newDataGrid[1][2].points).toEqual(0);
        expect(newDataGrid[2][2].points).toEqual(0);
      });

      it('should set proper points - only better oponents', () => {
        let state = createGrid({
          dataGrid: [
            [
              { dots: 5, player: player2 },
              { dots: 1, player: player2 },
              { dots: 5, player: player2 },
            ],
            [
              { dots: 1, player: player2 },
              { dots: 0, player: humanPlayerEntity }, // center
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

        const newDataGrid = calculateLocalStrategy({
          dataGrid: getDataGrid({ state }),
          currentPlayer: humanPlayerEntity,
        });

        expect(newDataGrid[0][0].points).toEqual(0);
        expect(newDataGrid[1][0].points).toEqual(0);
        expect(newDataGrid[2][0].points).toEqual(0);
        expect(newDataGrid[0][1].points).toEqual(0);
        // It's not worht to click on this box, ai won't capture anthing
        expect(newDataGrid[1][1].points).toEqual(-20);
        expect(newDataGrid[2][1].points).toEqual(0);
        expect(newDataGrid[0][2].points).toEqual(0);
        expect(newDataGrid[1][2].points).toEqual(0);
        expect(newDataGrid[2][2].points).toEqual(0);
      });

      it('should set proper points - only worse oponents', () => {
        let state = createGrid({
          dataGrid: [
            [
              { dots: 2, player: player2 },
              { dots: 1, player: player2 },
              { dots: 2, player: player2 },
            ],
            [
              { dots: 1, player: player2 },
              { dots: 5, player: humanPlayerEntity }, // center
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

        const newDataGrid = calculateLocalStrategy({
          dataGrid: getDataGrid({ state }),
          currentPlayer: humanPlayerEntity,
        });

        expect(newDataGrid[0][0].points).toEqual(0);
        expect(newDataGrid[1][0].points).toEqual(0);
        expect(newDataGrid[2][0].points).toEqual(0);
        expect(newDataGrid[0][1].points).toEqual(0);
        // Situation is under control, it's not worth to capture oponents because they don't have high amount of dots
        expect(newDataGrid[1][1].points).toEqual(0);
        expect(newDataGrid[2][1].points).toEqual(0);
        expect(newDataGrid[0][2].points).toEqual(0);
        expect(newDataGrid[1][2].points).toEqual(0);
        expect(newDataGrid[2][2].points).toEqual(0);
      });

      it('should set proper points - only worse oponents', () => {
        let state = createGrid({
          dataGrid: [
            [
              { dots: 4, player: player2 },
              { dots: 4, player: player2 },
              { dots: 4, player: player2 },
            ],
            [
              { dots: 4, player: player2 },
              { dots: 5, player: humanPlayerEntity }, // center
              { dots: 4, player: player2 },
            ],
            [
              { dots: 4, player: player2 },
              { dots: 4, player: player2 },
              { dots: 4, player: player2 },
            ],
          ],
          scene,
          camera,
          state: getGameInitialState(),
        });

        const newDataGrid = calculateLocalStrategy({
          dataGrid: getDataGrid({ state }),
          currentPlayer: humanPlayerEntity,
        });

        expect(newDataGrid[0][0].points).toEqual(0);
        expect(newDataGrid[1][0].points).toEqual(0);
        expect(newDataGrid[2][0].points).toEqual(0);
        expect(newDataGrid[0][1].points).toEqual(0);
        // hmmm? todo
        expect(newDataGrid[1][1].points).toEqual(0);
        expect(newDataGrid[2][1].points).toEqual(0);
        expect(newDataGrid[0][2].points).toEqual(0);
        expect(newDataGrid[1][2].points).toEqual(0);
        expect(newDataGrid[2][2].points).toEqual(0);
      });
    });
  });

  describe('only player boxes', () => {
    it('should set proper points - only equal boxes', () => {
      let state = createGrid({
        dataGrid: [
          [
            { dots: 0, player: humanPlayerEntity },
            { dots: 1, player: humanPlayerEntity },
            { dots: 0, player: humanPlayerEntity },
          ],
          [
            { dots: 1, player: humanPlayerEntity },
            { dots: 0, player: humanPlayerEntity }, // center
            { dots: 1, player: humanPlayerEntity },
          ],
          [
            { dots: 0, player: humanPlayerEntity },
            { dots: 1, player: humanPlayerEntity },
            { dots: 0, player: humanPlayerEntity },
          ],
        ],
        scene,
        camera,
        state: getGameInitialState(),
      });

      const newDataGrid = calculateLocalStrategy({
        dataGrid: getDataGrid({ state }),
        currentPlayer: humanPlayerEntity,
      });

      // It's not worth to click on a boxes with 0 dots
      // they have adjacted boxes with 1 dot
      // clicking on a boxes with 1 dot is also not a huge deal
      expect(newDataGrid[0][0].points).toEqual(-10);
      expect(newDataGrid[1][0].points).toEqual(0);
      expect(newDataGrid[2][0].points).toEqual(-10);
      expect(newDataGrid[0][1].points).toEqual(0);
      expect(newDataGrid[1][1].points).toEqual(-20);
      expect(newDataGrid[2][1].points).toEqual(0);
      expect(newDataGrid[0][2].points).toEqual(-10);
      expect(newDataGrid[1][2].points).toEqual(0);
      expect(newDataGrid[2][2].points).toEqual(-10);
    });

    it('should set proper points - only better boxes', () => {
      let state = createGrid({
        dataGrid: [
          [
            { dots: 5, player: humanPlayerEntity },
            { dots: 1, player: humanPlayerEntity },
            { dots: 5, player: humanPlayerEntity },
          ],
          [
            { dots: 1, player: humanPlayerEntity },
            { dots: 0, player: humanPlayerEntity }, // center
            { dots: 1, player: humanPlayerEntity },
          ],
          [
            { dots: 5, player: humanPlayerEntity },
            { dots: 1, player: humanPlayerEntity },
            { dots: 5, player: humanPlayerEntity },
          ],
        ],
        scene,
        camera,
        state: getGameInitialState(),
      });

      const newDataGrid = calculateLocalStrategy({
        dataGrid: getDataGrid({ state }),
        currentPlayer: humanPlayerEntity,
      });

      // Center box is good place to click, is adjusted to low dot boxes
      // and diagonall boxes are high which means it's good point to continue building "defencse" grid
      expect(newDataGrid[0][0].points).toEqual(0);
      expect(newDataGrid[1][0].points).toEqual(-10);
      expect(newDataGrid[2][0].points).toEqual(0);
      expect(newDataGrid[0][1].points).toEqual(-10);
      expect(newDataGrid[1][1].points).toEqual(-20); // todo should be higher!
      expect(newDataGrid[2][1].points).toEqual(-10);
      expect(newDataGrid[0][2].points).toEqual(0);
      expect(newDataGrid[1][2].points).toEqual(-10);
      expect(newDataGrid[2][2].points).toEqual(0);
    });

    it('should set proper points - only worse boxes', () => {
      let state = createGrid({
        dataGrid: [
          [
            { dots: 2, player: humanPlayerEntity },
            { dots: 1, player: humanPlayerEntity },
            { dots: 2, player: humanPlayerEntity },
          ],
          [
            { dots: 1, player: humanPlayerEntity },
            { dots: 5, player: humanPlayerEntity }, // center
            { dots: 1, player: humanPlayerEntity },
          ],
          [
            { dots: 2, player: humanPlayerEntity },
            { dots: 1, player: humanPlayerEntity },
            { dots: 2, player: humanPlayerEntity },
          ],
        ],
        scene,
        camera,
        state: getGameInitialState(),
      });

      const newDataGrid = calculateLocalStrategy({
        dataGrid: getDataGrid({ state }),
        currentPlayer: humanPlayerEntity,
      });

      // Central box is high which means boxes adjusted are safe
      // diagonall boxes are good place to continue clicking
      expect(newDataGrid[0][0].points).toEqual(0); // TODO should be higher!
      expect(newDataGrid[1][0].points).toEqual(-15);
      expect(newDataGrid[2][0].points).toEqual(0);
      expect(newDataGrid[0][1].points).toEqual(-15);
      expect(newDataGrid[1][1].points).toEqual(0); // TODO should be lower
      expect(newDataGrid[2][1].points).toEqual(-15);
      expect(newDataGrid[0][2].points).toEqual(0);
      expect(newDataGrid[1][2].points).toEqual(-15);
      expect(newDataGrid[2][2].points).toEqual(0);
    });

    it('should set proper points - every box is same', () => {
      let state = createGrid({
        dataGrid: [
          [
            { dots: 4, player: humanPlayerEntity },
            { dots: 4, player: humanPlayerEntity },
            { dots: 4, player: humanPlayerEntity },
          ],
          [
            { dots: 4, player: humanPlayerEntity },
            { dots: 4, player: humanPlayerEntity }, // center
            { dots: 4, player: humanPlayerEntity },
          ],
          [
            { dots: 4, player: humanPlayerEntity },
            { dots: 4, player: humanPlayerEntity },
            { dots: 4, player: humanPlayerEntity },
          ],
        ],
        scene,
        camera,
        state: getGameInitialState(),
      });

      const newDataGrid = calculateLocalStrategy({
        dataGrid: getDataGrid({ state }),
        currentPlayer: humanPlayerEntity,
      });
 
      // All are the same so it doens't matter
      expect(newDataGrid[0][0].points).toEqual(0);
      expect(newDataGrid[1][0].points).toEqual(0);
      expect(newDataGrid[2][0].points).toEqual(0);
      expect(newDataGrid[0][1].points).toEqual(0);
      expect(newDataGrid[1][1].points).toEqual(0);
      expect(newDataGrid[2][1].points).toEqual(0);
      expect(newDataGrid[0][2].points).toEqual(0);
      expect(newDataGrid[1][2].points).toEqual(0);
      expect(newDataGrid[2][2].points).toEqual(0);
    });
  });
});
