import { humanPlayerEntity } from '..';
import { setComponent, componentName } from '../ecs/component';
import { initialState } from '../ecs/state';
import { AI, Game, Scene, State } from '../ecs/type';
import { aiSystem } from '../systems/aiSystem';
import { boxSystem } from '../systems/boxSystem';
import { gameEntity, gameSystem } from '../systems/gameSystem';
import { getSavedState } from './localDb';

type GetGameInitialState = () => State;
export const getGameInitialState: GetGameInitialState = () => {
  let state = initialState;

  // Systems
  state = boxSystem(state);
  state = aiSystem(state);
  state = gameSystem(state);

  const savedState = getSavedState();

  if (savedState) {
    state = {
      ...state,
      entity: savedState.entity,
      component: savedState.component,
    };
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
        markerEntity: '',
        customLevelSettings: {
          ai: [],
          levelSize: 0,
        },
        musicEnabled: false,
      },
    });
  }

  return state;
};
