import 'regenerator-runtime/runtime';
import { scene, camera, humanPlayerEntity } from '../.';
import { BasicBox, createGrid } from '../blueprints/createGrid';
import { componentName, setComponent } from '../ecs/component';
import { AI } from '../ecs/type';
import {
  getAiMove,
  getBestRandomBox,
  getDataGrid,
  getMovesForEmptyBoxes,
  pointsFor,
} from '../systems/aiSystem';
import {
  getGameInitialState,
} from '../utils/getGameInitialState';

const player2 = 'player2';

const basicBox: BasicBox = {
  player: undefined,
  dots: 0,
};

const expectOneOf = (
  possiblePositions: [number, number][],
  position: number[]
) => {
  const found = possiblePositions.some(
    (p) => p[0] === position[0] && p[1] === position[1]
  );

  if (found) {
    expect(true).toBe(found);
  } else {
    expect(true).toBe(position);
  }
};

const basicAi: AI = {
  entity: 'basicAi',
  name: componentName.ai,
  human: false,
  level: 0,
  color: [0, 0, 1],
  textureSet: ['', '', '', '', '', '', ''],
  active: true,
};

const basicAi2: AI = {
  entity: 'basicAi2',
  name: componentName.ai,
  human: false,
  level: 0,
  color: [0, 1, 1],
  textureSet: ['', '', '', '', '', '', ''],
  active: true,
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
        preferEmptyBoxes: false,
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
        preferEmptyBoxes: false,
        dataGrid: getDataGrid({ state }),
      });

      expect(grid[0][0].points).toEqual(pointsFor.emptyBox);
      expect(grid[0][1].points).toEqual(pointsFor.emptyBox);
      expect(grid[1][0].points).toEqual(0);
      expect(grid[1][1].points).toEqual(pointsFor.emptyBox);
    });
  });

  describe.skip('getBestRandomBox', () => {
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
        preferEmptyBoxes: false,
        dataGrid: getDataGrid({ state }),
      });

      const bestBox = getBestRandomBox({
        dataGrid,
        currentPlayer: humanPlayerEntity,
      });

      expect(bestBox?.gridPosition).toBe([0, 0]);
    });
  });

  describe('getAiMove', () => {
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
              { dots: 0, player: basicAi.entity }, // center
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

        state = setComponent<AI>({
          state,
          data: basicAi,
        });

        const box = getAiMove({
          state,
          ai: basicAi,
        });

        // AI really don't want to click on this box because probably oponents will capture box faster than ai achieve 6 dots
        expectOneOf([[1, 1]], box?.gridPosition || []);
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
              { dots: 0, player: basicAi.entity }, // center
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

        state = setComponent<AI>({
          state,
          data: basicAi,
        });

        const box = getAiMove({
          state,
          ai: basicAi,
        });

        // It's not worht to click on this box, ai won't capture anthing
        expect(box?.gridPosition).toEqual([1, 1]);
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
              { dots: 5, player: basicAi.entity }, // center
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

        state = setComponent<AI>({
          state,
          data: basicAi,
        });

        const box = getAiMove({
          state,
          ai: basicAi,
        });

        // Situation is under control, it's not worth to capture oponents because they don't have high amount of dots
        expect(box?.gridPosition).toEqual([1, 1]);
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
              { dots: 5, player: basicAi.entity }, // center
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

        state = setComponent<AI>({
          state,
          data: basicAi,
        });

        const box = getAiMove({
          state,
          ai: basicAi,
        });

        // hmmm? todo
        expect(box?.gridPosition).toEqual([1, 1]);
      });
    });
  });

  describe('only player boxes', () => {
    it('should set proper points - only equal boxes', () => {
      let state = createGrid({
        dataGrid: [
          [
            { dots: 0, player: basicAi.entity },
            { dots: 1, player: basicAi.entity },
            { dots: 0, player: basicAi.entity },
          ],
          [
            { dots: 1, player: basicAi.entity },
            { dots: 0, player: basicAi.entity }, // center
            { dots: 1, player: basicAi.entity },
          ],
          [
            { dots: 0, player: basicAi.entity },
            { dots: 1, player: basicAi.entity },
            { dots: 0, player: basicAi.entity },
          ],
        ],
        scene,
        camera,
        state: getGameInitialState(),
      });

      state = setComponent<AI>({
        state,
        data: basicAi,
      });

      const box = getAiMove({
        state,
        ai: basicAi,
      });

      // It's not worth to click on a boxes with 0 dots
      // they have adjacted boxes with 1 dot
      // clicking on a boxes with 1 dot is also not a huge deal
      // expect(box?.gridPosition).toEqual([1, 0]);
      expectOneOf(
        [
          [0, 2],
          [2, 1],
          [0, 1],
          [1, 2],
          [1, 0],
        ],
        box?.gridPosition || []
      );
    });

    it('should set proper points - only better boxes', () => {
      let state = createGrid({
        dataGrid: [
          [
            { dots: 5, player: basicAi.entity },
            { dots: 1, player: basicAi.entity },
            { dots: 5, player: basicAi.entity },
          ],
          [
            { dots: 1, player: basicAi.entity },
            { dots: 0, player: basicAi.entity }, // center
            { dots: 1, player: basicAi.entity },
          ],
          [
            { dots: 5, player: basicAi.entity },
            { dots: 1, player: basicAi.entity },
            { dots: 5, player: basicAi.entity },
          ],
        ],
        scene,
        camera,
        state: getGameInitialState(),
      });

      state = setComponent<AI>({
        state,
        data: basicAi,
      });

      const box = getAiMove({
        state,
        ai: basicAi,
      });

      // Center box is good place to click, is adjusted to low dot boxes
      // and diagonall boxes are high which means it's good point to continue building "defencse" grid
      expectOneOf([[1, 1]], box?.gridPosition || []);
    });

    it('should set proper points - only worse boxes', () => {
      let state = createGrid({
        dataGrid: [
          [
            { dots: 2, player: basicAi.entity },
            { dots: 1, player: basicAi.entity },
            { dots: 2, player: basicAi.entity },
          ],
          [
            { dots: 1, player: basicAi.entity },
            { dots: 5, player: basicAi.entity }, // center
            { dots: 1, player: basicAi.entity },
          ],
          [
            { dots: 2, player: basicAi.entity },
            { dots: 1, player: basicAi.entity },
            { dots: 2, player: basicAi.entity },
          ],
        ],
        scene,
        camera,
        state: getGameInitialState(),
      });

      state = setComponent<AI>({
        state,
        data: basicAi,
      });

      const box = getAiMove({
        state,
        ai: basicAi,
      });

      // Central box is high which means boxes adjusted are safe
      // diagonall boxes are good place to continue clicking
      // expect(box?.gridPosition).toEqual([0, 0]);
      expectOneOf(
        [
          [0, 2],
          [2, 0],
          [0, 0],
          [2, 2],
        ],
        box?.gridPosition || []
      );
    });

    it('should set proper points - every box is same with low dots', () => {
      let state = createGrid({
        dataGrid: [
          [
            { dots: 1, player: basicAi.entity },
            { dots: 2, player: basicAi.entity },
            { dots: 3, player: basicAi.entity },
          ],
          [
            { dots: 3, player: basicAi.entity },
            { dots: 1, player: basicAi.entity }, // center
            { dots: 2, player: basicAi.entity },
          ],
          [
            { dots: 3, player: basicAi.entity },
            { dots: 2, player: basicAi.entity },
            { dots: 1, player: basicAi.entity },
          ],
        ],
        scene,
        camera,
        state: getGameInitialState(),
      });

      state = setComponent<AI>({
        state,
        data: basicAi,
      });

      const box = getAiMove({
        state,
        ai: basicAi,
      });

      // All are the same so it doens't matter
      expectOneOf(
        [
          [0, 2],
          [2, 2],
          [0, 0],
          [2, 0],
        ],
        box?.gridPosition || []
      );
    });

    it('should set proper points - every box is same with high dots', () => {
      let state = createGrid({
        dataGrid: [
          [
            { dots: 6, player: basicAi.entity },
            { dots: 4, player: basicAi.entity },
            { dots: 5, player: basicAi.entity },
          ],
          [
            { dots: 5, player: basicAi.entity },
            { dots: 6, player: basicAi.entity }, // center
            { dots: 4, player: basicAi.entity },
          ],
          [
            { dots: 6, player: basicAi.entity },
            { dots: 5, player: basicAi.entity },
            { dots: 4, player: basicAi.entity },
          ],
        ],
        scene,
        camera,
        state: getGameInitialState(),
      });

      state = setComponent<AI>({
        state,
        data: basicAi,
      });

      const box = getAiMove({
        state,
        ai: basicAi,
      });

      // All are the same so it doens't matter
      expectOneOf(
        [
          [0, 2],
          [2, 2],
          [0, 0],
          [2, 0],
          [1, 1],
        ],
        box?.gridPosition || []
      );
    });

    it('should set points for diagonall playerLessThanPlayer', () => {
      let state = createGrid({
        dataGrid: [
          [
            { dots: 6, player: basicAi.entity },
            { dots: 0, player: basicAi.entity },
          ],
          [
            { dots: 0, player: basicAi.entity },
            { dots: 1, player: basicAi.entity },
          ],
        ],
        scene,
        camera,
        state: getGameInitialState(),
      });

      state = setComponent<AI>({
        state,
        data: basicAi,
      });

      const box = getAiMove({
        state,
        ai: basicAi,
      });

      expectOneOf([[1, 1]], box?.gridPosition || []);
    });
  });

  describe('real game moves', () => {
    it('player2 should not click on a 6 dots box', () => {
      /*
        * - basicAi2
      
        *1 -*1 - 2 - 6
         6 - 1 -*4 - 1
        *1 -*3 - 1 - 2
        *6 -*1 -*5 - 1
      */
      let state = createGrid({
        dataGrid: [
          [
            { dots: 6, player: basicAi2.entity },
            { dots: 1, player: basicAi2.entity },
            { dots: 6, player: basicAi.entity },
            { dots: 1, player: basicAi2.entity },
          ],
          [
            { dots: 1, player: basicAi.entity },
            { dots: 3, player: basicAi2.entity },
            { dots: 1, player: basicAi.entity },
            { dots: 1, player: basicAi2.entity },
          ],
          [
            { dots: 5, player: basicAi2.entity },
            { dots: 1, player: basicAi.entity },
            { dots: 4, player: basicAi2.entity },
            { dots: 2, player: basicAi.entity },
          ],
          [
            { dots: 1, player: basicAi.entity },
            { dots: 2, player: basicAi.entity },
            { dots: 1, player: basicAi.entity },
            { dots: 6, player: basicAi.entity },
          ],
        ],
        scene,
        camera,
        state: getGameInitialState(),
      });

      state = setComponent<AI>({
        state,
        data: basicAi,
      });

      state = setComponent<AI>({
        state,
        data: basicAi2,
      });

      const box = getAiMove({
        state,
        ai: basicAi2,
      });

      const gridPosition = box?.gridPosition || [];

      // AI pls it's not good idea to click on safe box
      expect(gridPosition).not.toEqual([0, 0]);
      // [1,1] needs much more support because is diagonall to enemy 6
      expectOneOf(
        [
          [1, 1],
          [1, 3],
        ],
        gridPosition
      );
    });

    it('player2 should click on a empty box - 1', () => {
      /*
        * - basicAi2
      
        *1 - 0 - 1 - 0
         0 - 1 -*1 - 1
         0 - 0 - 1 -*1
         0 - 0 - 0 -*1
      */
      let state = createGrid({
        dataGrid: [
          [
            { dots: 0, player: undefined },
            { dots: 0, player: undefined },
            { dots: 0, player: undefined },
            { dots: 1, player: basicAi2.entity },
          ],
          [
            { dots: 0, player: undefined },
            { dots: 0, player: undefined },
            { dots: 1, player: basicAi2.entity },
            { dots: 0, player: undefined },
          ],
          [
            { dots: 0, player: undefined },
            { dots: 1, player: basicAi2.entity },
            { dots: 1, player: basicAi2.entity },
            { dots: 1, player: basicAi2.entity },
          ],
          [
            { dots: 1, player: basicAi2.entity },
            { dots: 1, player: basicAi2.entity },
            { dots: 1, player: basicAi2.entity },
            { dots: 0, player: undefined },
          ],
        ],
        scene,
        camera,
        state: getGameInitialState(),
      });

      state = setComponent<AI>({
        state,
        data: basicAi,
      });

      state = setComponent<AI>({
        state,
        data: basicAi2,
      });

      const box = getAiMove({
        state,
        ai: basicAi2,
      });

      const gridPosition = box?.gridPosition || [];

      expectOneOf(
        [
          [0, 0],
          [0, 1],
          [0, 2],

          [1, 0],
          [1, 1],
          [1, 3],

          [2, 0],

          [3, 3],
        ],
        gridPosition
      );
    });

    it('player2 should click on a empty box - 2', () => {
      /*
        * - basicAi2
      
        1 - 0 - 0 - 1
        0 -*1 -*1 -*1
        1 - 1 - 1 -*1
        0 -*1 - 1 -*1
      */
      let state = createGrid({
        dataGrid: [
          [
            { dots: 0, player: undefined },
            { dots: 1, player: basicAi.entity },
            { dots: 0, player: undefined },
            { dots: 1, player: basicAi.entity },
          ],
          [
            { dots: 0, player: undefined },
            { dots: 1, player: basicAi.entity },
            { dots: 1, player: basicAi2.entity },
            { dots: 0, player: undefined },
          ],
          [
            { dots: 1, player: basicAi.entity },
            { dots: 1, player: basicAi.entity },
            { dots: 1, player: basicAi2.entity },
            { dots: 0, player: undefined },
          ],
          [
            { dots: 1, player: basicAi2.entity },
            { dots: 1, player: basicAi2.entity },
            { dots: 1, player: basicAi2.entity },
            { dots: 1, player: basicAi.entity },
          ],
        ],
        scene,
        camera,
        state: getGameInitialState(),
      });

      state = setComponent<AI>({
        state,
        data: basicAi,
      });

      state = setComponent<AI>({
        state,
        data: basicAi2,
      });

      const box = getAiMove({
        state,
        ai: basicAi2,
      });

      const gridPosition = box?.gridPosition || [];

      expectOneOf(
        [
          [0, 0],
          [0, 2],
          [1, 0],
          [1, 3],
          [2, 3],
        ],
        gridPosition
      );
    });

    it('player2 not click on a 4 dots box', () => {
      /*
        * - basicAi2
      
         6 -*1 - 1 -*1
        *4 - 1 - 1 -*1
        *1 - 1 -*1 -*3
         1 -*1 - 1 -*1
      */
      let state = createGrid({
        dataGrid: [
          [
            { dots: 1, player: basicAi.entity },
            { dots: 1, player: basicAi2.entity },
            { dots: 4, player: basicAi2.entity },
            { dots: 6, player: basicAi.entity },
          ],
          [
            { dots: 1, player: basicAi.entity },
            { dots: 1, player: basicAi.entity },
            { dots: 1, player: basicAi.entity },
            { dots: 1, player: basicAi2.entity },
          ],
          [
            { dots: 1, player: basicAi.entity },
            { dots: 1, player: basicAi2.entity },
            { dots: 1, player: basicAi.entity },
            { dots: 1, player: basicAi.entity },
          ],
          [
            { dots: 1, player: basicAi2.entity },
            { dots: 3, player: basicAi2.entity },
            { dots: 1, player: basicAi2.entity },
            { dots: 1, player: basicAi2.entity },
          ],
        ],
        scene,
        camera,
        state: getGameInitialState(),
      });

      state = setComponent<AI>({
        state,
        data: basicAi,
      });

      state = setComponent<AI>({
        state,
        data: basicAi2,
      });

      const box = getAiMove({
        state,
        ai: basicAi2,
      });

      const gridPosition = box?.gridPosition || [];

      expect(gridPosition).not.toEqual([0, 2]);
      expectOneOf(
        [
          [1, 3],
          [2, 1],
        ],
        gridPosition
      );
    });
  });
});
