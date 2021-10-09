import { Scene, Vector3 } from 'babylonjs';
import { createSystem } from '../ecs/createSystem';
import { componentName, createGetSetForUniqComponent } from '../ecs/component';
import { Camera, State } from '../ecs/type';
import { getAspectRatio } from '../utils/getAspectRatio';
import { setBackground } from './backgroundSystem';
import { ECSEvent } from '../ecs/emitEvent';
import { handleResize } from './camera/handleResize';

export const cameraEntity = 'cameraEntity';
export namespace CameraEvent {
  export enum Type {
    resize,
  }

  export type All = ResizeEvent;

  export type ResizeEvent = ECSEvent<Type.resize, {}>;
}

const cameraGetSet = createGetSetForUniqComponent<Camera>({
  entity: cameraEntity,
  name: componentName.camera,
});

export const getCamera = cameraGetSet.getComponent;
export const setCamera = cameraGetSet.setComponent;

export const getCameraSize = (distance: number, scene: Scene) => {
  const aspect = getAspectRatio(scene);

  if (aspect > 1) {
    return {
      left: -distance,
      right: distance,
      bottom: -distance * aspect,
      top: distance * aspect,
    };
  } else {
    return {
      bottom: -distance,
      top: distance,
      left: -distance / aspect,
      right: distance / aspect,
    };
  }
};

export const cameraSystem = (state: State) =>
  createSystem<Camera, CameraEvent.All>({
    state,
    name: componentName.camera,
    create: ({ state, component }) => {
      state = handleResize({
        component,
        state,
        event: {
          entity: component.entity,
          type: CameraEvent.Type.resize,
          payload: {},
        },
      });

      return state;
    },
    update: ({ state, component }) => {
      state = handleResize({
        component,
        state,
        event: {
          entity: component.entity,
          type: CameraEvent.Type.resize,
          payload: {},
        },
      });

      return state;
    },
    event: ({ state, component, event }) => {
      switch (event.type) {
        case CameraEvent.Type.resize:
          return handleResize({ state, component, event });
      }
    },
  });
