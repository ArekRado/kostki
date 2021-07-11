import {
  TransformNode,
  Animation,
  AnimationEvent,
  Color3,
  StandardMaterial,
  Texture,
  Vector3,
  Tools,
} from 'babylonjs';
import { createSystem } from '../ecs/createSystem';
import { componentName, setComponent } from '../ecs/component';
import { AI, Box, Entity, State } from '../ecs/type';
import { scene } from '..';
import { emitEvent } from '../ecs/emitEvent';

import { gameEntity, gameEvents } from './gameSystem';

export const boxEvents = {
  onClick: 'box-onClick',
  rotationEnd: 'box-rotationEnd',
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
  direction?: 'up' | 'down' | 'left' | 'right';
  animationEndCallback: () => void;
  ai: AI;
  dots: number;
}) => {
  const box = scene.getTransformNodeByUniqueId(parseInt(params.entity));

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
        params.animationEndCallback();
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

    box.animations[0] = xSlideAnimation;

    scene.beginAnimation(box, 0, 2 * frameRate, false);

    const children = box.getChildren();
    const color = params.ai.color;

    children.slice(0, -1).forEach((plane) => {
      const mesh = scene.getMeshByUniqueId(plane.uniqueId);
      if (mesh) {
        (mesh.material as StandardMaterial).diffuseColor = new Color3(
          color[0],
          color[1],
          color[2]
        );

        (mesh.material as StandardMaterial).diffuseTexture = new Texture(
          params.ai.textureSet[params.dots],
          scene
        );
      }
    });
  }
};

export const boxSystem = (state: State) =>
  createSystem<Box>({
    state,
    name: componentName.box,
    event: {
      [boxEvents.onClick]: ({ state, entity, component, payload }) => {
        let dots = component.dots;
        if (!component.isAnimating) {
          dots = component.dots === 6 ? 1 : component.dots + 1;

          const animationEndCallback = () => {
            emitEvent({
              type: boxEvents.rotationEnd,
              entity: entity,
              payload: { ai: payload.ai },
            });
          };

          if (process.env.NODE_ENV !== 'test') {
            createRotationBoxAnimation({
              entity,
              animationEndCallback,
              dots,
              ai: payload.ai,
            });
          } else {
            animationEndCallback();
          }

          // const box = scene.getTransformNodeByUniqueId(parseInt(entity));

          // if (box) {
          //   box.animations[0] =
          //   scene.beginAnimation(box, 0, 2 * frameRate, false);

          //   const children = box.getChildren();
          //   const color = payload.ai.color;

          //   children.slice(0, -1).forEach((plane) => {
          //     const mesh = scene.getMeshByUniqueId(plane.uniqueId);
          //     if (mesh) {
          //       (mesh.material as StandardMaterial).diffuseColor = new Color3(
          //         color[0],
          //         color[1],
          //         color[2]
          //       );

          //       (mesh.material as StandardMaterial).diffuseTexture =
          //         new Texture(payload.ai.textureSet[dots], scene);
          //     }
          //   });
          // }
        }

        return setComponent<Box>({
          state,
          data: {
            ...component,
            isAnimating: true,
            player: payload.ai.entity,
            dots,
          },
        });
      },
      [boxEvents.rotationEnd]: ({ state, entity, component, payload }) => {
        const box = scene.getTransformNodeByUniqueId(parseInt(entity));

        if (box) {
          box.rotation.x = 0;
          box.rotation.y = 0;
          const color = payload.ai.color;
          const dots = component.dots;

          box.getChildren().forEach((plane) => {
            const mesh = scene.getMeshByUniqueId(plane.uniqueId);
            if (mesh) {
              (mesh.material as StandardMaterial).diffuseColor = new Color3(
                color[0],
                color[1],
                color[2]
              );
              (mesh.material as StandardMaterial).diffuseTexture = new Texture(
                payload.ai.textureSet[dots],
                scene
              );
            }
          });
        }

        emitEvent({
          type: gameEvents.nextTurn,
          entity: gameEntity,
          payload: {},
        });

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
