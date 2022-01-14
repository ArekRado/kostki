import { humanPlayerEntity, scene } from '.';
// import { AI, Background, Camera, Game, Page, State } from './type';
import { AIDifficulty, aiSystem } from './systems/aiSystem';
import { boxSystem } from './systems/boxSystem';
import { gameEntity, gameSystem } from './systems/gameSystem';
import { markerSystem } from './systems/markerSystem';

import { playersList } from './systems/gameSystem/handleChangeSettings';
import { backgroundEntity, backgroundSystem } from './systems/backgroundSystem';
import { logoSystem } from './systems/logoSystem';
import { eventSystem } from './eventSystem';
import { setScene } from './systems/gameSystem/handleCleanScene';
import { getSavedData } from './utils/localDb';
// import { timeSystem } from './systems/timeSystem';
// import { animationSystem } from './systems/animationSystem';
// import { transformSystem } from './systems/transformSystem';
import { AI, Background, Game, name, Page, State } from './type';
import {
  Camera,
  componentName,
  getState,
  setComponent,
} from '@arekrado/canvas-engine';
import { cameraEntity } from '@arekrado/canvas-engine/dist/system/cameraSystem';
import { getCameraSize } from './systems/cameraSystem/getCameraSize';

export const getGameInitialState = (): State => {
  let state = getState<State>({}) as State;

  const version = '0.0.7';

  // Systems
  // state = timeSystem(state);
  // state = animationSystem(state);
  state = eventSystem(state);
  // state = cameraSystem(state);
  // state = transformSystem(state);

  state = boxSystem(state);
  state = aiSystem(state);
  state = gameSystem(state);
  state = markerSystem(state);
  state = backgroundSystem(state);
  state = logoSystem(state);

  state = setComponent<AI, State>({
    state,
    data: {
      entity: humanPlayerEntity,
      name: name.ai,
      human: true,
      level: AIDifficulty.hard,
      color: [0, 0, 1],
      textureSet: ['', '', '', '', '', '', ''],
      active: true,
    },
  });

  const savedData = getSavedData();

  state = setComponent<Game, State>({
    state,
    data: {
      version,
      page: Page.mainMenu,
      newVersionAvailable: false,
      entity: gameEntity,
      name: name.game,
      moves: 0,
      grid: [],
      round: 0,
      currentPlayer: humanPlayerEntity,
      gameStarted: false,
      playersQueue: [],
      boxRotationQueue: [],
      colorBlindMode: savedData?.colorBlindMode || false,
      customLevelSettings: {
        players: savedData?.players || playersList().slice(0, 4),
        difficulty: savedData?.difficulty || AIDifficulty.medium,
        quickStart: savedData?.quickStart || true,
        mapType: savedData?.mapType || '',
      },
    },
  });

  state = setComponent<Camera, State>({
    state,
    data: {
      entity: cameraEntity,
      name: componentName.camera,
      position: [0, 0],
      distance: 5,
      ...getCameraSize(5, scene),
    },
  });

  state = setComponent<Background, State>({
    state,
    data: {
      entity: backgroundEntity,
      name: name.background,
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

  state = setScene({ state, page: Page.mainMenu });

  return state;
};
