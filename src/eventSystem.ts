import { Page, State } from './type'
import { BoxEvent } from './systems/boxSystem'
import { handleRotateStart } from './systems/boxSystem/handleRotateStart'
import { handleRotationEnd } from './systems/boxSystem/handleRotationEnd'
import { GameEvent } from './systems/gameSystem'
import {
  handleChangeColorBlindMode,
  handleChangeDifficulty,
  handleChangeMapType,
  handleChangePlayers,
  handleChangeQuickStart,
  handleReload,
  handleShowNewVersion,
} from './systems/gameSystem/handleChangeSettings'
import { handleCleanScene } from './systems/gameSystem/handleCleanScene'
import { handlePlayerClick } from './systems/gameSystem/handlePlayerClick'
import { handleShakeAiBoxes } from './systems/gameSystem/handleShakeAiBoxes'
import { handleStartCustomLevel } from './systems/gameSystem/handleStartCustomLevel'
import { LogoEvent } from './systems/logoSystem'
import { handleRotateRandomLogoBox } from './systems/logoSystem/handleRotateBox'
import { CameraEvent } from '@arekrado/canvas-engine/system/camera'
import { handleResize } from './systems/cameraSystem/handleResize'
import { MarkerEvent } from './systems/markerSystem'
import { handleAppearAnimationEnd } from './systems/markerSystem/handleAppearAnimationEnd'
import {
  DevtoolsEvent,
  handleEnableDevtools,
} from './utils/handleEnableDevtools'

type AllEvents =
  | LogoEvent.All
  | GameEvent.All
  | BoxEvent.All
  | CameraEvent.All
  | MarkerEvent.All
  | DevtoolsEvent.All

export const eventHandler = ({
  state,
  event,
}: {
  state: State
  event: AllEvents
}): State => {
  switch (event.type) {
    // Camera
    case CameraEvent.Type.resize:
      return handleResize({ state, event })

    // Logo
    case LogoEvent.Type.rotateRandomLogoBox:
      return handleRotateRandomLogoBox({ state, event })

    // Game
    case GameEvent.Type.startCustomLevel:
      return handleStartCustomLevel({ state, event })
    case GameEvent.Type.playerClick:
      // const x: State = {
      //   entity: state.entity,
      //   component: state.component,
      //   system: state.system,
      //   globalSystem: state.globalSystem,
      //   babylonjs: {},
      // };
      // console.log(JSON.stringify(x));
      return handlePlayerClick({ state, event })
    case GameEvent.Type.cleanScene:
      return handleCleanScene({ state, event })
    case GameEvent.Type.changePlayers:
      return handleChangePlayers({ state, event })
    case GameEvent.Type.changeDifficulty:
      return handleChangeDifficulty({ state, event })
    case GameEvent.Type.changeQuickStart:
      return handleChangeQuickStart({ state, event })
    case GameEvent.Type.changeColorBlindMode:
      return handleChangeColorBlindMode({ state, event })
    case GameEvent.Type.changeMapType:
      return handleChangeMapType({ state, event })
    case GameEvent.Type.showNewVersion:
      return handleShowNewVersion({ state, event })
    case GameEvent.Type.reload:
      return handleReload({ state, event })
    case GameEvent.Type.shakeAiBoxes:
      return handleShakeAiBoxes({ state, event })
    case GameEvent.Type.playAgainCustomLevel:
      state = handleCleanScene({
        state,
        event: {
          type: GameEvent.Type.cleanScene,
          payload: {
            newPage: Page.customLevel,
          },
        },
      })
      return handleStartCustomLevel({
        state,
        event: { type: GameEvent.Type.startCustomLevel, payload: {} },
      })

    // Box
    case BoxEvent.Type.rotationEnd:
      return handleRotationEnd({ state, event })
    case BoxEvent.Type.rotateStart:
      return handleRotateStart({ state, event })

    // Marker
    case MarkerEvent.Type.appearAnimationEnd:
      return handleAppearAnimationEnd({ state, event })

    // Devtools
    case DevtoolsEvent.Type.enable:
      return handleEnableDevtools({ state, event })
  }

  return state
}
