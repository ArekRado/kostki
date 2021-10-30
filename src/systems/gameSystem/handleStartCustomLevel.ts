import { componentName, getComponent, setComponent } from '../../ecs/component';
import { emitEvent } from '../../ecs/emitEvent';
import {
  AI,
  Box,
  EventHandler,
  Game,
  State,
  Scene as GameScene,
  TurnIndicator,
} from '../../ecs/type';
import {
  BoxEvent,
  Direction,
  getNextDots,
  getTextureSet,
  onClickBox,
} from '../boxSystem';
import { GameEvent, getGame, setGame } from '../gameSystem';
import { generateId } from '../../utils/generateId';
import { aiBlueprint } from '../../blueprints/aiBlueprint';
import { getGridDimensions } from '../../blueprints/gridBlueprint';
import { setCamera } from '../cameraSystem';
import { setUi } from '../uiSystem';
import { logWrongPath } from '../../utils/logWrongPath';
import { getDataGrid } from '../aiSystem/getDataGrid';
import { turnIndicatorEntity } from '../turnIndicatorSystem';
import { getNextPlayer } from './getNextPlayer';
import { getAiMove } from '../aiSystem/getAiMove';

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

  state = setUi({
    state,
    data: {
      type: GameScene.customLevel,
    },
    cleanControls: true,
  });

  return state;
};

type UpdateAllBoxes = (params: { state: State }) => void;
const updateAllBoxes: UpdateAllBoxes = ({ state }) => {
  const game = getGame({ state });
  if (!game) {
    return undefined;
  }
  game.grid.forEach((boxEntity) => {
    const box = getComponent<Box>({
      state,
      entity: boxEntity,
      name: componentName.box,
    });

    const ai = getComponent<AI>({
      state,
      entity: box?.player || '',
      name: componentName.ai,
    });

    if (box && ai) {
      emitEvent<BoxEvent.Rotate>({
        type: BoxEvent.Type.rotate,
        entity: boxEntity,
        payload: {
          color: ai.color,
          texture: getTextureSet({ state, ai })[box.dots],
          direction: Direction.up,
        },
      });
    }
  });

  return state;
};

type RunQuickStart = (params: { state: State }) => State;
const runQuickStart: RunQuickStart = ({ state }) => {
  // Run same amount of moves as boxes in a grid
  const movesAmout = getGame({ state })?.grid.length || 1;
  const newState = Array.from({ length: movesAmout * 2 }).reduce(
    (acc: State) => {
      const game = getGame({ state: acc });

      const currentAi = getComponent<AI>({
        state: acc,
        name: componentName.ai,
        entity: game?.currentPlayer || '',
      });

      if (!game || !currentAi) {
        return logWrongPath(acc);
      }

      const box = getAiMove({
        state: acc,
        ai: currentAi,
        preferEmptyBoxes: true,
      });

      if (!box) {
        return logWrongPath(acc);
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

      if (!nextPlayer) {
        return acc;
      }

      acc = setComponent<Game>({
        state: acc,
        data: {
          ...game,
          currentPlayer: nextPlayer.entity,
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
> = ({ state, component }) => {
  state = setLevelFromSettings({ state, game: component });

  const currentAi = getNextPlayer({ state });

  if (!currentAi) {
    return logWrongPath(state);
  }

  state = setGame({
    state,
    data: {
      currentPlayer: currentAi.entity,
    },
  });

  const game = getGame({ state });

  if (!game) {
    return logWrongPath(state);
  }

  if (game.customLevelSettings.quickStart) {
    state = runQuickStart({ state });
    updateAllBoxes({ state });
  }

  state = setGame({
    state,
    data: {
      gameStarted: true,
    },
  });

  if (!currentAi.human) {
    const box = getAiMove({ state, ai: currentAi });

    if (box) {
      state = onClickBox({ box, state, ai: currentAi });
    }
  }

  state = setComponent<TurnIndicator>({
    state,
    data: {
      entity: turnIndicatorEntity,
      name: componentName.turnIndicator,
      position: [0, 0],
      boxes: [],
      texts: [],
      isVisible: true,
    },
  });

  return state;
};
