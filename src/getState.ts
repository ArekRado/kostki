import { humanPlayerEntity } from '.';
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
import { AI, Background, Game, name, Page, State } from './type';
import {
  Camera,
  componentName,
  getState as getCanvaasEngineState,
  setComponent,
} from '@arekrado/canvas-engine';
import { cameraEntity } from '@arekrado/canvas-engine/dist/system/camera';
import { getCameraSize } from './systems/cameraSystem/getCameraSize';
import { Scene } from '@babylonjs/core/scene';
import { UniversalCamera } from '@babylonjs/core/Cameras/universalCamera';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { Color3 } from '@babylonjs/core/Maths/math.color';

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

  const version = '0.0.8';

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

  if (scene) {
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
  }

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