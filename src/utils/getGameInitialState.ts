import { humanPlayerEntity, scene } from '..';
import {
  setComponent,
  componentName,
  recreateAllComponents,
  getComponent,
} from '../ecs/component';
import { initialState } from '../ecs/state';
import { AI, Camera, Game, Marker, Scene, State, UI } from '../ecs/type';
import { aiSystem } from '../systems/aiSystem';
import { BoxEvent, boxSystem } from '../systems/boxSystem';
import {
  gameEntity,
  GameEvent,
  gameSystem,
  getGame,
} from '../systems/gameSystem';
import { markerEntity, markerSystem } from '../systems/markerSystem';
import { cameraEntity, cameraSystem } from '../systems/cameraSystem';
import { getSavedState, removeState } from './localDb';
import { uiEntity, uiSystem } from '../systems/uiSystem';
import { uiButtonSystem } from '../systems/uiButtonSystem';
import { uiImageSystem } from '../systems/uiImageSystem';

type GetGameInitialState = () => State;
export const getGameInitialState: GetGameInitialState = () => {
  let state = initialState;

  const version = '0.0.0';

  // Systems
  state = boxSystem(state);
  state = aiSystem(state);
  state = gameSystem(state);
  state = markerSystem(state);
  state = cameraSystem(state);
  state = uiSystem(state);
  state = uiButtonSystem(state);
  state = uiImageSystem(state);

  const savedState = getSavedState();
  const savedStateVersion = getGame({
    state: savedState || initialState,
  })?.version;

  if (savedState && savedStateVersion === version) {
    state = {
      ...state,
      entity: savedState.entity,
      component: savedState.component,
    };

    state = recreateAllComponents({ state });
  } else {
    removeState();

    state = setComponent<AI>({
      state,
      data: {
        entity: humanPlayerEntity,
        name: componentName.ai,
        human: true,
        level: 0,
        color: [0, 0, 1],
        textureSet: ['', '', '', '', '', '', ''],
        active: true,
      },
    });

    state = setComponent<Game>({
      state,
      data: {
        version,
        entity: gameEntity,
        name: componentName.game,
        grid: [],
        round: 0,
        currentPlayer: humanPlayerEntity,
        gameStarted: false,
        playersQueue: [],
        boxRotationQueue: [],
        quickStart: true,
        colorBlindMode: false,
        customLevelSettings: {
          ai: [],
          levelSize: 0,
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
      },
    });

    state = setComponent<Camera>({
      state,
      data: {
        entity: cameraEntity,
        name: componentName.camera,
        position: [0, 0],
        distance: 0,
      },
    });

    state = setComponent<Marker>({
      state,
      data: {
        entity: markerEntity,
        name: componentName.marker,
        color: [1, 1, 1],
        position: [0, 0],
      },
    });
  }

  return state;
};
