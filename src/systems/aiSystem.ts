import { createSystem } from '../ecs/createSystem';
import { componentName } from '../ecs/component';
import { AI, Box, State } from '../ecs/type';
import { setTextureCache } from '../utils/textureCache';
import { scene } from '..';
import { randomizeGrid } from './aiSystem/randomizeGrid';
import { disabledAIMove } from './aiSystem/disabledAIMove';
import {
  easyAIGridPoints,
  hardAIGridPoints,
  mediumAIGridPoints,
} from './aiSystem/aiGridPoints';
import { calculateLocalStrategy } from './aiSystem/calculateLocalStrategy';
import { getDataGrid } from './aiSystem/getDataGrid';
import { getMovesForEmptyBoxes } from './aiSystem/getMovesForEmptyBoxes';
import { getBestRandomBox } from './aiSystem/getBestRandomBox';
import { advancedAttackAdjacted } from './aiSystem/advancedAttackAdjacted';

export enum AIDifficulty {
  // campaign ai
  disabled = 'disabled',
  random = 'random',

  //
  easy = 'easy',
  medium = 'medium',
  hard = 'hard',

  experimental = 'experimental',
}
export namespace AiEvent {
  export enum Type {}

  export type All = null;
}

export enum dotStats {
  less = -1,
  equal = 0,
  more = 1,
}

export type EnhancedBox = Box & {
  /**
   * Describes how profitable it is to choose box
   */
  points: number;
};
export type DataGrid = EnhancedBox[][];

type GetAiMove = (params: {
  state: State;
  ai: AI;
  preferEmptyBoxes?: boolean;
}) => Box | undefined;
export const getAiMove: GetAiMove = ({ state, ai, preferEmptyBoxes }) => {
  const currentPlayer = ai.entity;
  const aIGridPoints = {
    [AIDifficulty.disabled]: easyAIGridPoints,
    [AIDifficulty.random]: easyAIGridPoints,

    [AIDifficulty.easy]: easyAIGridPoints,
    [AIDifficulty.medium]: mediumAIGridPoints,
    [AIDifficulty.hard]: hardAIGridPoints,

    [AIDifficulty.experimental]: hardAIGridPoints,
  }[ai.level];

  let dataGrid = getDataGrid({ state });

  dataGrid = getMovesForEmptyBoxes({
    dataGrid,
    aIGridPoints,
  });
  dataGrid = calculateLocalStrategy({
    currentPlayer: ai,
    dataGrid,
    preferEmptyBoxes: !!preferEmptyBoxes,
    aIGridPoints,
  });

  if (!preferEmptyBoxes) {
    switch (ai.level) {
      case AIDifficulty.disabled:
        dataGrid = disabledAIMove({ dataGrid });
        break;
      case AIDifficulty.random:
        // Every box is clicked by random
        dataGrid = randomizeGrid({ dataGrid, currentPlayer });
        break;
      case AIDifficulty.experimental:
        dataGrid = advancedAttackAdjacted({ dataGrid, currentPlayer });
        // Todo
        // If has no good moves then tries to waste moves
        // Detect patterns:
        // wip - should prefer to attack when 6 dots can safetly capture 3,4,5 dots
        // - should be able to do combo strikes so can double click on 5 dots box
        // dataGrid = randomizeGrid({ dataGrid, currentPlayer });
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
