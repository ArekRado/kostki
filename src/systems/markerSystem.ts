import markerTexture from '../assets/marker.png';
import { boxGap, boxSize } from '../blueprints/gridBlueprint';
import { Marker, name, State } from '../type';
import {
  componentName,
  createGetSetForUniqComponent,
  createSystem,
  setComponent,
  Animation,
  defaultData,
  Mesh,
  MeshType,
  Transform,
  Material,
  ECSEvent,
} from '@arekrado/canvas-engine';
import { generateId } from '../utils/generateId';
import { updateComponent } from '@arekrado/canvas-engine/dist/component';
import { boxRotationAnimationTime } from './boxSystem/createRotationBoxAnimation';

export const markerEntity = '38127445920450264';

export namespace MarkerEvent {
  export enum Type {
    appearAnimationEnd = 'MarkerEvent-appearAnimationEnd',
  }

  export type All = AppearAnimationEndEvent;

  export type AppearAnimationEndEvent = ECSEvent<Type.appearAnimationEnd, {}>;
}

const markerGetSet = createGetSetForUniqComponent<Marker, State>({
  entity: markerEntity,
  name: name.marker,
});

export const getMarker = markerGetSet.getComponent;
export const setMarker = ({
  state,
  data,
}: {
  state: State;
  data: Partial<Marker>;
}) => {
  if (state.babylonjs.sceneRef) {
    state = updateComponent<Material, State>({
      state,
      name: componentName.material,
      entity: markerEntity,
      update: (material) => ({
        diffuseColor: data.color
          ? [data.color[0], data.color[1], data.color[2], 0]
          : material.diffuseColor,
      }),
    });

    state = updateComponent<Transform, State>({
      state,
      entity: markerEntity,
      name: componentName.transform,
      update: (transform) => ({
        position: data.position
          ? [data.position[0], data.position[1], -1]
          : transform.position,
      }),
    });

    const appearAnimationEnd: MarkerEvent.AppearAnimationEndEvent = {
      type: MarkerEvent.Type.appearAnimationEnd,
      payload: {},
    };

    state = setComponent<Animation.AnimationComponent, State>({
      state,
      data: {
        name: componentName.animation,
        entity: markerEntity,
        isPlaying: true,
        isFinished: false,
        currentTime: 0,
        wrapMode: Animation.WrapMode.once,
        timingMode: Animation.TimingMode.smooth,
        properties: [
          {
            path: 'scale',
            component: componentName.transform,
            entity: markerEntity,
            keyframes: [
              {
                duration: boxRotationAnimationTime - 100,
                timingFunction: 'Linear',
                valueRange: [
                  [2, 2, 1],
                  [0.9, 0.9, 1],
                ],
                endFrameEvent: appearAnimationEnd,
              },
            ],
          },
          {
            path: 'alpha',
            component: componentName.material,
            entity: markerEntity,
            keyframes: [
              {
                duration: boxRotationAnimationTime - 100,
                timingFunction: 'Linear',
                valueRange: [0, 1],
              },
            ],
          },
        ],
      },
    });
  }

  return markerGetSet.setComponent({ state, data });
};

export const markerSystem = (state: State) =>
  createSystem<Marker, State>({
    state,
    name: name.marker,
    componentName: name.marker,
    create: ({ state, component }) => {
      const sceneRef = state.babylonjs.sceneRef;
      if (!sceneRef) {
        return state;
      }

      const size = boxGap + boxSize + boxGap;

      state = setComponent<Transform, State>({
        state,
        data: defaultData.transform({
          entity: component.entity,
          position: [9999, 9999, 9999],
          scale: [size, size, 1],
        }),
      });

      const materialUniqueId = generateId();
      state = setComponent<Material, State>({
        state,
        data: {
          entity: component.entity,
          name: componentName.material,
          uniqueId: materialUniqueId,
          diffuseTexture: markerTexture,
          diffuseColor: [1, 0, 1, 0],
        },
      });

      state = setComponent<Mesh, State>({
        state,
        data: {
          entity: component.entity,
          name: componentName.mesh,
          type: MeshType.plane,
          uniqueId: materialUniqueId,
          width: size,
          height: size,
          updatable: false,
          sideOrientation: 0,
          materialEntity: [component.entity],
        },
      });

      return state;
    },
  });
