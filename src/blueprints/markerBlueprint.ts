import {
  Color3,
  Mesh,
  StandardMaterial,
  Texture,
  Scene,
  Animation,
  Vector3,
} from 'babylonjs';

import markerTexture from '../assets/marker.png';
import { setComponent } from '../ecs/component';
import { Game, State } from '../ecs/type';
import { getGame } from '../systems/gameSystem';
import { boxGap, boxSize } from './gridBlueprint';

export const getScaleAnimation = () => {
  const scaleAnimation = new Animation(
    'getScaleAnimation',
    'scaling',
    1,
    Animation.ANIMATIONTYPE_VECTOR3,
    Animation.ANIMATIONLOOPMODE_RELATIVE
  );

  const keyFrames = [];

  keyFrames.push({
    frame: 0,
    value: new Vector3(2, 2, 1),
  });

  keyFrames.push({
    frame: 0.5,
    value: new Vector3(0.9, 0.9, 1),
  });

  scaleAnimation.setKeys(keyFrames);

  return scaleAnimation;
};

export const getAlphaAnimation = () => {
  const alphaAnimation = new Animation(
    'getAlphaAnimation',
    'material.alpha',
    1,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_RELATIVE
  );

  const keyFrames = [];

  keyFrames.push({
    frame: 0,
    value: 0,
  });

  keyFrames.push({
    frame: 0.5,
    value: 1,
  });

  alphaAnimation.setKeys(keyFrames);

  return alphaAnimation;
};

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
  (marker.material as StandardMaterial).useAlphaFromDiffuseTexture = true;
  (marker.material as StandardMaterial).diffuseColor = Color3.White();
  (marker.material as StandardMaterial).diffuseTexture = new Texture(
    markerTexture,
    scene
  );
  (marker.material as any).diffuseTexture.hasAlpha = true;

  marker.animations[0] = getScaleAnimation();
  marker.animations[1] = getAlphaAnimation();

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
