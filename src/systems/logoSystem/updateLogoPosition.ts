import {
  componentName,
  Transform,
  updateComponent,
} from '@arekrado/canvas-engine'
import { getCamera } from '@arekrado/canvas-engine/system/camera'
import { State } from '../../type'
import { percentageToValue } from '../../utils/percentageToValue'
import { getCameraSizes } from '../cameraSystem/getCameraSizes'
import { logoGrid } from './logoGrid'

export const boxScaleFactor = 3.2

export const updateLogoPosition = ({ state }: { state: State }): State => {
   const camera = getCamera({ state })

  if (!camera) {
    return state
  }

  const { topEdge, boxSize, screenSize } = getCameraSizes({
    state,
    boxScaleFactor,
  })

  const logoSize = [logoGrid[0].length * boxSize, logoGrid.length * boxSize]
  const logoPosition = [
    camera.position[0] - logoSize[0] / 2,
    topEdge - percentageToValue({ total: screenSize[1], percentage: 0.1 }),
  ]

  state = logoGrid.reduce(
    (acc1, list, i) =>
      list.reduce((acc2, boxEntity, j) => {
        if (boxEntity === '') {
          return acc2
        }

        const boxPosition: [number, number] = [
          logoPosition[0] + j * boxSize,
          logoPosition[1] + -i * boxSize,
        ]

        return updateComponent<Transform, State>({
          state: acc2,
          name: componentName.transform,
          entity: boxEntity,
          update: () => ({
            position: [boxPosition[0], boxPosition[1]],
            scale: [1 / boxScaleFactor, 1 / boxScaleFactor, 1 / boxScaleFactor],
          }),
        })
      }, acc1),
    state,
  )

  return state
}
