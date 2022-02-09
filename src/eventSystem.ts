import { Page, State } from './type';
import { BoxEvent } from './systems/boxSystem';
import { rotateHandler } from './systems/boxSystem/rotateHandler';
import { rotationEndHandler } from './systems/boxSystem/rotationEndHandler';
// import { CameraEvent } from './systems/cameraSystem';
// import { handleResize } from './systems/cameraSystem/handleResize';
import { GameEvent } from './systems/gameSystem';
import {
  handleChangeColorBlindMode,
  handleChangeDifficulty,
  handleChangeMapType,
  handleChangePlayers,
  handleChangeQuickStart,
  handleReload,
  handleShowNewVersion,
} from './systems/gameSystem/handleChangeSettings';
import { handleCleanScene } from './systems/gameSystem/handleCleanScene';
import { handleNextTurn } from './systems/gameSystem/handleNextTurn';
import { handlePlayerClick } from './systems/gameSystem/handlePlayerClick';
import { handleShakeAiBoxes } from './systems/gameSystem/handleShakeAiBoxes';
import { handleStartCustomLevel } from './systems/gameSystem/handleStartCustomLevel';
import { LogoEvent } from './systems/logoSystem';
import { handleRotateBox } from './systems/logoSystem/handleRotateBox';
import { createEventSystem } from '@arekrado/canvas-engine';
import { CameraEvent } from '@arekrado/canvas-engine/dist/system/camera';
import { handleResize } from './systems/cameraSystem/handleResize';
import { AIEvent } from './systems/aiSystem';
import { handleBoxRotationEnd } from './systems/aiSystem/handleBoxRotationEnd';
import { MarkerEvent } from './systems/markerSystem';
import { handleAppearAnimationEnd } from './systems/markerSystem/handleAppearAnimationEnd';

type AllEvents =
  | AIEvent.All
  | LogoEvent.All
  | GameEvent.All
  | BoxEvent.All
  | CameraEvent.All
  | MarkerEvent.All;

const eventHandler = ({
  state,
  event,
}: {
  state: State;
  event: AllEvents;
}): State => {
  switch (event.type) {
    // AI
    case AIEvent.Type.boxRotationEnd:
      return handleBoxRotationEnd({ state, event });

    // // Camera
    case CameraEvent.Type.resize:
      return handleResize({ state, event });

    // Logo
    case LogoEvent.Type.rotateBox:
      return handleRotateBox({ state, event });

    // Game
    case GameEvent.Type.startCustomLevel:
      return handleStartCustomLevel({ state, event });
    case GameEvent.Type.nextTurn:
      return handleNextTurn({ state, event });
    case GameEvent.Type.playerClick:
      return handlePlayerClick({ state, event });
    case GameEvent.Type.cleanScene:
      return handleCleanScene({ state, event });
    case GameEvent.Type.changePlayers:
      return handleChangePlayers({ state, event });
    case GameEvent.Type.changeDifficulty:
      return handleChangeDifficulty({ state, event });
    case GameEvent.Type.changeQuickStart:
      return handleChangeQuickStart({ state, event });
    case GameEvent.Type.changeColorBlindMode:
      return handleChangeColorBlindMode({ state, event });
    case GameEvent.Type.changeMapType:
      return handleChangeMapType({ state, event });
    case GameEvent.Type.showNewVersion:
      return handleShowNewVersion({ state, event });
    case GameEvent.Type.reload:
      return handleReload({ state, event });
    case GameEvent.Type.shakeAiBoxes:
      return handleShakeAiBoxes({ state, event });
    case GameEvent.Type.playAgainCustomLevel:
      state = handleCleanScene({
        state,
        event: {
          type: GameEvent.Type.cleanScene,
          payload: {
            newPage: Page.customLevel,
          },
        },
      });
      return handleStartCustomLevel({
        state,
        event: { type: GameEvent.Type.startCustomLevel, payload: {} },
      });

    // Box
    case BoxEvent.Type.rotationEnd:
      return rotationEndHandler({ state, event });
    case BoxEvent.Type.rotate:
      return rotateHandler({ state, event });

    // Marker
    case MarkerEvent.Type.appearAnimationEnd:
      return handleAppearAnimationEnd({ state, event });
  }
};

export const { emitEvent, eventSystem } = createEventSystem<AllEvents, State>({
  eventHandler,
});
