import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Tools } from '@babylonjs/core/Misc/tools';
import { Animation, AnimationEvent } from '@babylonjs/core/Animations';
import { scene } from '../..';
import { Color, Entity } from '../../ecs/type';
import { setMeshTexture } from '../../utils/setMeshTexture';
import { Direction } from '../boxSystem';

const clampRotation = (rotation: number) => {
  if (rotation > Math.PI * 2 || rotation < Math.PI * -2) {
    return Math.PI * -2;
  }

  return rotation;
};

export const createRotationBoxAnimation = ({
  boxUniqueId,
  animationEndCallback,
  direction,
  color,
  texture,
}: {
  boxUniqueId: Entity;
  color: Color;
  direction?: Direction;
  animationEndCallback: () => void;
  texture: string;
}) => {
  const frameEnd = 0.5;

  const box = scene.getTransformNodeByUniqueId(parseInt(boxUniqueId));

  if (box) {
    const rightAngle = Tools.ToRadians(90);

    const rotationDirection = rightAngle * (Math.random() > 0.5 ? 1 : -1);
    const rotationProperty = Math.random() > 0.5 ? 'x' : 'y';

    const currentRotation = box.rotation;
    const rotationVector = new Vector3(
      rotationProperty === 'x' ? rotationDirection : 0,
      rotationProperty === 'y' ? rotationDirection : 0,
      0
    );

    const nnextRotation = rotationVector.add(currentRotation);

    const nextRotation = new Vector3(
      clampRotation(nnextRotation.x),
      clampRotation(nnextRotation.y),
      clampRotation(nnextRotation.z)
    );

    const rotateAnimation = new Animation(
      'rotateAnimation',
      'rotation',
      1,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_RELATIVE
    );

    const endEvent = new AnimationEvent(frameEnd, animationEndCallback, true);

    rotateAnimation.addEvent(endEvent);

    const keyFrames = [];

    keyFrames.push({
      frame: 0,
      value: currentRotation,
    });

    keyFrames.push({
      frame: frameEnd,
      value: nextRotation,
    });

    rotateAnimation.setKeys(keyFrames);

    box.animations[box.animations.length] = rotateAnimation;

    scene.beginAnimation(box, 0, 1, false);

    const children = box.getChildren();

    children.slice(1, children.length).forEach((plane) => {
      const mesh = scene.getMeshByUniqueId(plane.uniqueId);
      if (mesh) {
        setMeshTexture({
          mesh,
          color,
          texture,
          scene,
        });
      }
    });
  }
};
