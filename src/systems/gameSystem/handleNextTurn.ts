import { boxWithGap } from '../../blueprints/gridBlueprint';
import { componentName, getComponent, getComponentsByName, setComponent } from '../../ecs/component';
import { emitEvent } from '../../ecs/emitEvent';
import { AI, EventHandler, Game, State } from '../../ecs/type';
import { removeState, saveState } from '../../utils/localDb';
import { getAiMove } from '../aiSystem/getAiMove';
import { onClickBox } from '../boxSystem/onClickBox';
import { pushBoxToRotationQueue } from '../boxSystem/pushBoxToRotationQueue';
import { gameEntity, GameEvent } from '../gameSystem';
import { setMarker } from '../markerSystem';
import { moveHighlighter } from '../turnIndicatorSystem/moveHighlighter';
import { getNextPlayer } from './getNextPlayer';

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
    removeState();

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
      entity: gameEntity,
      payload: { ai },
    });
  }

  return state;
};

export const handleNextTurn: EventHandler<Game, GameEvent.NextTurnEvent> = ({
  state,
  component,
}) => {
  const { gameStarted, boxRotationQueue } = component;

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
        ...component,
        currentPlayer: ai.entity,
      },
    });

    if (!ai.human && ai.active) {
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
        return aiLost({ state, component, ai });
      }
    }
  }

  saveState(state);
  moveHighlighter({ state });

  return state;
};
