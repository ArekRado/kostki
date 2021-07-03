import {
  TransformNode,
  Animation,
  AnimationEvent,
  Color3,
  StandardMaterial,
  Texture,
  Vector3,
  Tools,
  Quaternion,
  Axis,
  Space,
  Vector2,
} from 'babylonjs';
import { createSystem } from '../ecs/createSystem';
import { componentName, setComponent } from '../ecs/component';
import { Box, Entity, State } from '../ecs/type';
import { scene } from '..';
import { emitEvent } from '../ecs/emitEvent';

import dot1 from '../assets/1.png';
import dot2 from '../assets/2.png';
import dot3 from '../assets/3.png';
import dot4 from '../assets/4.png';
import dot5 from '../assets/5.png';
import dot6 from '../assets/6.png';

export const boxEvents = {
  onClick: 'onClick',
  rotationEnd: 'rotationEnd',
};

const clampRotation = (rotation: number) => {
  if (rotation > Math.PI * 2 || rotation < Math.PI * -2) {
    return Math.PI * -2;
  }

  return rotation;
};

const frameRate = 30;
const frameEnd = 0.3 * frameRate;

export const createRotationBoxAnimation = (params: {
  entity: Entity;
  box: TransformNode;
  direction?: 'up' | 'down' | 'left' | 'right';
}) => {
  const rightAngle = Tools.ToRadians(90);

  const rotationDirection = rightAngle * (Math.random() > 0.5 ? 1 : -1);
  const rotationProperty = Math.random() > 0.5 ? 'x' : 'y';

  const currentRotation = params.box.rotation;
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


  // if (
  //   rotationVector.x !== 0 &&
  //   Math.abs(Tools.ToDegrees(boxRotation.y)) % 180 === 90
  // ) {
  //   console.log('wrong rotation');
  // } 

  const xSlideAnimation = new Animation(
    'xSlide',
    'rotation',
    frameRate,
    Animation.ANIMATIONTYPE_VECTOR3,
    Animation.ANIMATIONLOOPMODE_RELATIVE
  );

  const endEvent = new AnimationEvent(
    frameEnd,
    () => {
      emitEvent({
        type: boxEvents.rotationEnd,
        entity: params.entity,
        payload: {},
      });
    },
    true
  );

  xSlideAnimation.addEvent(endEvent);

  const keyFrames = [];

  keyFrames.push({
    frame: 0,
    value: currentRotation,
  });

  keyFrames.push({
    frame: frameEnd,
    value: nextRotation,
  });

  xSlideAnimation.setKeys(keyFrames);

  return xSlideAnimation;
};

export const boxSystem = (state: State) =>
  createSystem<Box>({
    state,
    name: componentName.box,
    event: {
      [boxEvents.onClick]: ({ state, entity, component, payload }) => {
        if (!component.isAnimating) {
          const box = scene.getTransformNodeByUniqueId(parseInt(entity));

          if (box) {
            box.animations[0] = createRotationBoxAnimation({ entity, box });
            scene.beginAnimation(box, 0, 2 * frameRate, false);

            box.getChildren().forEach((plane) => {
              if (plane.uniqueId !== payload.planeId) {
                const mesh = scene.getMeshByUniqueId(plane.uniqueId);
                if (mesh) {
                  (mesh.material as StandardMaterial).diffuseColor =
                    Color3.Red();
                  (mesh.material as StandardMaterial).diffuseTexture =
                    new Texture(dot1, scene);
                }
              }
            });
          }
        }

        return setComponent<Box>({
          state,
          data: {
            ...component,
            isAnimating: true,
          },
        });
      },
      [boxEvents.rotationEnd]: ({ state, entity, component }) => {
        const box = scene.getTransformNodeByUniqueId(parseInt(entity));

        if (box) {
          box.rotation.x = 0;
          box.rotation.y = 0;

          box.getChildren().forEach((plane) => {
            const mesh = scene.getMeshByUniqueId(plane.uniqueId);
            if (mesh) {
              (mesh.material as StandardMaterial).diffuseColor = Color3.Red();
              (mesh.material as StandardMaterial).diffuseTexture = new Texture(
                dot1,
                scene
              );
            }
          });
        }

        return setComponent<Box>({
          state,
          data: {
            ...component,
            isAnimating: false,
          },
        });
      },
    },
  });
