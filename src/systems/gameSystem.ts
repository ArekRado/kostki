import { createSystem } from '../ecs/createSystem';
import {
  componentName,
  getAllComponents,
  getComponent,
  setComponent,
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

export const gameEntity = 'game';

export namespace GameEvent {
  export enum Type {
    startLevel,
    nextTurn,
    boxExplosion,
    playerClick,
  }

  export type All = StartLevelEvent | NextTurnEvent | PlayerClickEvent;

  export type StartLevelEvent = ECSEvent<Type.startLevel, {}>;
  export type NextTurnEvent = ECSEvent<Type.nextTurn, { ai: AI }>;
  export type PlayerClickEvent = ECSEvent<
    Type.playerClick,
    { boxEntity: Entity }
  >;
}

type MoveMarker = (params: {
  boxEntity: Entity;
  markerEntity: Entity;
  color: Color;
}) => void;
export const moveMarker: MoveMarker = ({ boxEntity, markerEntity, color }) => {
  const boxMesh = scene.getTransformNodeByUniqueId(parseInt(boxEntity));
  const markerMesh = scene.getMeshByUniqueId(parseInt(markerEntity));

  if (markerMesh && boxMesh) {
    (markerMesh.material as StandardMaterial).diffuseColor = new Color3(
      color[0],
      color[1],
      color[2]
    );
    markerMesh.position = new Vector3(
      boxMesh.position.x,
      boxMesh.position.y,
      boxMesh.position.z - 1
    );

    scene.beginAnimation(markerMesh, 0, 1, false);
  }
};

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

  const ai = currentAi; //? currentAi : getRandomAi({ state });

  if (!ai) {
    return state;
  }

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

  // TODO do not repeat same code as above
  state = setComponent<Game>({
    state,
    data: {
      ...component,
      gameStarted: true,
      currentPlayer: ai.entity,
    },
  });

  if (!ai.human) {
    const box = getAiMove({ state, ai });

    if (box) {
      state = onClickBox({ box, state, ai });
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
        moveMarker({
          boxEntity: box.entity,
          color: ai.color,
          markerEntity: component.markerEntity,
        });
        state = onClickBox({ box, state, ai });
        state = pushBoxToRotationQueue({ state, entity: box.entity });
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
      moveMarker({
        boxEntity: box.entity,
        color: ai.color,
        markerEntity: component.markerEntity,
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
    event: ({ state, component, event }) => {
      switch (event.type) {
        case GameEvent.Type.startLevel:
          return handleStartLevel({ state, component, event });
        case GameEvent.Type.nextTurn:
          return handleNextTurn({ state, component, event });
        case GameEvent.Type.playerClick:
          return handlePlayerClick({ state, component, event });
      }
    },
  });
