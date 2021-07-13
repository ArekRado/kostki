import { setComponent, componentName } from '../ecs/component';
import { initialState } from '../ecs/state';
import { AI, Game } from '../ecs/type';
import { gameEntity } from '../systems/gameSystem';

export const humanPlayerEntity = 'humanPlayer';

export const getGameInitialState = () => {
  let state = setComponent<AI>({
    state: initialState,
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
      entity: gameEntity,
      name: componentName.game,
      grid: [],
      round: 0,
      currentPlayer: humanPlayerEntity,
      gameStarted: false,
      playersQueue: [],
      boxRotationQueue: [],
    },
  });

  return state;
};
