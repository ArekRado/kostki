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
  Animation,
} from '@arekrado/canvas-engine'
import { generateId } from '../utils/generateId'
import { boxSize } from './boxSystem/boxSizes'

export const tutorialEntity = 'tutorial'
const materialUniqueId = generateId().toString()
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
    create: ({ state }) => {
      state = createComponent<Transform, State>({
        state,
        data: defaultTransform({
          entity: tutorialEntity,
          position: [9999, 9999, 9999],
          scale: [boxSize, boxSize, 1],
        }),
      })

      state = createComponent<Material, State>({
        state,
        data: {
          entity: tutorialEntity,
          name: componentName.material,
          uniqueId: parseInt(materialUniqueId),
          diffuseTexture: handTexture,
          diffuseColor: [1, 1, 1, 0],
        },
      })

      state = createComponent<Mesh, State>({
        state,
        data: {
          entity: tutorialEntity,
          name: componentName.mesh,
          type: MeshType.plane,
          uniqueId: parseInt(materialUniqueId),
          width: boxSize,
          height: boxSize,
          updatable: false,
          sideOrientation: 0,
          materialEntity: [tutorialEntity],
        },
      })

      state = createComponent<Animation.AnimationComponent, State>({
        state,
        data: {
          name: componentName.animation,
          entity: tutorialEntity,
          deleteWhenFinished: false,
          isPlaying: true,
          isFinished: false,
          currentTime: 0,
          wrapMode: Animation.WrapMode.loop,
          timingMode: Animation.TimingMode.smooth,
          properties: [
            {
              path: 'scale',
              component: componentName.transform,
              entity: tutorialEntity,
              keyframes: [
                {
                  duration: 500,
                  timingFunction: 'Linear',
                  valueRange: [
                    [boxSize * 0.9, boxSize * 0.9, boxSize * 0.9],
                    [boxSize * 1.2, boxSize * 1.2, boxSize * 1.2],
                  ],
                },
                {
                  duration: 500,
                  timingFunction: 'Linear',
                  valueRange: [
                    [boxSize * 1.2, boxSize * 1.2, boxSize * 1.2],
                    [boxSize * 0.9, boxSize * 0.9, boxSize * 0.9],
                  ],
                },
              ],
            },
          ],
        },
      })

      // Allow user to click through hand mesh
      const sceneRef = state.babylonjs.sceneRef
      if (sceneRef) {
        const tutorialMesh = sceneRef.getMeshByUniqueId(
          parseInt(materialUniqueId),
        )
        if (tutorialMesh) {
          tutorialMesh.isPickable = false
        }
      }
      return state
    },
    remove: ({ state }) => {
      state = removeEntity({ state, entity: tutorialEntity })
      state = removeEntity({ state, entity: materialUniqueId })

      return state
    },
  })
