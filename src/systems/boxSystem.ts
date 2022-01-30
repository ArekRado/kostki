import { createSystem, Entity, Guid } from '@arekrado/canvas-engine';
import { ECSEvent } from '@arekrado/canvas-engine/dist/event/createEventSystem';
import { AI, Box, Color, name, State } from '../type';
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
    {
      boxEntity: Entity;
      texture: string;
      color: Color;
    }
  >;
}

export const boxSystem = (state: State) =>
  createSystem<Box, State>({
    state,
    name: name.box,
    componentName: name.box,
    create,
    remove,
  });
