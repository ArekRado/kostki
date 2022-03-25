import { Box, Color, name, State } from '../../type';
import { setMeshTexture } from '../../utils/setMeshTexture';
import { BoxEvent, BoxRotationDirection } from '../boxSystem';
import {
  Animation,
  componentName,
  createComponent,
  Entity,
  updateComponent,
  Vector3D,
} from '@arekrado/canvas-engine';

export const rotationAnimationName = 'rotationAnimation';

const clampRotation = (rotation: number) => {
  if (rotation > Math.PI * 2 || rotation < Math.PI * -2) {
    return Math.PI * -2;
  }

  return rotation;
};

const rightAngle = Math.PI / 2;
export const boxRotationAnimationTime = 500;

export const createRotationBoxAnimation = ({
  boxUniqueId,
  direction = BoxRotationDirection.random,
  color,
  texture,
  state,
  nextTurn,
}: {
  boxUniqueId: Entity;
  color: Color;
  direction?: BoxRotationDirection;
  texture: string;
  state: State;
  nextTurn: boolean;
}): State => {
  const sceneRef = state.babylonjs.sceneRef;
  if (!sceneRef) {
    return state;
  }

  const boxMesh = sceneRef.getTransformNodeByUniqueId(parseInt(boxUniqueId));
  // const box = getComponent<Box>({
  //   state,
  //   name: name.box,
  //   entity: boxUniqueId,
  // });

  if (boxMesh) {
    state = updateComponent<Box, State>({
      state,
      name: name.box,
      entity: boxUniqueId,
      update: (box) => ({
        ...box,
        isAnimating: true,
      }),
    });

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

    const currentRotation: Vector3D = [
      boxMesh.rotation.x,
      boxMesh.rotation.y,
      boxMesh.rotation.z,
    ];

    const rotationVector: Vector3D = [
      rotationProperty === 'x' ? rotationDirection : 0,
      rotationProperty === 'y' ? rotationDirection : 0,
      currentRotation[2],
    ];

    const nextRotation: Vector3D = [
      clampRotation(rotationVector[0] + currentRotation[0]),
      clampRotation(rotationVector[1] + currentRotation[1]),
      clampRotation(rotationVector[2] + currentRotation[2]),
    ];

    const rotationEndEvent: BoxEvent.RotationEndEvent = {
      type: BoxEvent.Type.rotationEnd,
      payload: {
        boxEntity: boxUniqueId,
        texture,
        color,
        nextTurn,
      },
    };

    state = createComponent<Animation.AnimationComponent, State>({
      state,
      data: {
        name: componentName.animation,
        entity: boxUniqueId,
        isPlaying: true,
        isFinished: false,
        currentTime: 0,
        deleteWhenFinished: true,
        wrapMode: Animation.WrapMode.once,
        timingMode: Animation.TimingMode.smooth,
        properties: [
          {
            path: 'rotation',
            component: componentName.transform,
            entity: boxUniqueId,
            keyframes: [
              {
                duration: boxRotationAnimationTime,
                timingFunction: 'Linear',
                valueRange: [currentRotation, nextRotation],
                endFrameEvent: rotationEndEvent,
              },
            ],
          },
        ],
      },
    });

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
