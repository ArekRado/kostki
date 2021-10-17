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
