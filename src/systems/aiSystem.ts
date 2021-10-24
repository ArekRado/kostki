import { createSystem } from '../ecs/createSystem';
import { componentName } from '../ecs/component';
import { AI, Box, State } from '../ecs/type';

export enum AIDifficulty {
  // campaign ai
  disabled = 'disabled',
  random = 'random',

  //
  easy = 'easy',
  medium = 'medium',
  hard = 'hard',
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
  });
