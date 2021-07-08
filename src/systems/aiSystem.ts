import { createSystem } from '../ecs/createSystem';
import { componentName, getComponent } from '../ecs/component';
import { AI, Box, State } from '../ecs/type';
import { getGame } from './gameSystem';

const safeGet = (array: any[][], i: number, j: number) =>
  array ? (array[i] ? array[i][j] : undefined) : undefined;

export const pointsFor = {
  emptyBox: 10,

  adjacted: {
    playerMoreThanOponent: 0,
    playerEqualToOponent: 5,
    playerLessThanOponent: -5,

    playerMoreThanPlayer: 0,
    playerEqualToPlayer: 0,
    playerLessThanPlayer: -5,

    toBorder: 0,
  },

  diagonall: {
    playerMoreThanOponent: 0,
    playerEqualToOponent: 1,
    playerLessThanOponent: 7,

    playerMoreThanPlayer: 0,
    playerEqualToPlayer: 0,
    playerLessThanPlayer: 3,

    toBorder: 0,
  },
};

enum dotStats {
  less = -1,
  equal = 0,
  more = 1,
}

type EnhancedBox = Box & {
  /**
   * Describes how profitable it is to choose box
   */
  points: number;
};
type DataGrid = EnhancedBox[][];

type GetDataGrid = (params: { state: State }) => DataGrid;
export const getDataGrid: GetDataGrid = ({ state }) => {
  const game = getGame({ state });

  if (game) {
    const grid: DataGrid = game.grid.reduce((acc, entity) => {
      const box = getComponent<Box>({
        name: componentName.box,
        state,
        entity,
      });

      if (box) {
        const x = box.gridPosition[0];
        const y = box.gridPosition[1];

        if (!acc[x]) {
          acc[x] = [];
        }

        acc[x][y] = {
          ...box,
          points: 0,
        };
      }

      return acc;
    }, [] as DataGrid);

    return grid;
  }

  return [];
};

type GetMovesForEmptyBoxes = (params: { dataGrid: DataGrid }) => DataGrid;
export const getMovesForEmptyBoxes: GetMovesForEmptyBoxes = ({ dataGrid }) =>
  dataGrid.reduce((acc1, row, i) => {
    acc1[i] = row.reduce((acc2, box, j) => {
      const isEmpty = box.dots === 0 && box.player === '';
      const points = isEmpty ? box.points + pointsFor.emptyBox : box.points;

      acc2[j] = { ...box, points };

      return acc2;
    }, row);
    return acc1;
  }, dataGrid);

// b - player box
// a - adjacent
// d - diagonally
// d a d
// a b a
// d a d
type LocalStrategyAdjacted = (grid3x3: EnhancedBox[][]) => number;
export const localStrategyAdjacted: LocalStrategyAdjacted = (
  grid3x3: EnhancedBox[][]
) => {
  const playerBox = grid3x3[1][1];
  const adjactedBoxes = [
    grid3x3[1][0],
    grid3x3[0][1],
    grid3x3[1][2],
    grid3x3[2][1],
  ];

  return adjactedBoxes.reduce((acc, adjactedBox) => {
    if (!adjactedBox) {
      return acc + pointsFor.adjacted.toBorder;
    }

    const boxStats =
      playerBox.dots === adjactedBox.dots
        ? dotStats.equal
        : playerBox.dots > adjactedBox.dots
        ? dotStats.more
        : dotStats.less;

    if (adjactedBox.player !== playerBox.player) {
      // Adjacted is oponent

      // Player box has more dots, box is safe
      if (boxStats === dotStats.more)
        return acc + pointsFor.adjacted.playerMoreThanOponent;
      // Oponent box has equal dots, last chance to safetly incerase dots
      if (boxStats === dotStats.equal)
        return acc + pointsFor.adjacted.playerEqualToOponent;
      // Oponent box has more dots, it's not worth to click on this box
      if (boxStats === dotStats.less)
        return acc + pointsFor.adjacted.playerLessThanOponent;
    } else {
      // Adjacted is player

      // Current box has more dots, do nothing
      if (boxStats === dotStats.more)
        return acc + pointsFor.adjacted.playerMoreThanPlayer;
      // TODO choose which is safer
      if (boxStats === dotStats.equal)
        return acc + pointsFor.adjacted.playerEqualToPlayer;
      // Current box has less dots, maybe is protected by adjacted - TODO check it
      if (boxStats === dotStats.less)
        return acc + pointsFor.adjacted.playerLessThanPlayer;
    }

    return acc;
  }, 0);
};

export const localStrategyDiagonall = (grid3x3: EnhancedBox[][]) => {
  const playerBox = grid3x3[1][1];
  const diagonallBoxes = [
    grid3x3[0][0],
    grid3x3[0][2],
    grid3x3[2][0],
    grid3x3[2][2],
  ];

  return diagonallBoxes.reduce((acc, diagonallBox) => {
    if (!diagonallBox) {
      return acc + pointsFor.adjacted.toBorder;
    }

    const boxStats =
      playerBox.dots === diagonallBox.dots
        ? dotStats.equal
        : playerBox.dots > diagonallBox.dots
        ? dotStats.more
        : dotStats.less;

    if (diagonallBox.player !== playerBox.player) {
      // Adjacted is oponent

      // Player box has more dots, box is safe
      if (boxStats === dotStats.more)
        return acc + pointsFor.diagonall.playerMoreThanOponent;
      // Oponent box has equal dots, no rush but player should start thinking to incerase dots
      if (boxStats === dotStats.equal)
        return acc + pointsFor.diagonall.playerEqualToOponent;
      // Oponent box has more dots, player box is safe but boxes around are not
      if (boxStats === dotStats.less)
        return acc + pointsFor.diagonall.playerLessThanOponent;
    } else {
      // Adjacted is player

      // TODO
      // Current box has more dots,
      if (boxStats === dotStats.more)
        return acc + pointsFor.diagonall.playerMoreThanPlayer;
      if (boxStats === dotStats.equal)
        return acc + pointsFor.diagonall.playerEqualToPlayer;
      // Player box is diagonall to another it might be a good place to set 6 dots
      if (boxStats === dotStats.less)
        return acc + pointsFor.diagonall.playerLessThanPlayer;
    }

    return acc;
  }, 0);
};

type CalculateLocalStrategy = (params: {
  state: State;
  dataGrid: DataGrid;
}) => DataGrid;
export const calculateLocalStrategy: CalculateLocalStrategy = ({
  dataGrid,
}) => {
  return dataGrid.reduce((acc1, row, i) => {
    acc1[i] = row.reduce((acc2, box, j) => {
      const grid3x3 = [
        [safeGet(dataGrid, j - 1, i - 1)],
        [safeGet(dataGrid, j, i - 1)],
        [safeGet(dataGrid, j + 1, i - 1)],

        [safeGet(dataGrid, j - 1, i)],
        [safeGet(dataGrid, j, i)], // playerBox
        [safeGet(dataGrid, j + 1, i)],

        [safeGet(dataGrid, j - 1, i + 1)],
        [safeGet(dataGrid, j, i + 1)],
        [safeGet(dataGrid, j + 1, i + 1)],
      ];

      const points = localStrategyAdjacted(grid3x3);

      acc2[j] = { ...box, points: box.points + points };
      return acc2;
    }, row);
    return acc1;
  }, dataGrid);
};

type GetBestRandomBox = (dataGrid: DataGrid) => Box;
export const getBestRandomBox: GetBestRandomBox = (dataGrid) => {
  let highestScoreBox = dataGrid[0][0];

  dataGrid.forEach((row) => {
    row.forEach((box) => {
      if (box.points > highestScoreBox.points) {
        highestScoreBox = box;
      }
    });
  });

  return highestScoreBox;
};

type GetAIMoves = (params: { state: State }) => Box;
export const GetAIMoves: GetAIMoves = ({ state }) => {
  let dataGrid = getDataGrid({ state });

  dataGrid = getMovesForEmptyBoxes({ dataGrid });
  dataGrid = calculateLocalStrategy({ state, dataGrid });

  return getBestRandomBox(dataGrid);
};

export const aiSystem = (state: State) =>
  createSystem<AI>({
    state,
    name: componentName.ai,
  });
