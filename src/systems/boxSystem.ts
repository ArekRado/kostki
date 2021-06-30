import { Animation, AnimationEvent } from 'babylonjs';
import { createSystem } from '../ecs/createSystem';
import { componentName } from '../ecs/component';
import { Box, Entity, State } from '../ecs/type';
import { scene } from '..';
import { emitEvent } from '../ecs/emitEvent';

export const boxEvents = {
  onClick: 'onClick',
  rotationEnd: 'rotationEnd',
};

const frameRate = 30;
export const createRotationBoxAnimation = (params: { entity: Entity }) => {
  const xSlideAnimation = new Animation(
    'xSlide',
    'rotation.x',
    frameRate,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  const endEvent = new AnimationEvent(
    frameRate,
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
    value: Math.PI,
  });

  keyFrames.push({
    frame: 0.5 * frameRate,
    value: Math.PI * 1.5,
  });

  xSlideAnimation.setKeys(keyFrames);

  return xSlideAnimation;
};

export const boxSystem = (state: State) =>
  createSystem<Box>({
    state,
    name: componentName.box,
    event: {
      [boxEvents.onClick]: ({ state, entity }) => {
        const box = scene.getMeshByUniqueId(parseInt(entity));
        if (box) {
          console.log(box.animations.)
          box.animations.push(createRotationBoxAnimation({ entity }));
          scene.beginAnimation(box, 0, 2 * frameRate, false);
        }

        console.log(entity);
        return state;
      },
      [boxEvents.rotationEnd]: ({ state, entity }) => {
        console.log(entity, 'roration end');
        return state;
      },
    },
    // tick: ({ state, component: collideBox }) => {
    //   const entity = getEntity({
    //     state,
    //     entityId: collideBox.entityId,
    //   });

    //   if (entity) {
    //     const collisions = findCollisionsWith({
    //       state,
    //       collideBox,
    //       entity,
    //     });

    //     return setComponent<CollideBox>(componentName.collideBox, {
    //       state,
    //       data: {
    //         ...collideBox,
    //         collisions,
    //       },
    //     });
    //   }

    //   return state;
    // },
  });
