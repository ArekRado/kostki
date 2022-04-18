import { ECSEvent, createSystem, Entity } from '@arekrado/canvas-engine'
import { Box, Color, gameComponent, State } from '../type'
import { create } from './boxSystem/create'
import { remove } from './boxSystem/remove'

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
    rotateStart = 'BoxEvent-rotate',
  }

  export type All = RotationEndEvent | Rotate

  export type Rotate = ECSEvent<
    Type.rotateStart,
    {
      color: [number, number, number]
      texture: string
      direction: BoxRotationDirection
      boxEntity: Entity
    }
  >
  export type RotationEndEvent = ECSEvent<
    Type.rotationEnd,
    {
      boxEntity: Entity
      texture: string
      color: Color
      nextTurn: boolean
      shouldExplode: boolean
    }
  >
}

export const boxSystem = (state: State) =>
  createSystem<Box, State>({
    state,
    name: gameComponent.box,
    componentName: gameComponent.box,
    create,
    remove,
  })
