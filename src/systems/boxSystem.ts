import { createSystem } from '../ecs/createSystem';
import { componentName } from '../ecs/component';
import { AI, Box, Entity, State } from '../ecs/type';
import { create } from './boxSystem/create';
import { remove } from './boxSystem/remove';
import { ECSEvent } from '../ecs/createEventSystem';

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
  createSystem<Box>({
    state,
    name: componentName.box,
    create,
    remove,
  });
