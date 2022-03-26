import { Box, name, State } from '../../type'
import { GameEvent, getGame, shakeAnimationTimeout } from '../gameSystem'
import {
  componentName,
  createComponent,
  EventHandler,
  getComponent,
  Transform,
  Animation,
  emitEvent,
} from '@arekrado/canvas-engine'
import { getTime } from '@arekrado/canvas-engine/system/time'

const idleTime = shakeAnimationTimeout * 2

export const handleShakeAiBoxes: EventHandler<
  GameEvent.ShakeAiBoxesEvent,
  State
> = ({
  state,
  event: {
    payload: { ai },
  },
}) => {
  const game = getGame({ state })
  const time = getTime({ state })

  const lastBoxClickTimestamp = game?.lastBoxClickTimestamp || 0
  const timeNow = time?.timeNow || 0

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
  if (timeNow > lastBoxClickTimestamp + idleTime) {
    game?.grid.forEach((boxEntity) => {
      const box = getComponent<Box>({
        state,
        name: name.box,
        entity: boxEntity,
      })

      const animation = getComponent<Animation.AnimationComponent>({
        state,
        name: componentName.animation,
        entity: boxEntity,
      })

      // Do not shake boxes which are already animated
      if (animation || box?.player !== ai.entity) {
        return
      }

      const transform = getComponent<Transform>({
        state,
        name: componentName.transform,
        entity: boxEntity,
      })

      if (transform) {
        const rotationValue = Math.PI / 16

        state = createComponent<Animation.AnimationComponent, State>({
          state,
          data: {
            name: componentName.animation,
            entity: boxEntity,
            deleteWhenFinished: true,
            isPlaying: true,
            isFinished: false,
            currentTime: 0,
            wrapMode: Animation.WrapMode.once,
            timingMode: Animation.TimingMode.smooth,
            properties: [
              {
                path: 'rotation',
                component: componentName.transform,
                entity: boxEntity,
                keyframes: [
                  {
                    duration: 150,
                    timingFunction: 'Linear',
                    valueRange: [
                      [0, 0, 0],
                      [0, 0, rotationValue],
                    ],
                  },
                  {
                    duration: 300,
                    timingFunction: 'Linear',
                    valueRange: [
                      [0, 0, rotationValue],
                      [0, 0, -rotationValue],
                    ],
                  },
                  {
                    duration: 300,
                    timingFunction: 'Linear',
                    valueRange: [
                      [0, 0, -rotationValue],
                      [0, 0, 0],
                    ],
                  },
                  {
                    duration: 50,
                    timingFunction: 'Linear',
                    valueRange: [
                      [0, 0, 0],
                      [0, 0, 0],
                    ],
                  },
                ],
              },
            ],
          },
        })
      }
    })
  }

  setTimeout(() => {
    emitEvent<GameEvent.ShakeAiBoxesEvent>({
      type: GameEvent.Type.shakeAiBoxes,
      payload: {
        ai,
      },
    })
  }, shakeAnimationTimeout)

  return state
}
