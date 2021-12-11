import { createSystem } from '../ecs/createSystem';
import {
  componentName,
  getComponent,
  createGetSetForUniqComponent,
} from '../ecs/component';
import { AI, Entity, Game, State, Scene as GameScene, Page } from '../ecs/type';
import { create } from './gameSystem/create';
import { ECSEvent } from '../ecs/createEventSystem';

export const gameEntity = 'game';

export const shakeAnimationTimeout = 2000;

export namespace GameEvent {
  export enum Type {
    startCustomLevel = 'GameEvent-startCustomLevel',
    nextTurn = 'GameEvent-nextTurn',
    boxExplosion = 'GameEvent-boxExplosion',
    playerClick = 'GameEvent-playerClick',
    cleanScene = 'GameEvent-cleanScene',
    shakeAiBoxes = 'GameEvent-shakeAiBoxes',
    playAgainCustomLevel = 'GameEvent-playAgainCustomLevel',

    changePlayers = 'GameEvent-changePlayers',
    changeDifficulty = 'GameEvent-changeDifficulty',
    changeQuickStart = 'GameEvent-changeQuickStart',
    changeColorBlindMode = 'GameEvent-changeColorBlindMode',
    changeMapType = 'GameEvent-changeMapType',
    showNewVersion = 'GameEvent-showNewVersion',
    reload = 'GameEvent-reload',
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
    | ShowNewVersionEvent
    | ReloadEvent
    | PlayAgainCustomLevelEvent
    | ShakeAiBoxesEvent;

  export type StartCustomLevelEvent = ECSEvent<Type.startCustomLevel, {}>;
  export type NextTurnEvent = ECSEvent<Type.nextTurn, {}>;
  export type PlayAgainCustomLevelEvent = ECSEvent<
    Type.playAgainCustomLevel,
    {}
  >;
  export type ShakeAiBoxesEvent = ECSEvent<
    Type.shakeAiBoxes,
    { ai: AI; moves: number }
  >;
  export type PlayerClickEvent = ECSEvent<
    Type.playerClick,
    { boxEntity: Entity }
  >;
  export type CleanSceneEvent = ECSEvent<Type.cleanScene, { newPage: Page }>;

  export type ChangePlayersEvent = ECSEvent<Type.changePlayers, {}>;
  export type ChangeDifficultyEvent = ECSEvent<Type.changeDifficulty, {}>;
  export type ChangeQuickStartEvent = ECSEvent<Type.changeQuickStart, {}>;
  export type ChangeColorBlindModeEvent = ECSEvent<
    Type.changeColorBlindMode,
    {}
  >;
  export type ChangeMapTypeEvent = ECSEvent<Type.changeMapType, {}>;

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
    create,
  });
