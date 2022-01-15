import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Animation, AnimationEvent } from '@babylonjs/core/Animations';
import { Box, Color, name, State } from '../../type';
import { setMeshTexture } from '../../utils/setMeshTexture';
import { BoxRotationDirection } from '../boxSystem';
import { Entity, getComponent, setComponent } from '@arekrado/canvas-engine';

export const rotationAnimationName = 'rotationAnimation';

const clampRotation = (rotation: number) => {
  if (rotation > Math.PI * 2 || rotation < Math.PI * -2) {
    return Math.PI * -2;
  }

  return rotation;
};

const rightAngle = Math.PI / 2;

export const createRotationBoxAnimation = ({
  boxUniqueId,
  animationEndCallback,
  direction = BoxRotationDirection.random,
  color,
  texture,
  state,
}: {
  boxUniqueId: Entity;
  color: Color;
  direction?: BoxRotationDirection;
  animationEndCallback: () => void;
  texture: string;
  state: State;
}): State => {
  const sceneRef = state.babylonjs.sceneRef;
  if (!sceneRef) {
    return state;
  }

  const frameEnd = 0.5;

  const boxMesh = sceneRef.getTransformNodeByUniqueId(
    parseInt(boxUniqueId)
  );
  const box = getComponent<Box>({
    state,
    name: name.box,
    entity: boxUniqueId,
  });

  if (boxMesh) {
    if (box) {
      state = setComponent<Box, State>({
        state,
        data: {
          ...box,
          isAnimating: true,
        },
      });
    }

    let rotationDirection = rightAngle * (Math.random() > 0.5 ? 1 : -1);
    let rotationProperty = Math.random() > 0.5 ? 'x' : 'y';

    switch (direction) {
      case BoxRotationDirection.down:
        rotationDirection = rightAngle * -1;
        rotationProperty = 'x';
        break;
      case BoxRotationDirection.up:
        rotationDirection = rightAngle * 1;
        rotationProperty = 'x';
        break;
      case BoxRotationDirection.right:
        rotationDirection = rightAngle * -1;
        rotationProperty = 'y';
        break;
      case BoxRotationDirection.left:
        rotationDirection = rightAngle * 1;
        rotationProperty = 'y';
        break;

      case BoxRotationDirection.random:
        rotationDirection = rightAngle * (Math.random() > 0.5 ? 1 : -1);
        rotationProperty = Math.random() > 0.5 ? 'x' : 'y';
        break;
    }

    boxMesh.rotation.z = 0;

    const currentRotation = boxMesh.rotation;
    const rotationVector = new Vector3(
      rotationProperty === 'x' ? rotationDirection : 0,
      rotationProperty === 'y' ? rotationDirection : 0,
      currentRotation.z
    );

    const nnextRotation = rotationVector.add(currentRotation);

    const nextRotation = new Vector3(
      clampRotation(nnextRotation.x),
      clampRotation(nnextRotation.y),
      clampRotation(nnextRotation.z)
    );

    const rotateAnimation = new Animation(
      rotationAnimationName,
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

    boxMesh.animations[boxMesh.animations.length] = rotateAnimation;

    sceneRef.beginAnimation(boxMesh, 0, 1, false);

    const children = boxMesh.getChildren();

    children.slice(1, children.length).forEach((plane) => {
      const mesh = sceneRef.getMeshByUniqueId(plane.uniqueId);
      if (mesh) {
        setMeshTexture({
          mesh,
          color,
          texture,
          scene: sceneRef,
        });
      }
    });
  }

  return state;
};
