import { getGridDimensions } from '../systems/gameSystem/startLevelUtils'
import { describe, it, toBeEqual } from './utils'

const round = (n: number, accuracy: number) =>
  Math.round(n * accuracy) / accuracy

export const run = () =>
  describe('startLevelUtils', [
    it('should calculate proper camera position', () => {
      const grid = [
        [1, 1],
        [1, 1],
      ]
      const { center, cameraDistance } = getGridDimensions({ grid })

      return (
        toBeEqual(round(center[0], 10), 0.6) &&
        toBeEqual(round(center[1], 10), 0.6) &&
        toBeEqual(cameraDistance, 3)
      )
    }),
    it('should calculate proper camera position', () => {
      const grid = [
        [1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1],
      ]
      const { center, cameraDistance } = getGridDimensions({ grid })

      return (
        toBeEqual(round(center[0], 10), 3) &&
        toBeEqual(round(center[1], 10), 3) &&
        toBeEqual(cameraDistance, 3.8)
      )
    }),
    it('should calculate proper camera position', () => {
      const grid = [
        [1, 1],
      ]
      const { center, cameraDistance } = getGridDimensions({ grid })

      return (
        toBeEqual(round(center[0], 10), 0.6) &&
        toBeEqual(round(center[1], 10), 0) &&
        toBeEqual(cameraDistance, 3)
      )
    }),
  ])
