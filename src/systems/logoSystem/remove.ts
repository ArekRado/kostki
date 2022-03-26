import { removeEntity } from '@arekrado/canvas-engine'
import { State } from '../../type'
import { logoGrid } from './logoGrid'

export const remove = ({ state }: { state: State }): State => {
  const sceneRef = state.babylonjs.sceneRef
  if (!sceneRef) {
    return state
  }

  state = logoGrid.flat().reduce((acc, boxEntity) => {
    const boxMesh = sceneRef.getTransformNodeByUniqueId(parseFloat(boxEntity))
    boxMesh?.dispose()

    return removeEntity({ state: acc, entity: boxEntity })
  }, state)

  return state
}
