import { createSystem } from '../ecs/createSystem';
import {
  componentName,
  getAllComponents,
  getComponent,
  setComponent,
} from '../ecs/component';
import { AI, Box, Entity, EventHandler, Game, State } from '../ecs/type';
import { ECSEvent, emitEvent } from '../ecs/emitEvent';
import { getAiMove, getDataGrid, safeGet } from './aiSystem';
import {
  BoxEvent,
  Direction,
  getNextDots,
  pushBoxToRotationQueue,
} from './boxSystem';
import { DirectionalLight } from 'babylonjs/Lights/directionalLight';

export const gameEntity = 'game';

export namespace GameEvent {
  export enum Type {
    startLevel,
    nextTurn,
    boxExplosion,
    playerClick,
  }

  export type All =
    | StartLevelEvent
    | NextTurnEvent
    | BoxExplosionEvent
    | PlayerClickEvent;

  export type StartLevelEvent = ECSEvent<Type.startLevel, {}>;
  export type NextTurnEvent = ECSEvent<Type.nextTurn, { ai: AI }>;
  export type BoxExplosionEvent = ECSEvent<
    Type.boxExplosion,
    { ai: AI; box: Box }
  >;
  export type PlayerClickEvent = ECSEvent<
    Type.playerClick,
    { boxEntity: Entity }
  >;
}

type GetGame = (params: { state: State }) => Game | undefined;
export const getGame: GetGame = ({ state }) => {
  return getComponent<Game>({
    state,
    entity: gameEntity,
    name: componentName.game,
  });
};

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

const getRandomAi = ({ state }: { state: State }): AI => {
  const allAi = getAllComponents<AI>({ name: componentName.ai, state }) || {};
  const aiList = Object.values(allAi);
  const randomIndex = Math.floor(Math.random() * aiList.length);
  return aiList[randomIndex];
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

  const allAI = getAllComponents<AI>({
    state,
    name: componentName.ai,
  });

  const amountOfActivedAi = Object.values(allAI || {}).reduce(
    (acc, ai) => (ai.active ? acc + 1 : acc),
    0
  );

  // last player is active, time to end game
  if (amountOfActivedAi === 1) {
    console.log('game end', { amountOfActivedAi, allAI });
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

type GetNextPlayer = (params: { state: State }) => AI | undefined;
const getNextPlayer: GetNextPlayer = ({ state }) => {
  const game = getGame({ state });

  if (!game) {
    return undefined;
  }

  const nextPlayerIndex = game.playersQueue.findIndex((entity) => {
    const ai = getComponent<AI>({
      state,
      name: componentName.ai,
      entity,
    });

    return game.currentPlayer === entity && ai?.active;
  });

  const nextPlayerEntity =
    game.playersQueue[nextPlayerIndex + 1] || game.playersQueue[0];

  return getComponent<AI>({
    state,
    name: componentName.ai,
    entity: nextPlayerEntity,
  });
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
          texture: ai.textureSet[box.dots],
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

    const box = getAiMove({ state: acc, ai: currentAi });

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

const handleStartLevel: EventHandler<Game, GameEvent.StartLevelEvent> = ({
  state,
  component,
}) => {
  const { currentPlayer, grid, quickStart } = component;

  const currentAi = getComponent<AI>({
    name: componentName.ai,
    state,
    entity: currentPlayer,
  });

  const ai = currentAi ? currentAi : getRandomAi({ state });

  state = setComponent<Game>({
    state,
    data: {
      ...component,
      gameStarted: true,
      currentPlayer: ai.entity,
    },
  });

  if (quickStart) {
    state = runQuickStart({ state });
    updateAllBoxes({ state });
  }

  if (!ai?.human) {
    const box = getAiMove({ state, ai });

    box &&
      emitEvent<BoxEvent.OnClickEvent>({
        type: BoxEvent.Type.onClick,
        entity: box.entity,
        payload: {
          ai,
        },
      });
  }

  return state;
};

const handleBoxExplosion: EventHandler<Game, GameEvent.BoxExplosionEvent> = ({
  state,
  component,
  event,
}) => {
  const { ai, box } = event.payload;
  const {
    gridPosition: [x, y],
  } = box;

  const dataGrid = getDataGrid({ state });

  state = [
    safeGet(dataGrid, y, x - 1),
    safeGet(dataGrid, y, x + 1),
    safeGet(dataGrid, y - 1, x),
    safeGet(dataGrid, y + 1, x),
  ]
    .filter((box) => box !== undefined)
    .reduce((acc, box, i) => {
      emitEvent({
        type: BoxEvent.Type.onClick,
        entity: box.entity,
        payload: {
          ai,
        },
      });

      return pushBoxToRotationQueue({ entity: box.entity, state: acc });
    }, state);

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

    if (!ai.human) {
      const box = getAiMove({ state, ai });

      if (box) {
        emitEvent<BoxEvent.OnClickEvent>({
          type: BoxEvent.Type.onClick,
          entity: box.entity,
          payload: { ai },
        });
      } else {
        // AI can't move which means it lost
        return aiLost({ state, component, ai });
      }
    }
  }

  return state;
};

const handlePlayerClick: EventHandler<Game, GameEvent.PlayerClickEvent> = ({
  state,
  component,
  event,
}) => {
  const { currentPlayer, gameStarted, boxRotationQueue } = component;

  if (gameStarted && boxRotationQueue.length === 0) {
    const ai = getComponent<AI>({
      name: componentName.ai,
      state,
      entity: currentPlayer,
    });

    if (ai?.human) {
      emitEvent<BoxEvent.OnClickEvent>({
        type: BoxEvent.Type.onClick,
        entity: event.payload.boxEntity,
        payload: { ai },
      });
    }
  }

  return state;
};

export const gameSystem = (state: State) =>
  createSystem<Game, GameEvent.All>({
    state,
    name: componentName.game,
    event: ({ state, component, event }) => {
      switch (event.type) {
        case GameEvent.Type.startLevel:
          return handleStartLevel({ state, component, event });
        case GameEvent.Type.boxExplosion:
          return handleBoxExplosion({ state, component, event });
        case GameEvent.Type.nextTurn:
          return handleNextTurn({ state, component, event });
        case GameEvent.Type.playerClick:
          return handlePlayerClick({ state, component, event });
      }
    },
  });
