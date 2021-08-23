import { createSystem } from '../ecs/createSystem';
import {
  componentName,
  getComponentsByName,
  getComponent,
  setComponent,
  createGetSetForUniqComponent,
  removeComponentsByName,
} from '../ecs/component';
import {
  AI,
  Box,
  Entity,
  EventHandler,
  Game,
  Guid,
  State,
  Scene as GameScene,
} from '../ecs/type';
import { ECSEvent, emitEvent } from '../ecs/emitEvent';
import { getAiMove } from './aiSystem';
import { onClickBox, pushBoxToRotationQueue } from './boxSystem';

import { removeState, saveState } from '../utils/localDb';
import { setMarker } from './markerSystem';
import { boxWithGap } from '../blueprints/gridBlueprint';
import { setUi } from './uiSystem';
import { handleStartCustomLevel } from './gameSystem/handleStartCustomLevel';
import {
  handleChangeColorBlindMode,
  handleChangeDifficulty,
  handleChangeMapType,
  handleChangeNextMap,
  handleChangePlayers,
  handleChangePrevMap,
  handleChangeQuickStart,
} from './gameSystem/handleChangeSettings';

export const gameEntity = 'game';

export namespace GameEvent {
  export enum Type {
    startCustomLevel,
    nextTurn,
    boxExplosion,
    playerClick,
    cleanScene,

    changePlayers,
    changeDifficulty,
    changeQuickStart,
    changeColorBlindMode,
    changeMapType,
    changeNextMap,
    changePrevMap,
  }

  export type All =
    | StartCustomLevelEvent
    | NextTurnEvent
    | PlayerClickEvent
    | CleanSceneEvent
    | ChangePlayersEvent
    | ChangeDifficultyEvent
    | ChangeQuickStartEvent
    | ChangeColorBlindModeEvent
    | ChangeMapTypeEvent
    | ChangeNextMapEvent
    | ChangePrevMapEvent;

  export type StartCustomLevelEvent = ECSEvent<Type.startCustomLevel, {}>;
  export type NextTurnEvent = ECSEvent<Type.nextTurn, { ai: AI }>;
  export type PlayerClickEvent = ECSEvent<
    Type.playerClick,
    { boxEntity: Entity }
  >;
  export type CleanSceneEvent = ECSEvent<
    Type.cleanScene,
    { newScene: GameScene }
  >;

  export type ChangePlayersEvent = ECSEvent<Type.changePlayers, {}>;
  export type ChangeDifficultyEvent = ECSEvent<Type.changeDifficulty, {}>;
  export type ChangeQuickStartEvent = ECSEvent<Type.changeQuickStart, {}>;
  export type ChangeColorBlindModeEvent = ECSEvent<
    Type.changeColorBlindMode,
    {}
  >;
  export type ChangeMapTypeEvent = ECSEvent<Type.changeMapType, {}>;
  export type ChangeNextMapEvent = ECSEvent<Type.changeNextMap, {}>;
  export type ChangePrevMapEvent = ECSEvent<Type.changePrevMap, {}>;
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
export const getNextPlayer: GetNextPlayer = ({ state }) => {
  const game = getGame({ state });

  if (!game) {
    return undefined;
  }

  const currentPlayerIndex = game.playersQueue.findIndex(
    (entity) => game.currentPlayer === entity
  );

  const nextAi = getNextActivePlayer({
    playersQueue: game.playersQueue,
    index: currentPlayerIndex + 1,
    state,
  });

  return nextAi;
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

const handleCleanScene: EventHandler<Game, GameEvent.CleanSceneEvent> = ({
  state,
  event,
}) => {
  state = setUi({
    state,
    data: { type: event.payload.newScene, cleanControls: true },
  });
  state = setGame({
    state,
    data: {
      round: 0,
      grid: [],
      currentPlayer: '',
      playersQueue: [],
      boxRotationQueue: [],
      gameStarted: false,
    },
  });
  state = removeComponentsByName({ state, name: componentName.box });
  state = removeComponentsByName({ state, name: componentName.ai });

  return state;
};

export const gameSystem = (state: State) =>
  createSystem<Game, GameEvent.All>({
    state,
    name: componentName.game,
    // create: ({ state, component }) => {
    //   component.boxRotationQueue.forEach((boxEntity) => {
    //     const box = getComponent<Box>({
    //       state,
    //       name: componentName.box,
    //       entity: boxEntity,
    //     });

    //     const ai = getComponent<AI>({
    //       state,
    //       name: componentName.ai,
    //       entity: box?.player || '',
    //     });

    //     ai &&
    //       box &&
    //       emitEvent<BoxEvent.RotationEndEvent>({
    //         type: BoxEvent.Type.rotationEnd,
    //         entity: boxEntity,
    //         payload: { ai, shouldExplode: box.dots === 6 },
    //       });
    //   });

    //   return state;
    // },
    event: ({ state, component, event }) => {
      switch (event.type) {
        case GameEvent.Type.startCustomLevel:
          return handleStartCustomLevel({ state, component, event });
        case GameEvent.Type.nextTurn:
          return handleNextTurn({ state, component, event });
        case GameEvent.Type.playerClick:
          return handlePlayerClick({ state, component, event });
        case GameEvent.Type.cleanScene:
          return handleCleanScene({ state, component, event });

        case GameEvent.Type.changePlayers:
          return handleChangePlayers({ state, component, event });
        case GameEvent.Type.changeDifficulty:
          return handleChangeDifficulty({ state, component, event });
        case GameEvent.Type.changeQuickStart:
          return handleChangeQuickStart({ state, component, event });
        case GameEvent.Type.changeColorBlindMode:
          return handleChangeColorBlindMode({ state, component, event });
        case GameEvent.Type.changeMapType:
          return handleChangeMapType({ state, component, event });
        case GameEvent.Type.changeNextMap:
          return handleChangeNextMap({ state, component, event });
        case GameEvent.Type.changePrevMap:
          return handleChangePrevMap({ state, component, event });
      }
    },
  });
