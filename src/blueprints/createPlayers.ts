import {
  componentName,
  removeAllComponents,
  setComponent,
} from '../ecs/component';
import { AI, Game, State } from '../ecs/type';
import { getGame } from '../systems/gameSystem';

type CreatePlayers = (params: { state: State; ai: AI[] }) => State;
export const createPlayers: CreatePlayers = ({ state, ai }) => {
  state = removeAllComponents<AI>({ state, name: componentName.ai });

  const game = getGame({ state });

  if (game) {
    state = setComponent<Game>({
      state,
      data: {
        ...game,
        playersQueue: ai.map(({ entity }) => entity),
      },
    });
  }

  return ai.reduce((acc, newAi) => {
    return setComponent<AI>({ state: acc, data: newAi });
  }, state);
};
