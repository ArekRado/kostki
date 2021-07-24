import {
  Color3,
  Mesh,
  StandardMaterial,
  Texture,
  Scene,
  Animation,
  Vector3
} from 'babylonjs';

import markerTexture from '../assets/marker.png';
import { setComponent } from '../ecs/component';
import { Game, State } from '../ecs/type';
import { getGame } from '../systems/gameSystem';
import { boxGap, boxSize } from './createGrid';

export const markerBlueprint = ({
  scene,
  state,
}: {
  scene: Scene;
  state: State;
}): State => {
  const marker = Mesh.CreatePlane(
    'marker',
    boxGap + boxSize + boxGap,
    scene,
    true
  );

  marker.material = new StandardMaterial('material', scene);
  (marker.material as StandardMaterial).diffuseColor = Color3.White();
  (marker.material as StandardMaterial).diffuseTexture = new Texture(
    markerTexture,
    scene
  );
  marker.material.alpha = 0.5;

  const frameRate = 30;
  const frameEnd = 0.5 * frameRate;

  const scaleAnimation = new Animation(
    'rotateAnimation',
    'rotation',
    frameRate,
    Animation.ANIMATIONTYPE_VECTOR3,
    Animation.ANIMATIONLOOPMODE_RELATIVE
  );

  const keyFrames = [];

  keyFrames.push({
    frame: 0,
    value: new Vector3(1.2, 1.2, 1.2),
  });

  keyFrames.push({
    frame: frameEnd,
    value: new Vector3(1, 1, 1),
  });

  scaleAnimation.setKeys(keyFrames);

  scene.beginAnimation(marker, 0, 2 * frameRate, false);

  const game = getGame({ state });
  if (!game) {
    return state;
  }

  return setComponent<Game>({
    state,
    data: {
      ...game,
      markerEntity: marker.uniqueId.toString(),
    },
  });
};
