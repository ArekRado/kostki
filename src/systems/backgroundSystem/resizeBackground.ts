import { Vector3 } from 'babylonjs';
import { scene } from '../..';
import { State } from '../../ecs/type';
import { backgroundEntity } from '../backgroundSystem';
import { getCamera, getCameraSize } from '../cameraSystem';

export const resizeBackground = (state: State): State => {
  const background = scene.getMeshByUniqueId(parseFloat(backgroundEntity));
  const camera = getCamera({ state });

  if (background && camera) {
    const size = getCameraSize(camera.distance, scene);

    background.position.x = camera.position[0];
    background.position.y = camera.position[1];

    background.scaling = new Vector3(
      Math.abs(size.left) + Math.abs(size.right),
      Math.abs(size.bottom) + Math.abs(size.top),
      1
    );
  }

  return state;
};
