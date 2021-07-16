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
import { BoxEvent, pushBoxToRotationQueue } from './boxSystem';

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

const handleStartLevel: EventHandler<Game, GameEvent.StartLevelEvent> = ({
  state,
  component,
}) => {
  const { currentPlayer } = component;

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

  const box = getAiMove({ state, ai });

  box &&
    emitEvent({
      type: BoxEvent.Type.onClick,
      entity: box.entity,
      payload: {
        ai,
      },
    });

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
    safeGet(dataGrid, x - 1, y),
    safeGet(dataGrid, x + 1, y),
    safeGet(dataGrid, x, y - 1),
    safeGet(dataGrid, x, y + 1),
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
  const { currentPlayer, gameStarted, boxRotationQueue } = component;

  if (gameStarted && boxRotationQueue.length === 0) {
    const nextPlayerIndex = component.playersQueue.findIndex((entity) => {
      const ai = getComponent<AI>({
        state,
        name: componentName.ai,
        entity,
      });

      return currentPlayer === entity && ai?.active;
    });

    const nextPlayer =
      component.playersQueue[nextPlayerIndex + 1] || component.playersQueue[0];

    const ai = getComponent<AI>({
      name: componentName.ai,
      state,
      entity: nextPlayer,
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

    if (ai.human) {
      return state;
    }

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
