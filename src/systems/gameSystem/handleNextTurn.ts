import { boxWithGap } from '../../blueprints/gridBlueprint';
import { AI, Box, Game, name, State } from '../../type';
import { emitEvent } from '../../eventSystem';
import { eventBusDispatch } from '../../utils/eventBus';
import { getAiMove } from '../aiSystem/getAiMove';
import { onClickBox } from '../boxSystem/onClickBox';
import { pushBoxToRotationQueue } from '../boxSystem/pushBoxToRotationQueue';
import { GameEvent, getGame } from '../gameSystem';
import { setMarker } from '../markerSystem';
import { getNextPlayer } from './getNextPlayer';
import {
  EventHandler,
  getComponent,
  getComponentsByName,
  setComponent,
} from '@arekrado/canvas-engine';

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
  state = setComponent<AI, State>({
    state,
    data: {
      ...ai,
      active: false,
    },
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
    state = setComponent<Game, State>({
      state,
      data: {
        ...component,
        gameStarted: false,
      },
    });

    eventBusDispatch('setUIState', state);

    return state;
  } else {
    emitEvent<GameEvent.NextTurnEvent>({
      type: GameEvent.Type.nextTurn,
      payload: {},
    });
  }

  return state;
};

export const handleNextTurn: EventHandler<GameEvent.NextTurnEvent, State> = ({
  state,
}) => {
  const game = getGame({ state });
  if (!game) {
    return state;
  }
  const { gameStarted, boxRotationQueue } = game;

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

    state = setComponent<Game, State>({
      state,
      data: {
        ...game,
        currentPlayer: ai.entity,
        moves: game.moves + 1,
      },
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
