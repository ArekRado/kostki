import { boxWithGap } from '../../blueprints/gridBlueprint';
import {
  componentName,
  getComponent,
  getComponentsByName,
  setComponent,
} from '../../ecs/component';
import { AI, Box, EventHandler, Game, State } from '../../ecs/type';
import { emitEvent } from '../../eventSystem';
import { getAiMove } from '../aiSystem/getAiMove';
import { onClickBox } from '../boxSystem/onClickBox';
import { pushBoxToRotationQueue } from '../boxSystem/pushBoxToRotationQueue';
import { GameEvent, getGame } from '../gameSystem';
import { setMarker } from '../markerSystem';
import { getNextPlayer } from './getNextPlayer';

const sumAiBoxes = ({ state, ai }: { state: State; ai: AI }): number => {
  const game = getGame({ state });

  return (
    game?.grid.reduce((acc, boxEntity) => {
      const box = getComponent<Box>({
        state,
        name: componentName.box,
        entity: boxEntity,
      });

      return box?.player === ai.entity ? acc + 1 : acc;
    }, 0) || 0
  );
};

type AiLost = (params: { state: State; ai: AI; component: Game }) => State;
const aiLost: AiLost = ({ state, ai, component }) => {
  state = setComponent<AI>({
    state,
    data: {
      ...ai,
      active: false,
    },
  });

  const allAI = getComponentsByName<AI>({
    state,
    name: componentName.ai,
  });

  const amountOfActivedAi = Object.values(allAI || {}).reduce(
    (acc, ai) => (ai.active ? acc + 1 : acc),
    0
  );

  // last player is active, time to end game
  if (amountOfActivedAi === 1) {
    return setComponent<Game>({
      state,
      data: {
        ...component,
        gameStarted: false,
      },
    });
  } else {
    emitEvent<GameEvent.NextTurnEvent>({
      type: GameEvent.Type.nextTurn,
      payload: { ai },
    });
  }

  return state;
};

export const handleNextTurn: EventHandler<Game, GameEvent.NextTurnEvent> = ({
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

    const ai = getComponent<AI>({
      name: componentName.ai,
      state,
      entity: nextPlayer.entity,
    });

    if (!ai) {
      return state;
    }

    state = setComponent<Game>({
      state,
      data: {
        ...game,
        currentPlayer: ai.entity,
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

  return state;
};
