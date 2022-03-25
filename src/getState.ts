import { humanPlayerEntity } from '.';
import { AIDifficulty, aiSystem } from './systems/aiSystem';
import { boxSystem } from './systems/boxSystem';
import { gameEntity, gameSystem } from './systems/gameSystem';
import { markerSystem } from './systems/markerSystem';

import { playersList } from './systems/gameSystem/handleChangeSettings';
import { backgroundEntity, backgroundSystem } from './systems/backgroundSystem';
import { logoSystem } from './systems/logoSystem';
import { setScene } from './systems/gameSystem/handleCleanScene';
import { getSavedData } from './utils/localDb';
import { AI, Background, Game, name, Page, State } from './type';
import {
  addEventHandler,
  Camera,
  componentName,
  createComponent,
  getState as getCanvaasEngineState,
  setEntity,
} from '@arekrado/canvas-engine';
import { cameraEntity } from '@arekrado/canvas-engine/system/camera';
import { getCameraSize } from './systems/cameraSystem/getCameraSize';
import { Scene } from '@babylonjs/core/scene';
import { UniversalCamera } from '@babylonjs/core/Cameras/universalCamera';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { eventHandler } from './eventSystem';
import { loadAndMountDevtools } from './utils/handleEnableDevtools';

export const getState = ({
  scene,
  camera,
  Vector3,
}: {
  scene?: Scene;
  camera?: UniversalCamera;
  Vector3?: any;
}): State => {
  let state = getCanvaasEngineState<State>({
    scene,
    camera,
    Vector3,
    StandardMaterial,
    MeshBuilder,
    Texture,
    Color3,
  }) as State;

  const version = '0.0.13';

  addEventHandler(eventHandler);

  // Systems
  state = boxSystem(state);
  state = aiSystem(state);
  state = gameSystem(state);
  state = markerSystem(state);
  state = backgroundSystem(state);
  state = logoSystem(state);

  state = setEntity({ state, entity: humanPlayerEntity });
  state = createComponent<AI, State>({
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

  state = setEntity({ state, entity: gameEntity });
  state = createComponent<Game, State>({
    state,
    data: {
      version,
      page: Page.mainMenu,
      newVersionAvailable: false,
      lastBoxClickTimestamp: 0,
      entity: gameEntity,
      name: name.game,
      moves: 0,
      grid: [],
      round: 0,
      currentPlayer: humanPlayerEntity,
      gameStarted: false,
      playersQueue: [],
      boxRotationQueue: [],
      colorBlindMode: savedData?.colorBlindMode ?? false,
      customLevelSettings: {
        players: savedData?.players ?? playersList().slice(0, 4),
        difficulty: savedData?.difficulty ?? AIDifficulty.medium,
        quickStart: savedData?.quickStart ?? true,
        mapType: savedData?.mapType ?? '',
      },
    },
  });

  if (scene) {
    state = createComponent<Camera, State>({
      state,
      data: {
        entity: cameraEntity,
        name: componentName.camera,
        position: [0, 0],
        distance: 5,
        ...getCameraSize(5, scene),
      },
    });
  }

  state = setEntity({ state, entity: backgroundEntity });
  state = createComponent<Background, State>({
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

  if (process.env.NODE_ENV === 'development') {
    loadAndMountDevtools();
  }

  return state;
};
