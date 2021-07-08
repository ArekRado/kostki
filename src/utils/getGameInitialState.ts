import { setComponent, componentName } from '../ecs/component';
import { initialState } from '../ecs/state';
import { Game } from '../ecs/type';

export const getGameInitialState = () => {
  const state = setComponent<Game>({
    state: initialState,
    data: {
      entity: 'game',
      name: componentName.game,
      grid: [],
      round: 0,
    },
  });

  return state;
};
