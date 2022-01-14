import { createSystem, Entity } from '@arekrado/canvas-engine';
import { ECSEvent } from '@arekrado/canvas-engine/dist/system/createEventSystem';
import { AI, Box, name, State } from '../type';
import { create } from './boxSystem/create';
import { remove } from './boxSystem/remove';

export enum BoxRotationDirection {
  up = 'up',
  down = 'down',
  left = 'left',
  right = 'right',
  random = 'random',
}
export namespace BoxEvent {
  export enum Type {
    onClick = 'BoxEvent-onClick',
    rotationEnd = 'BoxEvent-rotationEnd',
    rotate = 'BoxEvent-rotate',
  }

  export type All = RotationEndEvent | Rotate;

  export type Rotate = ECSEvent<
    Type.rotate,
    {
      color: [number, number, number];
      texture: string;
      direction: BoxRotationDirection;
      boxEntity: Entity;
    }
  >;
  export type RotationEndEvent = ECSEvent<
    Type.rotationEnd,
    { ai: AI | undefined; shouldExplode: boolean; boxEntity: Entity }
  >;
}

export const boxSystem = (state: State) =>
  createSystem<Box, State>({
    state,
    name: name.box,
    create,
    remove,
  });
