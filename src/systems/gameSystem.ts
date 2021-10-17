import { createSystem } from '../ecs/createSystem';
import {
  componentName,
  getComponent,
  createGetSetForUniqComponent,
} from '../ecs/component';
import { AI, Entity, Game, State, Scene as GameScene } from '../ecs/type';
import { ECSEvent } from '../ecs/emitEvent';
import { handleStartCustomLevel } from './gameSystem/handleStartCustomLevel';
import {
  handleChangeColorBlindMode,
  handleChangeDifficulty,
  handleChangeMapType,
  handleChangeNextMap,
  handleChangePlayers,
  handleChangePrevMap,
  handleChangeQuickStart,
  handleReload,
  handleShowNewVersion,
} from './gameSystem/handleChangeSettings';
import { handleCleanScene } from './gameSystem/handleCleanScene';
import { handlePlayerClick } from './gameSystem/handlePlayerClick';
import { handleNextTurn } from './gameSystem/handleNextTurn';

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
    showNewVersion,
    reload,
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
    | ChangePrevMapEvent
    | ShowNewVersionEvent
    | ReloadEvent;

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

  export type ShowNewVersionEvent = ECSEvent<Type.showNewVersion, {}>;
  export type ReloadEvent = ECSEvent<Type.reload, {}>;
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
        case GameEvent.Type.showNewVersion:
          return handleShowNewVersion({ state, component, event });
        case GameEvent.Type.reload:
          return handleReload({ state, component, event });
      }
    },
  });
