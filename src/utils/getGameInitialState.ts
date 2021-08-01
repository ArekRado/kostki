import { humanPlayerEntity, scene } from '..';
import {
  setComponent,
  componentName,
  recreateAllComponents,
  getComponent,
} from '../ecs/component';
import { initialState } from '../ecs/state';
import { AI, Camera, Game, Marker, Scene, State } from '../ecs/type';
import { mainMenuScene } from '../scenes/mainMenuScene';
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
import { getSavedState } from './localDb';
import { emitEvent } from '../ecs/emitEvent';

type GetGameInitialState = () => State;
export const getGameInitialState: GetGameInitialState = () => {
  let state = initialState;

  // Systems
  state = boxSystem(state);
  state = aiSystem(state);
  state = gameSystem(state);
  state = markerSystem(state);
  state = cameraSystem(state);

  const savedState = getSavedState();

  if (savedState) {
    state = {
      ...state,
      entity: savedState.entity,
      component: savedState.component,
    };

    state = recreateAllComponents({ state });
  } else {
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
        currentScene: Scene.mainMenu,
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

    state = mainMenuScene({ scene, state });
  }

  return state;
};
