import { Vector3 } from 'babylonjs';
import { createSystem } from '../ecs/createSystem';
import { componentName, createGetSetForUniqComponent } from '../ecs/component';
import { Camera, State } from '../ecs/type';
import { camera, scene } from '..';
import { setCameraDistance } from '../utils/setCameraDistance';

export const cameraEntity = 'cameraEntity';

const cameraGetSet = createGetSetForUniqComponent<Camera>({
  entity: cameraEntity,
  name: componentName.camera,
});

export const getCamera = cameraGetSet.getComponent;
export const setCamera = cameraGetSet.setComponent;

export const cameraSystem = (state: State) =>
  createSystem<Camera, {}>({
    state,
    name: componentName.camera,
    create: ({ state, component }) => {
      camera.position.x = component.position[1];
      camera.position.y = component.position[0];
      camera.position.z = -10;
      camera.setTarget(
        new Vector3(component.position[1], component.position[0])
      );

      setCameraDistance(component.distance, scene);

      return state;
    },
    update: ({ state, component }) => {
      camera.position.x = component.position[1];
      camera.position.y = component.position[0];
      camera.position.z = -10;
      camera.setTarget(
        new Vector3(component.position[1], component.position[0])
      );

      setCameraDistance(component.distance, scene);

      return state;
    },
  });
