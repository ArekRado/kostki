import handTexture from '../assets/hand.png'
import { gameComponent, State, Tutorial } from '../type'
import {
  componentName,
  createSystem,
  defaultTransform,
  Mesh,
  MeshType,
  Transform,
  Material,
  ECSEvent,
  removeEntity,
  createComponent,
} from '@arekrado/canvas-engine'
import { generateId } from '../utils/generateId'
import { boxGap, boxSize } from './boxSystem/boxSizes'

export const tutorialEntity = 'tutorial'
const materialUniqueId = generateId().toString()
const size = boxGap + boxSize + boxGap

export namespace MarkerEvent {
  export enum Type {
    appearAnimationEnd = 'MarkerEvent-appearAnimationEnd',
  }

  export type All = AppearAnimationEndEvent

  export type AppearAnimationEndEvent = ECSEvent<Type.appearAnimationEnd, null>
}

export const tutorialSystem = (state: State) =>
  createSystem<Tutorial, State>({
    state,
    name: gameComponent.tutorial,
    componentName: gameComponent.tutorial,
    create: ({ state, component }) => {
      state = createComponent<Transform, State>({
        state,
        data: defaultTransform({
          entity: component.entity,
          position: [9999, 9999, 9999],
          scale: [size, size, 1],
        }),
      })

      state = createComponent<Material, State>({
        state,
        data: {
          entity: component.entity,
          name: componentName.material,
          uniqueId: parseInt(materialUniqueId),
          diffuseTexture: handTexture,
          diffuseColor: [1, 0, 1, 0],
        },
      })

      state = createComponent<Mesh, State>({
        state,
        data: {
          entity: component.entity,
          name: componentName.mesh,
          type: MeshType.plane,
          uniqueId: parseInt(materialUniqueId),
          width: size,
          height: size,
          updatable: false,
          sideOrientation: 0,
          materialEntity: [component.entity],
        },
      })

      return state
    },
    remove: ({ state }) => {
      state = removeEntity({ state, entity: tutorialEntity })
      state = removeEntity({ state, entity: materialUniqueId })

      return state
    },
  })
