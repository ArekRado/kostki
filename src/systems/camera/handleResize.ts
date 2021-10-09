import { Camera, EventHandler } from '../../ecs/type';
import { CameraEvent, getCameraSize } from '../cameraSystem';
import { camera, scene } from '../..';
import { setBackground } from '../backgroundSystem';
import { Vector3 } from 'babylonjs';

export const handleResize: EventHandler<Camera, CameraEvent.ResizeEvent> = ({
  state,
  component,
  event,
}) => {
  camera.position.x = component.position[1];
  camera.position.y = component.position[0];
  camera.position.z = -10;
  camera.setTarget(new Vector3(component.position[1], component.position[0]));

  const size = getCameraSize(component.distance, scene);

  camera.orthoLeft = size.left;
  camera.orthoRight = size.right;
  camera.orthoBottom = size.bottom;
  camera.orthoTop = size.top;

  state = setBackground({ state, data: {} });

  return state;
};
