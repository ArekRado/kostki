import { getCamera } from '@arekrado/canvas-engine/system/camera'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { State } from '../../type'
import { backgroundEntity } from '../backgroundSystem'
import { getCameraSize } from '../cameraSystem/getCameraSize'

export const resizeBackground = (state: State): State => {
  if (state.babylonjs.sceneRef) {
    const background = state.babylonjs.sceneRef.getMeshByUniqueId(
      parseFloat(backgroundEntity),
    )
    const camera = getCamera({ state })

    if (background && camera && state.babylonjs.sceneRef) {
      const size = getCameraSize(camera.distance, state.babylonjs.sceneRef)

      background.position.x = camera.position[0]
      background.position.y = camera.position[1]

      background.scaling = new Vector3(
        Math.abs(size.left) + Math.abs(size.right),
        Math.abs(size.bottom) + Math.abs(size.top),
        1,
      )
    }
  }

  return state
}
