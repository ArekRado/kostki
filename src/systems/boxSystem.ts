import { AbstractMesh, Animation, AnimationEvent } from 'babylonjs';
import { createSystem } from '../ecs/createSystem';
import { componentName, setComponent } from '../ecs/component';
import { Box, Entity, State } from '../ecs/type';
import { scene } from '..';
import { emitEvent } from '../ecs/emitEvent';

export const boxEvents = {
  onClick: 'onClick',
  rotationEnd: 'rotationEnd',
};

const frameRate = 30;
const frameEnd = 0.3 * frameRate;

export const createRotationBoxAnimation = (params: {
  entity: Entity;
  box: AbstractMesh;
}) => {
  const rotationDirection = Math.random() > 0.5 ? 1 : -1;
  const rotationProperty = Math.random() > 0.5 ? 'x' : 'y';

  const xSlideAnimation = new Animation(
    'xSlide',
    `rotation.${rotationProperty}`,
    frameRate,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CONSTANT
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

  const currentRotation = params.box.rotation[rotationProperty];
  const nextRotation = currentRotation + rotationDirection * 1.5;

  keyFrames.push({
    frame: 0,
    value: currentRotation,
  });

  keyFrames.push({
    frame: frameEnd,
    value: nextRotation, // Math.PI * -1.5, // * (rotationDirection ? 1.5 : 1.5),
  });

  xSlideAnimation.setKeys(keyFrames);

  return xSlideAnimation;
};

export const boxSystem = (state: State) =>
  createSystem<Box>({
    state,
    name: componentName.box,
    event: {
      [boxEvents.onClick]: ({ state, entity, component }) => {
        if (!component.isAnimating) {
          const box = scene.getMeshByUniqueId(parseInt(entity));
          if (box) {
            box.animations[0] = createRotationBoxAnimation({ entity, box });
            scene.beginAnimation(box, 0, 2 * frameRate, false);
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
        const box = scene.getMeshByUniqueId(parseInt(entity));

        if (box) {
          box.rotation.x = 0;
          box.rotation.y = 0;
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
