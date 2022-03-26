import { Scene } from '@babylonjs/core/scene'
import { getAspectRatio } from '../../utils/getAspectRatio'

export const getCameraSize = (distance: number, scene: Scene) => {
  const aspect = getAspectRatio(scene)

  if (aspect > 1) {
    return {
      left: -distance,
      right: distance,
      bottom: -distance * aspect,
      top: distance * aspect,
    }
  } else {
    return {
      bottom: -distance,
      top: distance,
      left: -distance / aspect,
      right: distance / aspect,
    }
  }
}
