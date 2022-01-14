
import { AI, Game, name, State } from '../type';
import { getGame } from '../systems/gameSystem';
import { removeComponentsByName, setComponent } from '@arekrado/canvas-engine';

type AiBlueprint = (params: { state: State; ai: AI[] }) => State;
export const aiBlueprint: AiBlueprint = ({ state, ai }) => {
  state = removeComponentsByName<AI, State>({ state, name: name.ai });

  const game = getGame({ state });

  if (game) {
    state = setComponent<Game, State>({
      state,
      data: {
        ...game,
        playersQueue: ai.map(({ entity }) => entity),
      },
    });
  }

  return ai.reduce((acc, newAi) => {
    return setComponent<AI, State>({ state: acc, data: newAi });
  }, state);
};
