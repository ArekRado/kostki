import {
  componentName,
  removeAllComponents,
  setComponent,
} from '../ecs/component';
import { AI, Game, State } from '../ecs/type';
import { getGame } from '../systems/gameSystem';

type AiBlueprint = (params: { state: State; ai: AI[] }) => State;
export const aiBlueprint: AiBlueprint = ({ state, ai }) => {
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
