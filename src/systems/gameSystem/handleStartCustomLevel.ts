import { AI, Box, Game, State, Marker, Page, name } from '../../type';
import {
  GameEvent,
  getGame,
  setGame,
  shakeAnimationTimeout,
} from '../gameSystem';
import { generateId } from '../../utils/generateId';
import { aiBlueprint } from '../../blueprints/aiBlueprint';
import { getGridDimensions } from '../../blueprints/gridBlueprint';
import { getNextPlayer } from './getNextPlayer';
import { getAiMove } from '../aiSystem/getAiMove';
import { getNextDots, onClickBox } from '../boxSystem/onClickBox';
import { markerEntity } from '../markerSystem';
import { eventBusDispatch } from '../../utils/eventBus';
import { playLevelStartAnimation } from './playLevelStartAnimation';
import { emitEvent } from '../../eventSystem';
import {
  EventHandler,
  getComponent,
  setComponent,
} from '@arekrado/canvas-engine';
import { setCamera } from '../../wrappers/setCamera';

type setLevelFromSettings = (params: { state: State; game: Game }) => State;
export const setLevelFromSettings: setLevelFromSettings = ({ state, game }) => {
  state = Array.from({ length: 8 }).reduce(
    (acc: State, _, x) =>
      Array.from({ length: 8 }).reduce((acc2: State, _, y) => {
        const entity = generateId().toString();
        acc2 = setComponent<Box, State>({
          state: acc2,
          data: {
            name: name.box,
            entity,
            isAnimating: false,
            dots: 0,
            gridPosition: [y, x],
            player: undefined,
          },
        });

        const game = getGame({ state: acc2 });

        if (!game) {
          return acc2;
        }

        return setGame({
          state: acc2,
          data: {
            ...game,
            grid: [...game.grid, entity],
          },
        });
      }, acc),
    state
  );

  state = aiBlueprint({
    state,
    ai: game.customLevelSettings.players.map((ai) => ({
      ...ai,
      level: game.customLevelSettings.difficulty,
    })),
  });

  const { center, cameraDistance } = getGridDimensions({ state });

  state = setCamera({
    state,
    data: {
      position: [center[0], center[1]],
      distance: cameraDistance,
    },
  }) as State;

  return state;
};

type RunQuickStart = (params: { state: State }) => State;
const runQuickStart: RunQuickStart = ({ state }) => {
  const game = getGame({ state });
  const gridLength = game?.grid.length || 1;
  const playersLength = game?.customLevelSettings.players.length || 1;
  // Run same amount of moves as boxes in a grid
  const movesAmout = gridLength - (gridLength % playersLength);

  const newState = Array.from({ length: movesAmout * 2 }).reduce(
    (acc: State) => {
      const game = getGame({ state: acc });

      const currentAi = getComponent<AI>({
        state: acc,
        name: name.ai,
        entity: game?.currentPlayer || '',
      });

      if (!game || !currentAi) {
        return acc;
      }

      const box = getAiMove({
        state: acc,
        ai: currentAi,
        preferEmptyBoxes: true,
      });

      if (!box) {
        return acc;
      }

      acc = setComponent<Box, State>({
        state: acc,
        data: {
          ...box,
          player: currentAi.entity,
          dots: getNextDots(box.dots),
        },
      });

      const nextPlayer = getNextPlayer({ state: acc });

      acc = setComponent<Game, State>({
        state: acc,
        data: {
          ...game,
          currentPlayer: nextPlayer?.entity || '',
        },
      });

      return acc;
    },
    state
  );

  return newState || state;
};

export const handleStartCustomLevel: EventHandler<
  GameEvent.StartCustomLevelEvent,
  State
> = ({ state }) => {
  const component = getGame({ state });
  if (!component) {
    return state;
  }

  state = setLevelFromSettings({ state, game: component });

  state = setGame({
    state,
    data: {
      currentPlayer: getNextPlayer({ state })?.entity,
    },
  }) as State;

  const game = getGame({ state });

  if (game?.customLevelSettings.quickStart) {
    state = runQuickStart({ state });
  }

  playLevelStartAnimation({ state });

  state = setGame({
    state,
    data: {
      gameStarted: true,
      page: Page.customLevel,
    },
  }) as State;

  const currentAi = getComponent<AI>({
    state,
    name: name.ai,
    entity: getGame({ state })?.currentPlayer || '',
  });

  if (currentAi && !currentAi.human) {
    const box = getAiMove({ state, ai: currentAi });

    if (box) {
      state = onClickBox({ box, state, ai: currentAi });
    }
  }

  state = setComponent<Marker, State>({
    state,
    data: {
      entity: markerEntity,
      name: name.marker,
      color: [1, 1, 1],
      position: [0, 0],
    },
  });

  eventBusDispatch('setUIState', state);

  if (currentAi) {
    setTimeout(() => {
      emitEvent<GameEvent.ShakeAiBoxesEvent>({
        type: GameEvent.Type.shakeAiBoxes,
        payload: {
          moves: getGame({ state })?.moves || 0,
          ai: currentAi,
        },
      });
    }, shakeAnimationTimeout);
  }

  return state;
};
