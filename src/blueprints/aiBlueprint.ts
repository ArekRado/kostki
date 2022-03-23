import { AI, Game, name, State } from '../type';
import { getGame } from '../systems/gameSystem';
import {
  createComponent,
  setEntity,
} from '@arekrado/canvas-engine';
import { removeEntitiesByComponentName } from '../systems/gameSystem/handleCleanScene';

type AiBlueprint = (params: { state: State; ai: AI[] }) => State;
export const aiBlueprint: AiBlueprint = ({ state, ai }) => {
  state = removeEntitiesByComponentName({ state, name: name.ai });

  const game = getGame({ state });

  if (game) {
    state = createComponent<Game, State>({
      state,
      data: {
        ...game,
        playersQueue: ai.map(({ entity }) => entity),
      },
    });
  }

  return ai.reduce((acc, newAi) => {
    acc = setEntity({ state: acc, entity: newAi.entity });
    return createComponent<AI, State>({ state: acc, data: newAi });
  }, state);
};
