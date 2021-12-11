import { createEventSystem } from './ecs/createEventSystem';
import { Page, State } from './ecs/type';
import { BoxEvent } from './systems/boxSystem';
import { rotateHandler } from './systems/boxSystem/rotateHandler';
import { rotationEndHandler } from './systems/boxSystem/rotationEndHandler';
import { CameraEvent } from './systems/cameraSystem';
import { handleResize } from './systems/cameraSystem/handleResize';
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
import { handleStartCustomLevel } from './systems/gameSystem/handleStartCustomLevel';
import { LogoEvent } from './systems/logoSystem';
import { handleRotateBox } from './systems/logoSystem/handleRotateBox';

type AllEvents = LogoEvent.All | GameEvent.All | BoxEvent.All | CameraEvent.All;

const eventHandler = ({
  state,
  event,
}: {
  state: State;
  event: AllEvents;
}): State => {
  switch (event.type) {
    // Camera
    case CameraEvent.Type.resize:
      state = handleResize({ state, event });
      break;

    // Logo
    case LogoEvent.Type.rotateBox:
      state = handleRotateBox({ state, event });
      break;

    // Game
    case GameEvent.Type.startCustomLevel:
      state = handleStartCustomLevel({ state, event });
      break;
    case GameEvent.Type.nextTurn:
      state = handleNextTurn({ state, event });
      break;
    case GameEvent.Type.playerClick:
      state = handlePlayerClick({ state, event });
      break;
    case GameEvent.Type.cleanScene:
      state = handleCleanScene({ state, event });
      break;
    case GameEvent.Type.changePlayers:
      state = handleChangePlayers({ state, event });
      break;
    case GameEvent.Type.changeDifficulty:
      state = handleChangeDifficulty({ state, event });
      break;
    case GameEvent.Type.changeQuickStart:
      state = handleChangeQuickStart({ state, event });
      break;
    case GameEvent.Type.changeColorBlindMode:
      state = handleChangeColorBlindMode({ state, event });
      break;
    case GameEvent.Type.changeMapType:
      state = handleChangeMapType({ state, event });
      break;
    case GameEvent.Type.showNewVersion:
      state = handleShowNewVersion({ state, event });
      break;
    case GameEvent.Type.reload:
      state = handleReload({ state, event });
      break;
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
      state = handleStartCustomLevel({
        state,
        event: { type: GameEvent.Type.startCustomLevel, payload: {} },
      });

      break;

    // Box
    case BoxEvent.Type.rotationEnd:
      state = rotationEndHandler({ state, event });
      break;
    case BoxEvent.Type.rotate:
      state = rotateHandler({ state, event });
      break;
  }
  return state;
};

const { emitEvent, eventSystem } = createEventSystem<AllEvents>(eventHandler);

export { eventSystem, emitEvent };
