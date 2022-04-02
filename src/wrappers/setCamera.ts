import { Camera } from '@arekrado/canvas-engine'
import {
  getCamera,
  setCamera as setCanvasEngineCamera,
} from '@arekrado/canvas-engine/system/camera'
import { updateLogoPosition } from '../systems/logoSystem/updateLogoPosition'
import { State } from '../type'

export const setCamera = ({
  state,
  data,
}: {
  state: State
  data: Partial<Camera>
}) => {
  const camera = getCamera({ state })

  state = setCanvasEngineCamera({
    state,
    data: { ...camera, ...data },
  }) as State

  state = updateLogoPosition({ state })

  return state
}
