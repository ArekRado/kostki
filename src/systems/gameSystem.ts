import { createSystem } from '../ecs/createSystem';
import {
  componentName,
  getComponentsByName,
  getComponent,
  setComponent,
  createGetSetForUniqComponent,
} from '../ecs/component';
import {
  AI,
  Box,
  Color,
  Entity,
  EventHandler,
  Game,
  Guid,
  State,
} from '../ecs/type';
import { ECSEvent, emitEvent } from '../ecs/emitEvent';
import { getAiMove } from './aiSystem';
import {
  BoxEvent,
  Direction,
  getNextDots,
  getTextureSet,
  onClickBox,
  pushBoxToRotationQueue,
} from './boxSystem';
import { scene } from '..';
import { Color3, Vector3, StandardMaterial } from 'babylonjs';

import { camera } from '../index';
import { saveState } from '../utils/localDb';
import { customLevelScene } from '../scenes/customLevelScene';
import { setMarker } from './markerSystem';
import { boxWithGap } from '../blueprints/gridBlueprint';

export const gameEntity = 'game';

export namespace GameEvent {
  export enum Type {
    startCustomLevel,
    nextTurn,
    boxExplosion,
    playerClick,
    saveGame,
  }

  export type All = StartCustomLevelEvent | NextTurnEvent | PlayerClickEvent;

  export type StartCustomLevelEvent = ECSEvent<Type.startCustomLevel, {}>;
  export type NextTurnEvent = ECSEvent<Type.nextTurn, { ai: AI }>;
  export type PlayerClickEvent = ECSEvent<
    Type.playerClick,
    { boxEntity: Entity }
  >;
}

const gameGetSet = createGetSetForUniqComponent<Game>({
  entity: gameEntity,
  name: componentName.game,
});

export const getGame = gameGetSet.getComponent;
export const setGame = gameGetSet.setComponent;

type GetCurrentAi = (params: { state: State }) => AI | undefined;
export const getCurrentAi: GetCurrentAi = ({ state }) => {
  const game = getGame({ state });
  const ai = getComponent<AI>({
    state,
    name: componentName.ai,
    entity: game?.currentPlayer || '',
  });

  return ai;
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
      entity: gameEntity,
      payload: { ai },
    });
  }

  return state;
};

type GetNextActivePlayer = (params: {
  playersQueue: Guid[];
  index: number;
  state: State;
}) => AI | undefined;
const getNextActivePlayer: GetNextActivePlayer = ({
  playersQueue,
  index,
  state,
}) => {
  const ai = getComponent<AI>({
    state,
    name: componentName.ai,
    entity: playersQueue[index],
  });

  if (ai?.active) {
    return ai;
  }

  return getNextActivePlayer({
    playersQueue,
    index: index >= playersQueue.length ? 0 : index + 1,
    state,
  });
};

type GetNextPlayer = (params: { state: State }) => AI | undefined;
const getNextPlayer: GetNextPlayer = ({ state }) => {
  const game = getGame({ state });

  if (!game) {
    return undefined;
  }

  const currentPlayerIndex = game.playersQueue.findIndex((entity) => {
    return game.currentPlayer === entity;
  });

  const nextAi = getNextActivePlayer({
    playersQueue: game.playersQueue,
    index: currentPlayerIndex + 1,
    state,
  });

  return nextAi;
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
  const newState = getGame({ state })?.grid.reduce((acc) => {
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
  }, state);

  return newState || state;
};

const handleStartCustomLevel: EventHandler<
  Game,
  GameEvent.StartCustomLevelEvent
> = ({ state, component }) => {
  state = customLevelScene({ state, scene, camera });

  const currentAi = getComponent<AI>({
    name: componentName.ai,
    state,
    entity: component?.currentPlayer || '',
  });

  const game = getGame({ state });

  if (!currentAi || !game) {
    return state;
  }

  state = setComponent<Game>({
    state,
    data: {
      ...game,
      gameStarted: true,
      currentPlayer: currentAi.entity,
    },
  });

  if (game.quickStart) {
    state = runQuickStart({ state });
    updateAllBoxes({ state });
  }

  // TODO do not repeat same code as above
  state = setComponent<Game>({
    state,
    data: {
      ...game,
      gameStarted: true,
      currentPlayer: currentAi.entity,
    },
  });

  if (!currentAi.human) {
    const box = getAiMove({ state, ai: currentAi });

    if (box) {
      state = onClickBox({ box, state, ai: currentAi });
    }
  }

  return state;
};

const handleNextTurn: EventHandler<Game, GameEvent.NextTurnEvent> = ({
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

  return state;
};

const handlePlayerClick: EventHandler<Game, GameEvent.PlayerClickEvent> = ({
  state,
  component,
  event,
}) => {
  const { currentPlayer, gameStarted, boxRotationQueue } = component;

  const box = getComponent<Box>({
    state,
    name: componentName.box,
    entity: event.payload.boxEntity,
  });

  const canClickOnBox =
    box?.player === undefined || box?.player === currentPlayer;

  if (gameStarted && boxRotationQueue.length === 0 && canClickOnBox) {
    const ai = getComponent<AI>({
      name: componentName.ai,
      state,
      entity: currentPlayer,
    });

    if (box && ai?.human) {
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
    }
  }

  return state;
};

export const gameSystem = (state: State) =>
  createSystem<Game, GameEvent.All>({
    state,
    name: componentName.game,
    create: ({ state, component }) => {
      component.boxRotationQueue.forEach((boxEntity) => {
        const box = getComponent<Box>({
          state,
          name: componentName.box,
          entity: boxEntity,
        });

        const ai = getComponent<AI>({
          state,
          name: componentName.ai,
          entity: box?.player || '',
        });

        ai &&
          box &&
          emitEvent<BoxEvent.RotationEndEvent>({
            type: BoxEvent.Type.rotationEnd,
            entity: boxEntity,
            payload: { ai, shouldExplode: box.dots === 6 },
          });
      });

      return state;
    },
    event: ({ state, component, event }) => {
      switch (event.type) {
        case GameEvent.Type.startCustomLevel:
          return handleStartCustomLevel({ state, component, event });
        case GameEvent.Type.nextTurn:
          return handleNextTurn({ state, component, event });
        case GameEvent.Type.playerClick:
          return handlePlayerClick({ state, component, event });
      }
    },
  });
