import { AI, Box, gameComponent, State } from '../../type'
import { BoxEvent, BoxRotationDirection } from '../boxSystem'
import { getTextureSet } from '../boxSystem/getTextureSet'
import { getGame } from '../gameSystem'
import { emitEvent, getComponent } from '@arekrado/canvas-engine'

const halfPi = Math.PI / 3 // Max value from Math.sin is "Math.PI / 2" but animation end is to fast, divide by 3 makes it perfect

type AnimationData = {
  boxRotationDirection: BoxRotationDirection
  timeout: number
}

const sideToSideTransition =
  ({
    gridMaxSideLength,
    maxTime,
    direction,
  }: {
    gridMaxSideLength: number
    maxTime: number
    direction: 'up' | 'down' | 'left' | 'right'
  }) =>
  (boxPosition: [number, number]): AnimationData => {
    let animationProgress = 0
    let boxRotationDirection = BoxRotationDirection.up

    switch (direction) {
      case 'down':
        animationProgress =
          (gridMaxSideLength - boxPosition[1]) / gridMaxSideLength
        boxRotationDirection = BoxRotationDirection.down
        break
      case 'up':
        animationProgress = boxPosition[1] / gridMaxSideLength
        boxRotationDirection = BoxRotationDirection.up
        break
      case 'left':
        animationProgress =
          (gridMaxSideLength - boxPosition[0]) / gridMaxSideLength
        boxRotationDirection = BoxRotationDirection.left
        break
      case 'right':
        animationProgress = boxPosition[0] / gridMaxSideLength
        boxRotationDirection = BoxRotationDirection.right
        break
    }

    return {
      timeout: Math.sin(animationProgress * halfPi) * maxTime,
      boxRotationDirection,
    }
  }

const centerToOutsideTransitionDirection = (diff: [number, number]) => {
  let boxRotationDirection = BoxRotationDirection.up

  const normalisedDiff = [Math.abs(diff[0]), Math.abs(diff[1])]
  const xBiggerThanY = normalisedDiff[0] > normalisedDiff[1]

  if (diff[0] < 0 && diff[1] < 0) {
    boxRotationDirection = xBiggerThanY
      ? BoxRotationDirection.left
      : BoxRotationDirection.down
  } else if (diff[0] > 0 && diff[1] < 0) {
    boxRotationDirection = xBiggerThanY
      ? BoxRotationDirection.right
      : BoxRotationDirection.down
  } else if (diff[0] < 0 && diff[1] > 0) {
    boxRotationDirection = xBiggerThanY
      ? BoxRotationDirection.left
      : BoxRotationDirection.up
  } else if (diff[0] > 0 && diff[1] > 0) {
    boxRotationDirection = xBiggerThanY
      ? BoxRotationDirection.right
      : BoxRotationDirection.up
  }

  return boxRotationDirection
}
const centerToOutsideTransition =
  ({
    gridMaxSideLength,
    maxTime,
    direction,
  }: {
    gridMaxSideLength: number
    maxTime: number
    direction: 'center' | 'outside'
  }) =>
  (boxPosition: [number, number]): AnimationData => {
    const center = [gridMaxSideLength / 2, gridMaxSideLength / 2]
    const diff = [center[0] - boxPosition[0], center[1] - boxPosition[1]]
    const distanceFromCenter = Math.sqrt(
      Math.pow(diff[0], 2) + Math.pow(diff[1], 2),
    )
    const maxDistance = Math.sqrt(
      Math.pow(center[0], 2) + Math.pow(center[1], 2),
    )

    let animationProgress = 0
    let boxRotationDirection = BoxRotationDirection.up

    switch (direction) {
      case 'center':
        animationProgress = maxDistance - distanceFromCenter
        boxRotationDirection = centerToOutsideTransitionDirection([
          diff[0],
          diff[1],
        ])
        break
      case 'outside':
        animationProgress = distanceFromCenter
        boxRotationDirection = centerToOutsideTransitionDirection([
          -diff[0],
          -diff[1],
        ])
        break
    }

    return {
      timeout: Math.sin((animationProgress / maxDistance) * halfPi) * maxTime,
      boxRotationDirection,
    }
  }

export const playLevelStartAnimation = ({ state }: { state: State }) => {
  const game = getGame({ state })

  const gridMaxSideLength = Math.sqrt(game?.grid.length || 1) - 1
  const maxTime = 250 * gridMaxSideLength

  const allAnimations = [
    centerToOutsideTransition({
      gridMaxSideLength,
      maxTime,
      direction: 'center',
    }),
    centerToOutsideTransition({
      gridMaxSideLength,
      maxTime,
      direction: 'outside',
    }),
    sideToSideTransition({ gridMaxSideLength, maxTime, direction: 'left' }),
    sideToSideTransition({ gridMaxSideLength, maxTime, direction: 'right' }),
    sideToSideTransition({ gridMaxSideLength, maxTime, direction: 'down' }),
    sideToSideTransition({ gridMaxSideLength, maxTime, direction: 'up' }),
  ]

  const randomIndex = Math.floor(allAnimations.length * Math.random())
  const animation = allAnimations[randomIndex]

  game?.grid.forEach((boxEntity) => {
    const box = getComponent<Box>({
      state,
      entity: boxEntity,
      name: gameComponent.box,
    })

    const ai = getComponent<AI>({
      state,
      entity: box?.player || '',
      name: gameComponent.ai,
    })

    if (box && ai) {
      const animationData = animation(box.gridPosition)
      const timeout = animationData.timeout + Math.random() * 500

      setTimeout(() => {
        emitEvent<BoxEvent.Rotate>({
          type: BoxEvent.Type.rotateStart,
          payload: {
            color: ai.color,
            texture: getTextureSet({ state, ai })[box.dots],
            direction: animationData.boxRotationDirection,
            boxEntity,
          },
        })
      }, timeout)
    }
  })
}
