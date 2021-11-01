import { createSystem } from '../ecs/createSystem';
import { componentName } from '../ecs/component';
import { AI, Box, State } from '../ecs/type';
import { ECSEvent } from '../ecs/emitEvent';
import { rotateHandler } from './boxSystem/rotateHandler';
import { rotationEndHandler } from './boxSystem/rotationEndHandler';
import { create } from './boxSystem/create';
import { remove } from './boxSystem/remove';

export enum Direction {
  up,
  down,
  left,
  right,
}
export namespace BoxEvent {
  export enum Type {
    onClick,
    rotationEnd,
    rotate,
  }

  export type All = RotationEndEvent | Rotate;

  export type Rotate = ECSEvent<
    Type.rotate,
    {
      color: [number, number, number];
      texture: string;
      direction: Direction;
    }
  >;
  export type RotationEndEvent = ECSEvent<
    Type.rotationEnd,
    { ai: AI; shouldExplode: boolean }
  >;
}

export const boxSystem = (state: State) =>
  createSystem<Box, BoxEvent.All>({
    state,
    name: componentName.box,
    create,
    remove,
    event: ({ state, component, event }) => {
      switch (event.type) {
        case BoxEvent.Type.rotationEnd:
          return rotationEndHandler({ state, component, event });
        case BoxEvent.Type.rotate:
          return rotateHandler({ state, component, event });
      }
    },
  });
