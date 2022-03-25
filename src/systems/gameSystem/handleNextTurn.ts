import { boxWithGap } from '../../blueprints/gridBlueprint';
import { AI, Box, Game, name, State } from '../../type';
import { eventBusDispatch } from '../../utils/eventBus';
import { getAiMove } from '../aiSystem/getAiMove';
import { onClickBox } from '../boxSystem/onClickBox';
import { pushBoxToRotationQueue } from '../boxSystem/pushBoxToRotationQueue';
import { gameEntity, getGame } from '../gameSystem';
import { setMarker } from '../markerSystem';
import { getNextPlayer } from './getNextPlayer';
import {
  getComponent,
  getComponentsByName,
  updateComponent,
} from '@arekrado/canvas-engine';
import { getTime } from '@arekrado/canvas-engine/system/time';

const sumAiBoxes = ({ state, ai }: { state: State; ai: AI }): number => {
  const game = getGame({ state });

  return (
    game?.grid.reduce((acc, boxEntity) => {
      const box = getComponent<Box, State>({
        state,
        name: name.box,
        entity: boxEntity,
      });

      return box?.player === ai.entity ? acc + 1 : acc;
    }, 0) || 0
  );
};

type AiLost = (params: { state: State; ai: AI; component: Game }) => State;
const aiLost: AiLost = ({ state, ai, component }) => {
  state = updateComponent<AI, State>({
    state,
    name: name.ai,
    entity: ai.entity,
    update: () => ({
      active: false,
    }),
  });

  const allAI = getComponentsByName<AI, State>({
    state,
    name: name.ai,
  });

  const amountOfActivedAi = Object.values(allAI || {}).reduce(
    (acc, ai) => (ai.active ? acc + 1 : acc),
    0
  );

  // last player is active, time to end game
  if (amountOfActivedAi === 1) {
    state = updateComponent<Game, State>({
      state,
      name: name.game,
      entity: gameEntity,
      update: () => ({
        gameStarted: false,
      }),
    });

    eventBusDispatch('setUIState', state);

    return state;
  } else {
    state = startNextTurn({
      state,
    });
  }

  return state;
};

export const startNextTurn = ({ state }: { state: State }) => {
  const game = getGame({ state });
  if (!game) {
    return state;
  }
  const { gameStarted, boxRotationQueue } = game;

  state = updateComponent<Game, State>({
    state,
    name: name.game,
    entity: gameEntity,
    update: () => ({ lastBoxClickTimestamp: getTime({ state })?.timeNow || 0 }),
  });

  if (gameStarted && boxRotationQueue.length === 0) {
    const nextPlayer = getNextPlayer({ state });

    if (!nextPlayer) {
      return state;
    }

    const ai = getComponent<AI, State>({
      name: name.ai,
      state,
      entity: nextPlayer.entity,
    });

    if (!ai) {
      return state;
    }

    state = updateComponent<Game, State>({
      state,
      name: name.game,
      entity: gameEntity,
      update: (game) => ({
        currentPlayer: ai.entity,
        moves: game.moves + 1,
      }),
    });

    if (ai.active) {
      if (ai.human) {
        const humanBoxes = sumAiBoxes({ state, ai });
        if (humanBoxes === 0) {
          state = aiLost({ state, component: game, ai });
        }
      } else {
        const box = getAiMove({ state, ai });

        if (box) {
          state = setMarker({
            state,
            data: {
              color: ai.color,
              position: [
                box.gridPosition[0] * boxWithGap,
                box.gridPosition[1] * boxWithGap,
              ],
            },
          });
          state = onClickBox({ box, state, ai });
          state = pushBoxToRotationQueue({ state, entity: box.entity });
        } else {
          // AI can't move which means it lost
          state = aiLost({ state, component: game, ai });
        }
      }
    }
  }

  eventBusDispatch('setUIState', state);

  return state;
};
