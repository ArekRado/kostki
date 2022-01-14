import { Vector3 } from '@babylonjs/core/Maths/math.vector';
// import { Animation, BezierCurveEase } from '@babylonjs/core/Animations';
import { scene } from '../..';
import { Box, Game, name, State } from '../../type';
import { GameEvent, getGame, shakeAnimationTimeout } from '../gameSystem';
import { emitEvent } from '../../eventSystem';
import {
  componentName,
  EventHandler,
  getComponent,
  Transform,
} from '@arekrado/canvas-engine';

export const handleShakeAiBoxes: EventHandler<
  GameEvent.ShakeAiBoxesEvent,
  State
> = ({
  state,
  event: {
    payload: { ai, moves },
  },
}) => {
  const game = getGame({ state });

  // player did move, do not distribut too often!
  // if (game && game?.moves !== moves) {
  //   setTimeout(() => {
  //     emitEvent<GameEvent.ShakeAiBoxesEvent>({
  //       type: GameEvent.Type.shakeAiBoxes,
  //       payload: {
  //         moves: game.moves,
  //         ai,
  //       },
  //     });
  //   }, shakeAnimationTimeout);

  //   return state;
  // }

  game?.grid.forEach((boxEntity) => {
    const box = getComponent<Box>({
      state,
      name: name.box,
      entity: boxEntity,
    });

    if (box?.player !== ai.entity) {
      return;
    }

    // const boxMesh = scene.getTransformNodeByUniqueId(parseInt(boxEntity));
    // if (!boxMesh || box.isAnimating) {
    //   // Stupid babylon, seriously it's so hard to check if animation is playing?
    //   return;
    // }

    //   const currentRotation = boxMesh.rotation;

    //   const shakeAnimation = new Animation(
    //     'shakeAnimation',
    //     'rotation',
    //     6,
    //     Animation.ANIMATIONTYPE_VECTOR3,
    //     Animation.ANIMATIONLOOPMODE_RELATIVE
    //   );

    //   const keyFrames = [];
    //   keyFrames.push({
    //     frame: 0,
    //     value: currentRotation,
    //   });
    //   keyFrames.push({
    //     frame: 1,
    //     value: new Vector3(
    //       currentRotation.x,
    //       currentRotation.y,
    //       currentRotation.z - Math.PI / 16
    //     ),
    //   });
    //   keyFrames.push({
    //     frame: 2,
    //     value: new Vector3(
    //       currentRotation.x,
    //       currentRotation.y,
    //       currentRotation.z + Math.PI / 16
    //     ),
    //   });
    //   keyFrames.push({
    //     frame: 3,
    //     value: currentRotation,
    //   });

    //   shakeAnimation.setKeys(keyFrames);
    //   shakeAnimation.setEasingFunction(new BezierCurveEase(0.37, 0, 0.63, 1));
    //   boxMesh.animations[0] = shakeAnimation;

    //   scene.beginAnimation(boxMesh, 0, 3, false, 1);

    const transform = getComponent<Transform>({
      state,
      name: componentName.transform,
      entity: boxEntity,
    });

    if (transform) {
      const rotationValue = Math.PI / 4;

      // state = setComponent<Animation>({
      //   state,
      //   data: {
      //     name: componentName.animation,
      //     entity: boxEntity,

      //     isPlaying: true,
      //     isFinished: false,
      //     property: {
      //       path: 'rotation',
      //       component: componentName.transform,
      //       entityId: boxEntity,
      //     },
      //     keyframes: [
      //       {
      //         duration: 300,
      //         timingFunction: 'Linear',
      //         value: {
      //           type: 'vector3D',
      //           value: [0, 0, 0],
      //         },
      //       },
      //       {
      //         duration: 600,
      //         timingFunction: 'Linear',
      //         value: {
      //           type: 'vector3D',
      //           value: [0, 0, 1],
      //         },
      //       },
      //       {
      //         duration: 300,
      //         timingFunction: 'Linear',
      //         value: {
      //           type: 'vector3D',
      //           value: [0, 0, -1],
      //         },
      //       },
      //       {
      //         duration: 0,
      //         timingFunction: 'Linear',
      //         value: {
      //           type: 'vector3D',
      //           value: [0, 0, 0],
      //         },
      //       },
      //     ],
      //     currentTime: 0,
      //     wrapMode: 'once',
      //     timingMode: 'smooth', // string animation should always works as step
      //   },
      // });
    }
  });

  // setTimeout(() => {
  //   emitEvent<GameEvent.ShakeAiBoxesEvent>({
  //     type: GameEvent.Type.shakeAiBoxes,
  //     payload: {
  //       moves: game?.moves || 0,
  //       ai,
  //     },
  //   });
  // }, shakeAnimationTimeout);

  return state;
};
