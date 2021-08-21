import { createSystem } from '../ecs/createSystem';
import { componentName, getComponent } from '../ecs/component';
import { AI, Box, Guid, State } from '../ecs/type';
import { getGame } from './gameSystem';
import { setTextureCache } from '../utils/textureCache';
import { scene } from '..';
import { addNoise } from './aiSystem/addNoise';
import { disabledAIMove } from './aiSystem/disabledAIMove';

export enum AIDifficulty {
  // campaign ai
  disabled,
  random,

  //
  easy,
  medium,
  hard,
}
export namespace AiEvent {
  export enum Type {}

  export type All = null;
}

export const safeGet = (array: any[][], i: number, j: number) =>
  array ? (array[j] ? array[j][i] : undefined) : undefined;

export const pointsFor = {
  emptyBox: 50,
  preferEmptyBoxes: 15,

  adjacted: {
    playerMoreThanOponent: 0,
    playerEqualToOponent: 10,
    playerLessThanOponent: -10,

    playerMoreThanPlayer: -5,
    playerEqualToPlayer: -4,
    playerLessThanPlayer: -15,

    sixToSix: 50,
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
export type DataGrid = EnhancedBox[][];

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

const getAdjactedBoxes = (grid3x3: EnhancedBox[][]): EnhancedBox[] => [
  grid3x3[1][0],
  grid3x3[0][1],
  grid3x3[1][2],
  grid3x3[2][1],
];

const getDiagonallBoxes = (grid3x3: EnhancedBox[][]): EnhancedBox[] => [
  grid3x3[0][0],
  grid3x3[0][2],
  grid3x3[2][0],
  grid3x3[2][2],
];

// b - player box
// a - adjacent
// d - diagonally
// d a d
// a b a
// d a d
type LocalStrategyAdjacted = (params: {
  grid3x3: EnhancedBox[][];
  preferEmptyBoxes: boolean;
  currentPlayer: AI;
}) => number;
export const localStrategyAdjacted: LocalStrategyAdjacted = ({
  grid3x3,
  preferEmptyBoxes,
  currentPlayer,
}) => {
  const currentBox = grid3x3[1][1];
  const adjactedBoxes = getAdjactedBoxes(grid3x3);

  return adjactedBoxes.reduce((acc, adjactedBox) => {
    if (!adjactedBox) {
      return acc + pointsFor.adjacted.toBorder;
    }

    const boxStats =
      currentBox.dots === adjactedBox.dots
        ? dotStats.equal
        : currentBox.dots > adjactedBox.dots
        ? dotStats.more
        : dotStats.less;

    if (
      adjactedBox.player !== currentBox.player &&
      adjactedBox.player !== undefined
    ) {
      if (
        preferEmptyBoxes &&
        currentBox.player === undefined &&
        adjactedBox.player === currentPlayer.entity
      ) {
        // preferEmptyBoxes creates "islands" of boxes with the same color
        // Math.random produces more noise
        return Math.random() > 0.5 ? acc + pointsFor.preferEmptyBoxes : acc;
      }
      // Adjacted is oponent

      // Player box has more dots, box is safe
      if (boxStats === dotStats.more) {
        const diff = currentBox.dots - adjactedBox.dots;
        // AI really don't want to click on this box
        // if (currentBox.dots === 6 && diff > 2) {
        //   return acc - 10;
        // }
        return acc + pointsFor.adjacted.playerMoreThanOponent - diff;
      }
      // Oponent box has equal dots, last chance to safetly incerase dots
      // Importance of this box depends on how many dots have box
      if (boxStats === dotStats.equal) {
        return acc + pointsFor.adjacted.playerEqualToOponent * currentBox.dots;
      }
      // Oponent box has more dots, it's not worth to click on this box
      if (boxStats === dotStats.less) {
        const diff = adjactedBox.dots - currentBox.dots;
        return acc + pointsFor.adjacted.playerLessThanOponent * diff;
      }
    } else {
      // Adjacted is player

      // Do nothing if near is another player box and current has 6 dots
      if (currentBox.dots === 6) {
        return acc;
      }

      // Current box has more dots, do nothing
      if (boxStats === dotStats.more) {
        return acc + pointsFor.adjacted.playerMoreThanPlayer;
      }

      // Do nothing, just let other checks to decide if it's worth to click, probably it's not worth so add minus points
      if (boxStats === dotStats.equal) {
        if (adjactedBox.dots === 6 && currentBox.dots === 6) {
          return acc + pointsFor.adjacted.sixToSix;
        }
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

type LocalStrategyDiagonall = (params: {
  grid3x3: EnhancedBox[][];
  preferEmptyBoxes: boolean;
  currentPlayer: AI;
}) => number;
export const localStrategyDiagonall: LocalStrategyDiagonall = ({
  grid3x3,
  preferEmptyBoxes,
  currentPlayer,
}) => {
  const currentBox = grid3x3[1][1];
  const diagonallBoxes = getDiagonallBoxes(grid3x3);

  return diagonallBoxes.reduce((acc, diagonallBox) => {
    if (!diagonallBox) {
      return acc + pointsFor.diagonall.toBorder;
    }

    const boxStats =
      currentBox.dots === diagonallBox.dots
        ? dotStats.equal
        : currentBox.dots > diagonallBox.dots
        ? dotStats.more
        : dotStats.less;

    if (
      diagonallBox.player !== currentBox.player &&
      diagonallBox.player !== undefined
    ) {
      // Adjacted is oponent

      // Player box has more dots, box is safe
      if (boxStats === dotStats.more) {
        // const dotsDiff = currentBox.dots - diagonallBox.dots;
        // if (dotsDiff === 1) {
        //   // diff is low, box will be unsafe soon
        //   return acc + pointsFor.diagonall.playerLessThanOponent * 0.5;
        // }
        return acc + pointsFor.diagonall.playerMoreThanOponent;
      }
      // Oponent box has equal dots, no rush but player should start thinking to incerase dots
      if (boxStats === dotStats.equal) {
        if (diagonallBox.dots === 6) {
          return acc + pointsFor.diagonall.playerEqualToOponent * -10;
        }
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
      if (currentBox.dots === 6) {
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
        const diff = diagonallBox.dots - currentBox.dots;
        return acc + pointsFor.diagonall.playerLessThanPlayer + diff ** 2;
      }
    }

    return acc;
  }, 0);
};

type CalculateLocalStrategy = (params: {
  currentPlayer: AI;
  dataGrid: DataGrid;
  preferEmptyBoxes: boolean;
}) => DataGrid;
export const calculateLocalStrategy: CalculateLocalStrategy = ({
  dataGrid,
  currentPlayer,
  preferEmptyBoxes,
}) => {
  return dataGrid.reduce((acc1, row, i) => {
    acc1[i] = row.reduce((acc2, box, j) => {
      if (box.player !== currentPlayer.entity && box.player !== undefined) {
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
        localStrategyAdjacted({ grid3x3, preferEmptyBoxes, currentPlayer }) +
        localStrategyDiagonall({ grid3x3, preferEmptyBoxes, currentPlayer });

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

type GetAiMove = (params: {
  state: State;
  ai: AI;
  preferEmptyBoxes?: boolean;
}) => Box | undefined;
export const getAiMove: GetAiMove = ({ state, ai, preferEmptyBoxes }) => {
  const currentPlayer = ai.entity;

  let dataGrid = getDataGrid({ state });

  dataGrid = getMovesForEmptyBoxes({
    dataGrid,
  });
  dataGrid = calculateLocalStrategy({
    currentPlayer: ai,
    dataGrid,
    preferEmptyBoxes: !!preferEmptyBoxes,
  });

  // Todo
  // Chooses one/two players and attacks them
  // or
  // Tries to find weakes player to attack
  // If has no good moves then tries to waste moves
  // Detect patterns:
  // - should prefer to attack when 6 dots can safetly capture 3,4,5 dots
  // - should be able to do combo strikes so can double click on 5 dots box
  if (!preferEmptyBoxes) {
    switch (ai.level) {
      case AIDifficulty.disabled:
        dataGrid = disabledAIMove({ dataGrid });
        break;
      case AIDifficulty.random:
        // Every box is clicked by random
        dataGrid = addNoise({ dataGrid, minNoise: 100, currentPlayer });
        break;

      case AIDifficulty.easy:
        // Boxes points values are reduced by 100-70 percentages
        dataGrid = addNoise({ dataGrid, minNoise: 70, currentPlayer });
        break;
      case AIDifficulty.medium:
        // Boxes points values are reduced by 100-0 percentages
        dataGrid = addNoise({ dataGrid, minNoise: 0, currentPlayer });
        break;

      default:
        break;
    }
  }

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
    create: ({ component, state }) => {
      // preload images
      setTimeout(() => {
        component.textureSet.forEach((src) => {
          const image = new Image();
          image.src = src;

          image.onload = () => {
            setTextureCache({ textureUrl: src, scene });
          };
        });
      }, Math.random() * 2000 + 1000);

      return state;
    },
  });
