import { Scene } from 'babylonjs';
import { getAspectRatio } from './getAspectRatio';

export const setCameraDistance = (distance: number, scene: Scene) => {
  const aspect = getAspectRatio(scene);
  const camera = scene.activeCamera;

  if (camera) {
    if (aspect > 1) {
      camera.orthoLeft = -distance;
      camera.orthoRight = distance;
      camera.orthoBottom = camera.orthoLeft * aspect;
      camera.orthoTop = camera.orthoRight * aspect;
    } else {
      camera.orthoBottom = -distance;
      camera.orthoTop = distance;
      camera.orthoLeft = camera.orthoBottom / aspect;
      camera.orthoRight = camera.orthoTop / aspect;
    }
  }
};
