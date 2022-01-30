import { createSystem, Entity } from '@arekrado/canvas-engine';
import { ECSEvent } from '@arekrado/canvas-engine/dist/event/createEventSystem';
import { AI, Box, name, State } from '../type';

export namespace AIEvent {
  export enum Type {
    boxRotationEnd = 'AIEvent-boxRotationEnd',
  }

  export type All = BoxRotationEndEvent;

  export type BoxRotationEndEvent = ECSEvent<
    Type.boxRotationEnd,
    {
      boxEntity: Entity;
    }
  >;
}

export enum AIDifficulty {
  // campaign ai
  disabled = 'disabled',
  random = 'random',

  //
  easy = 'easy',
  medium = 'medium',
  hard = 'hard',
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
  createSystem<AI, State>({
    state,
    name: name.ai,
    componentName: name.ai,
  });
