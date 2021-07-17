import { createSystem } from '../ecs/createSystem';
import { componentName, getComponent } from '../ecs/component';
import { AI, Box, Guid, State } from '../ecs/type';
import { getGame } from './gameSystem';

export namespace AiEvent {
  export enum Type {}

  export type All = null;
}

export const safeGet = (array: any[][], i: number, j: number) =>
  array ? (array[j] ? array[j][i] : undefined) : undefined;

export const pointsFor = {
  emptyBox: 20,

  adjacted: {
    playerMoreThanOponent: 0,
    playerEqualToOponent: 10,
    playerLessThanOponent: -15,

    playerMoreThanPlayer: -5,
    playerEqualToPlayer: -4,
    playerLessThanPlayer: -15,

    toBorder: 0,
  },

  diagonall: {
    playerMoreThanOponent: 1,
    playerEqualToOponent: 2,
    playerLessThanOponent: 7,

    playerMoreThanPlayer: -5,
    playerEqualToPlayer: -4,
    playerLessThanPlayer: 0,

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
      const isEmpty = box.player === undefined;
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

    // if (adjactedBox.player === undefined) {
    //   return acc;
    // }

    const boxStats =
      playerBox.dots === adjactedBox.dots
        ? dotStats.equal
        : playerBox.dots > adjactedBox.dots
        ? dotStats.more
        : dotStats.less;

    if (
      adjactedBox.player !== playerBox.player &&
      adjactedBox.player !== undefined
    ) {
      // Adjacted is oponent

      // Player box has more dots, box is safe
      if (boxStats === dotStats.more) {
        const diff = playerBox.dots - adjactedBox.dots;
        // AI really don't want to click on this box
        // if (playerBox.dots === 6 && diff > 2) {
        //   return acc - 10;
        // }
        return acc + pointsFor.adjacted.playerMoreThanOponent - diff;
      }
      // Oponent box has equal dots, last chance to safetly incerase dots
      // Importance of this box depends on how many dots have box
      if (boxStats === dotStats.equal) {
        return acc + pointsFor.adjacted.playerEqualToOponent * playerBox.dots;
      }
      // Oponent box has more dots, it's not worth to click on this box
      if (boxStats === dotStats.less) {
        return acc + pointsFor.adjacted.playerLessThanOponent;
      }
    } else {
      // Adjacted is player

      // Do nothing if near is another player box and current has 6 dots
      if (playerBox.dots === 6) {
        return acc;
      }

      // Current box has more dots, do nothing
      if (boxStats === dotStats.more) {
        return acc + pointsFor.adjacted.playerMoreThanPlayer;
      }

      // Do nothing, just let other checks to decide if it's worth to click, probably it's not worth so add minus points
      if (boxStats === dotStats.equal) {
        return acc + pointsFor.adjacted.playerEqualToPlayer;
      }
      // Current box has less dots, maybe is protected by adjacted - TODO check it
      if (boxStats === dotStats.less) {
        if (adjactedBox.dots === 6) {
          return acc + pointsFor.adjacted.playerLessThanPlayer * 2;
        }
        return acc + pointsFor.adjacted.playerLessThanPlayer;
      }
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

    // if (diagonallBox.player === undefined) {
    //   return acc;
    // }

    const boxStats =
      playerBox.dots === diagonallBox.dots
        ? dotStats.equal
        : playerBox.dots > diagonallBox.dots
        ? dotStats.more
        : dotStats.less;

    if (
      diagonallBox.player !== playerBox.player &&
      diagonallBox.player !== undefined
    ) {
      // Adjacted is oponent

      // Player box has more dots, box is safe
      if (boxStats === dotStats.more) {
        // const dotsDiff = playerBox.dots - diagonallBox.dots;
        // if (dotsDiff === 1) {
        //   // diff is low, box will be unsafe soon
        //   return acc + pointsFor.diagonall.playerLessThanOponent * 0.5;
        // }
        return acc + pointsFor.diagonall.playerMoreThanOponent;
      }
      // Oponent box has equal dots, no rush but player should start thinking to incerase dots
      if (boxStats === dotStats.equal) {
        return acc + pointsFor.diagonall.playerEqualToOponent;
      }

      // Oponent box has more dots, player box is safe but boxes around are not
      if (boxStats === dotStats.less) {
        if (diagonallBox.dots === 6) {
          return acc + pointsFor.diagonall.playerLessThanOponent * 2;
        }
        return acc + pointsFor.diagonall.playerLessThanOponent;
      }
    } else {
      // Adjacted is player

      // Do nothing if near is another player box and current has 6 dots
      if (playerBox.dots === 6) {
        return acc;
      }

      // Current box has more dots,
      if (boxStats === dotStats.more) {
        return acc + pointsFor.diagonall.playerMoreThanPlayer;
      }
      if (boxStats === dotStats.equal) {
        return acc + pointsFor.diagonall.playerEqualToPlayer;
      }
      // Player box is diagonall to another it might be a good place to set 6 dots
      if (boxStats === dotStats.less) {
        const diff = diagonallBox.dots - playerBox.dots;
        return acc + pointsFor.diagonall.playerLessThanPlayer + diff ** 2;
      }
    }

    return acc;
  }, 0);
};

type CalculateLocalStrategy = (params: {
  currentPlayer: Guid;
  dataGrid: DataGrid;
}) => DataGrid;
export const calculateLocalStrategy: CalculateLocalStrategy = ({
  dataGrid,
  currentPlayer,
}) => {
  return dataGrid.reduce((acc1, row, i) => {
    acc1[i] = row.reduce((acc2, box, j) => {
      if (box.player !== currentPlayer && box.player !== undefined) {
        return acc2;
      }

      const grid3x3 = [
        [
          safeGet(dataGrid, j - 1, i - 1),
          safeGet(dataGrid, j, i - 1),
          safeGet(dataGrid, j + 1, i - 1),
        ],

        [
          safeGet(dataGrid, j - 1, i),
          safeGet(dataGrid, j, i), // playerBox
          safeGet(dataGrid, j + 1, i),
        ],

        [
          safeGet(dataGrid, j - 1, i + 1),
          safeGet(dataGrid, j, i + 1),
          safeGet(dataGrid, j + 1, i + 1),
        ],
      ];

      const points =
        localStrategyAdjacted(grid3x3) + localStrategyDiagonall(grid3x3);

      acc2[j] = { ...box, points: box.points + points };
      return acc2;
    }, row);
    return acc1;
  }, dataGrid);
};

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

type GetAiMove = (params: { state: State; ai: AI }) => Box | undefined;
export const getAiMove: GetAiMove = ({ state, ai }) => {
  const currentPlayer = ai.entity;

  let dataGrid = getDataGrid({ state });

  dataGrid = getMovesForEmptyBoxes({ dataGrid });
  dataGrid = calculateLocalStrategy({ currentPlayer, dataGrid });

  // Chooses one/two players and attacks them
  // Tries to find weakes player to attack
  // If has no good moves then tries to waste moves
  // If is losing then prepares defense
  // dataGrid = calculateGlobalStrategy({ currentPlayer, dataGrid });
  const bestRandomBox = getBestRandomBox({ currentPlayer, dataGrid });

  // console.log(
  //   JSON.stringify(
  //     dataGrid.map((x) =>
  //       x.map(({ points, player, dots }) => ({ dots, points, player }))
  //     )
  //   )
  // );

  // console.log(dataGrid);
  // console.log(JSON.stringify(dataGrid));

  return bestRandomBox;
};

export const aiSystem = (state: State) =>
  createSystem<AI, undefined>({
    state,
    name: componentName.ai,
  });
