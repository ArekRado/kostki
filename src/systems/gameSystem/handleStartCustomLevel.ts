import { componentName, getComponent, setComponent } from '../../ecs/component';
import {
  AI,
  Box,
  EventHandler,
  Game,
  State,
  Marker,
  Page,
} from '../../ecs/type';
import {
  GameEvent,
  getGame,
  setGame,
  shakeAnimationTimeout,
} from '../gameSystem';
import { generateId } from '../../utils/generateId';
import { aiBlueprint } from '../../blueprints/aiBlueprint';
import { getGridDimensions } from '../../blueprints/gridBlueprint';
import { setCamera } from '../cameraSystem';
import { getNextPlayer } from './getNextPlayer';
import { getAiMove } from '../aiSystem/getAiMove';
import { getNextDots, onClickBox } from '../boxSystem/onClickBox';
import { markerEntity } from '../markerSystem';
import { eventBusDispatch } from '../../utils/eventBus';
import { playLevelStartAnimation } from './playLevelStartAnimation';
import { emitEvent } from '../../eventSystem';

type setLevelFromSettings = (params: { state: State; game: Game }) => State;
export const setLevelFromSettings: setLevelFromSettings = ({ state, game }) => {
  state = Array.from({ length: 8 }).reduce(
    (acc: State, _, x) =>
      Array.from({ length: 8 }).reduce(
        (acc2: State, _, y) =>
          setComponent<Box>({
            state: acc2,
            data: {
              name: componentName.box,
              entity: generateId().toString(),
              isAnimating: false,
              dots: 0,
              gridPosition: [y, x],
              player: undefined,
            },
          }),
        acc
      ),
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
  });

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
        name: componentName.ai,
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

      acc = setComponent<Box>({
        state: acc,
        data: {
          ...box,
          player: currentAi.entity,
          dots: getNextDots(box.dots),
        },
      });

      const nextPlayer = getNextPlayer({ state: acc });

      acc = setComponent<Game>({
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
  Game,
  GameEvent.StartCustomLevelEvent
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
  });

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
  });

  const currentAi = getComponent<AI>({
    state,
    name: componentName.ai,
    entity: getGame({ state })?.currentPlayer || '',
  });

  if (currentAi && !currentAi.human) {
    const box = getAiMove({ state, ai: currentAi });

    if (box) {
      state = onClickBox({ box, state, ai: currentAi });
    }
  }

  state = setComponent<Marker>({
    state,
    data: {
      entity: markerEntity,
      name: componentName.marker,
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
