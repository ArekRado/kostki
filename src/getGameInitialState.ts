import { humanPlayerEntity, scene } from '.';
import { setComponent, componentName } from './ecs/component';
import { initialState } from './ecs/state';
import { AI, Background, Camera, Game, Scene, State, UI } from './ecs/type';
import { AIDifficulty, aiSystem } from './systems/aiSystem';
import { boxSystem } from './systems/boxSystem';
import { gameEntity, gameSystem } from './systems/gameSystem';
import { markerSystem } from './systems/markerSystem';
import {
  cameraEntity,
  cameraSystem,
  getCameraSize,
} from './systems/cameraSystem';
import { uiEntity, uiSystem } from './systems/uiSystem';
import { uiButtonSystem } from './systems/uiButtonSystem';
import { uiTextSystem } from './systems/uiTextSystem';
import { playersList } from './systems/gameSystem/handleChangeSettings';
import { backgroundEntity, backgroundSystem } from './systems/backgroundSystem';
import { turnIndicatorSystem } from './systems/turnIndicatorSystem';
import { logoSystem } from './systems/logoSystem';
import { eventSystem } from './eventSystem';
import { setScene } from './systems/gameSystem/handleCleanScene';

type GetGameInitialState = () => State;
export const getGameInitialState: GetGameInitialState = () => {
  let state = initialState;

  const version = '0.0.1';

  // Systems
  state = eventSystem(state);
  state = boxSystem(state);
  state = aiSystem(state);
  state = gameSystem(state);
  state = markerSystem(state);
  state = cameraSystem(state);
  state = uiSystem(state);
  state = uiButtonSystem(state);
  // state = uiImageSystem(state);
  state = uiTextSystem(state);
  state = backgroundSystem(state);
  state = turnIndicatorSystem(state);
  state = logoSystem(state);

  state = setComponent<AI>({
    state,
    data: {
      entity: humanPlayerEntity,
      name: componentName.ai,
      human: true,
      level: AIDifficulty.hard,
      color: [0, 0, 1],
      textureSet: ['', '', '', '', '', '', ''],
      active: true,
    },
  });

  state = setComponent<Game>({
    state,
    data: {
      version,
      newVersionAvailable: false,
      entity: gameEntity,
      name: componentName.game,
      grid: [],
      round: 0,
      currentPlayer: humanPlayerEntity,
      gameStarted: false,
      playersQueue: [],
      boxRotationQueue: [],
      colorBlindMode: false,
      customLevelSettings: {
        players: playersList().slice(0, 8),
        difficulty: AIDifficulty.easy,
        quickStart: true,
        mapType: '',
      },
      musicEnabled: false,
    },
  });

  state = setComponent<UI>({
    state,
    data: {
      entity: uiEntity,
      name: componentName.ui,
      type: Scene.mainMenu,
      // cleanControls: false,
    },
  });

  state = setComponent<Camera>({
    state,
    data: {
      entity: cameraEntity,
      name: componentName.camera,
      position: [0, 0],
      distance: 5,
      ...getCameraSize(5, scene),
    },
  });

  state = setComponent<Background>({
    state,
    data: {
      entity: backgroundEntity,
      name: componentName.background,
      gradientTime: 50000 * Math.random(),
    },
  });

  // const savedState = getSavedState();
  // const savedStateVersion = getGame({
  //   state: savedState || initialState,
  // })?.version;

  // if (savedState && savedStateVersion === version) {
  //   state = {
  //     ...state,
  //     entity: savedState.entity,
  //     component: savedState.component,
  //   };

  //   // state = recreateAllComponents({ state });
  // }
  // removeState();

  state = setScene({ state, scene: Scene.mainMenu });

  return state;
};
